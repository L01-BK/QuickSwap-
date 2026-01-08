import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';
import { useThemeColors } from '../hooks/useThemeColors';

import * as Sentry from '@sentry/react-native';

interface UserProfileProps {
    userId: string | number;
    initialName?: string;
    onBack: () => void;
}

interface PublicUserInfo {
    id: number;
    name: string;
    username: string;
    handle: string;
    avatarUrl: string | null;
    university: string | null;
    address: string | null;
    rating: number; 
    email?: string;
    phone?: string;
}

interface ReviewItem {
    id: number;
    raterId: number;
    ratedId: number;
    score: number;
    comment: string;
    createdAt: string;
}

interface RatingSummary {
    count: number;
    average: number;
}

export default function UserProfile({ userId, initialName, onBack }: UserProfileProps) {
    const { colors, isNightMode } = useThemeColors();
    const currentUser = useSelector((state: RootState) => state.user);
    
    const [userData, setUserData] = useState<PublicUserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [ratingSummary, setRatingSummary] = useState<RatingSummary>({ count: 0, average: 0 });
    
    const [modalVisible, setModalVisible] = useState(false);
    const [submitScore, setSubmitScore] = useState(5);
    const [submitComment, setSubmitComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const renderStars = (rating: number, size = 20, interactive = false, setRating?: (val: number) => void) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const name = i <= Math.floor(rating) ? "star" : (i === Math.ceil(rating) && !Number.isInteger(rating) ? "star-half" : "star-outline");
            
            if (interactive && setRating) {
                stars.push(
                    <TouchableOpacity key={i} onPress={() => setRating(i)}>
                        <Ionicons name={i <= rating ? "star" : "star-outline"} size={size} color="#FFD700" style={{ marginHorizontal: 2 }} />
                    </TouchableOpacity>
                );
            } else {
                stars.push(<Ionicons key={i} name={name} size={size} color="#FFD700" />);
            }
        }
        return stars;
    };

    const fetchAllData = async () => {
        if (!currentUser.token || !userId) return;
        await Sentry.startSpan({ name: "Fetch_Public_Profile", op: "http.client" }, async (span) => {
        try {
            span?.setAttribute("target_user_id", userId);
            const userRes = await fetch(`${BASE_URL}/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
            });
            const userData = await handleApiError(userRes);
            setUserData(userData);

            const summaryRes = await fetch(`${BASE_URL}/api/users/${userId}/rating-summary`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
            });
            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                setRatingSummary(summaryData);
            }

            const listRes = await fetch(`${BASE_URL}/api/users/${userId}/ratings`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
            });
            if (listRes.ok) {
                const listData = await listRes.json();
                setReviews(listData);
            }

        } catch (error) {
            Sentry.captureException(error);
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
        });
    };

    useEffect(() => {
        fetchAllData();
    }, [userId, currentUser.token]);

    const handleOpenModal = () => {
        setSubmitScore(5);
        setSubmitComment('');
        setModalVisible(true);
    };


const handleSubmitRating = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await Sentry.startSpan({ name: "Submit_User_Rating", op: "user.action" }, async () => {
    try {

        const response = await fetch(`${BASE_URL}/api/users/${userId}/rate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: submitScore,
                comment: submitComment
            })
        });

        await handleApiError(response);

        try {
            const notiPayload = {
                title: "Bạn nhận được đánh giá mới",
                body: `${currentUser.name} đã đánh giá bạn ${submitScore} sao: "${submitComment}"`,
                type: "RATING" 
            };

            await fetch(`${BASE_URL}/api/notifications/send-to-user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(notiPayload),
            });
            
            console.log("Đã gửi thông báo đánh giá thành công");
        } catch (notiError) {
            console.log("Lỗi gửi thông báo:", notiError);
        }

        Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!");
        setModalVisible(false);

        setSubmitComment('');
        setSubmitScore(5);
        Sentry.addBreadcrumb({
                    category: "rating",
                    message: `User rated target ${userId} with score ${submitScore}`,
                    level: "info"
                });
        fetchAllData(); 

    } catch (error) {
        Sentry.captureException(error);
        console.error("Lỗi gửi đánh giá:", error);
        Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
        setIsSubmitting(false);
    }
    });
};

    const cardBg = isNightMode ? '#1E1E1E' : '#fff';
    const subTextColor = isNightMode ? '#aaa' : '#555';
    const dividerColor = isNightMode ? '#333' : '#F3F4F6';
    const inputBg = isNightMode ? '#333' : '#f9f9f9';

    const renderField = (label: string, value: string | null | undefined, isLink = false) => (
        <>
            <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                <Text style={[styles.value, isLink && value && styles.link, { color: subTextColor }]}>
                    {value || "Chưa cập nhật"}
                </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        </>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Thông tin người dùng</Text>
                
                {/* Nút mở Modal đánh giá: Luôn hiện nếu không phải chính mình */}
                {Number(userId) !== Number(currentUser.id) && (
                    <TouchableOpacity onPress={handleOpenModal} style={styles.rateButton}>
                        <Ionicons name="star" size={26} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarPlaceholder}>
                                <Image
                                    source={{ uri: userData?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                                    style={styles.avatar}
                                />
                            </View>
                        </View>
                        <Text style={[styles.nameText, { color: colors.text }]}>
                            {userData?.name || initialName || "Người dùng"}
                        </Text>
                        <Text style={{ color: subTextColor }}>
                            {userData?.handle ? `@${userData.handle}` : (userData?.username ? `@${userData.username}` : '')}
                        </Text>
                    </View>

                    {/* Info Card */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <View style={styles.row}>
                            <Text style={[styles.label, { color: colors.text }]}>Đánh giá chung</Text>
                            <View style={styles.ratingContainer}>
                                {renderStars(ratingSummary.average || userData?.rating || 0)}
                                <Text style={[styles.ratingText, { color: colors.text }]}>
                                    {ratingSummary.average ? ratingSummary.average.toFixed(1) : (userData?.rating || 0)}
                                    <Text style={{fontSize: 12, fontWeight: 'normal', color: subTextColor}}> ({ratingSummary.count} lượt)</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                        {renderField('Trường', userData?.university)}
                        {renderField('Địa chỉ', userData?.address)}
                    </View>

                    {/* Danh sách Reviews */}
                    <View style={[styles.reviewsContainer, { backgroundColor: cardBg }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bài đánh giá ({reviews.length})</Text>
                        {reviews.length === 0 ? (
                            <Text style={{ color: subTextColor, fontStyle: 'italic', textAlign: 'center', marginTop: 10 }}>Chưa có đánh giá nào.</Text>
                        ) : (
                            reviews.map((item) => (
                                <View key={item.id} style={[styles.reviewItem, { borderBottomColor: dividerColor }]}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={[styles.reviewerName, { color: colors.text }]}>Người dùng #{item.raterId}</Text>
                                        <Text style={{ color: subTextColor, fontSize: 12 }}>{formatDate(item.createdAt)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        {renderStars(item.score, 14)}
                                    </View>
                                    <Text style={{ color: colors.text }}>{item.comment}</Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}

            {/* MODAL ĐÁNH GIÁ - Luôn ở chế độ tạo mới */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Đánh giá người dùng</Text>
                        
                        <View style={styles.starSelectContainer}>
                            {renderStars(submitScore, 40, true, setSubmitScore)}
                        </View>

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: inputBg, color: colors.text, borderColor: dividerColor }]}
                            placeholder="Nhập nhận xét của bạn..."
                            placeholderTextColor={subTextColor}
                            multiline
                            numberOfLines={4}
                            value={submitComment}
                            onChangeText={setSubmitComment}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.cancelBtn]} 
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.submitBtn]} 
                                onPress={handleSubmitRating}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Gửi</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
    backButton: { padding: 5 },
    rateButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    scrollContent: { paddingBottom: 40, alignItems: 'center' },
    profileHeader: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    avatarContainer: { marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', borderWidth: 4, borderColor: '#fff', backgroundColor: '#e1e1e1' },
    avatar: { width: '100%', height: '100%' },
    nameText: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    card: { width: '90%', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    divider: { height: 1 },
    label: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    value: { fontSize: 16, textAlign: 'right', flex: 2 },
    link: { textDecorationLine: 'underline' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
    
    reviewsContainer: { width: '90%', borderRadius: 16, padding: 20, marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    reviewItem: { paddingVertical: 12, borderBottomWidth: 1 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    reviewerName: { fontWeight: 'bold', fontSize: 14 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    starSelectContainer: { flexDirection: 'row', marginBottom: 20 },
    modalInput: { width: '100%', height: 100, borderRadius: 8, padding: 10, borderWidth: 1, textAlignVertical: 'top', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    cancelBtn: { backgroundColor: '#e0e0e0', marginRight: 10 },
    submitBtn: { backgroundColor: '#60A5FA' },
    cancelBtnText: { color: '#333', fontWeight: 'bold' },
    submitBtnText: { color: '#fff', fontWeight: 'bold' },
});