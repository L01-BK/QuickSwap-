import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';
import { useThemeColors } from '../hooks/useThemeColors';

interface UserProfileProps {
    userId: string | number;
    initialName?: string;
    onBack: () => void;
}

export default function UserProfile({ userId, initialName, onBack }: UserProfileProps) {
    const { colors, isNightMode } = useThemeColors();
    const currentUser = useSelector((state: RootState) => state.user);
    
    const [userData, setUserData] = useState<any>({
        name: initialName || 'Người dùng',
        username: '...',
        avatarUrl: null,
        rating: 0,
        email: 'Đang tải...',
        phone: 'Đang tải...',
        university: '...',
        address: '...'
    });
    const [loading, setLoading] = useState(true);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<Ionicons key={i} name="star" size={20} color="#FFD700" />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<Ionicons key={i} name="star-half" size={20} color="#FFD700" />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={20} color="#FFD700" />);
            }
        }
        return stars;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!currentUser.token || !userId) {
                console.log("Thiếu Token hoặc UserId");
                setLoading(false);
                return;
            }

            console.log("Đang tải thông tin cho User ID:", userId);

            try {
                const url = `${BASE_URL}/api/users/${userId}`;
                console.log("Gọi API:", url);

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${currentUser.token}` },
                });

                console.log("Trạng thái phản hồi:", response.status);

                const data = await handleApiError(response);
                setUserData(data);
            } catch (error) {
                console.error("Chi tiết lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId, currentUser.token]);

    const handleRateUser = () => {
        Alert.alert(
            "Đánh giá người dùng",
            `Bạn muốn đánh giá bao nhiêu sao cho ${userData.name}?`,
            [
                { text: "Hủy", style: "cancel" },
                { text: "5 Sao", onPress: () => Alert.alert("Cảm ơn", "Đã gửi đánh giá!") }
            ]
        );
    };

    const cardBg = isNightMode ? '#1E1E1E' : '#fff';
    const subTextColor = isNightMode ? '#aaa' : '#555';
    const dividerColor = isNightMode ? '#333' : '#F3F4F6';

    const renderField = (label: string, value: string, isLink = false) => (
        <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <Text style={[styles.value, isLink && styles.link, { color: subTextColor }]}>
                {value || "Chưa cập nhật"}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Thông tin người dùng</Text>
                
                {/* NÚT ĐÁNH GIÁ (Thay thế nút Edit) */}
                <TouchableOpacity onPress={handleRateUser} style={styles.rateButton}>
                    <Ionicons name="star-outline" size={26} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Profile Header Block */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarPlaceholder}>
                                <Image
                                    source={{ uri: userData.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                                    style={styles.avatar}
                                />
                            </View>
                        </View>

                        <Text style={[styles.nameText, { color: colors.text }]}>{userData.name}</Text>
                        <Text style={{ color: subTextColor }}>@{userData.username || 'unknown'}</Text>
                    </View>

                    {/* Info Card */}
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <View style={styles.row}>
                            <Text style={[styles.label, { color: colors.text }]}>Đánh giá</Text>
                            <View style={styles.ratingContainer}>
                                {renderStars(userData.rating || 0)}
                                <Text style={[styles.ratingText, { color: colors.text }]}>{userData.rating || 0}</Text>
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                        {renderField('Email', userData.email, true)}
                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                        {renderField('SĐT', userData.phone)}
                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                        {renderField('Trường', userData.university)}
                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                        {renderField('Địa chỉ', userData.address)}
                    </View>
                </ScrollView>
            )}
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
});