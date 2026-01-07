import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, AlertButton, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';

interface BookmarkProps {
    onPostClick: (post: Post) => void;
    onNotificationClick: () => void;
    unreadCount: number;
}

export default function Bookmark({
    onPostClick,
    onNotificationClick,
    unreadCount
}: BookmarkProps) {
    const { colors } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSavedPosts = async () => {
        if (!user.token) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/users/me/saved`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await handleApiError(response);

            if (Array.isArray(data)) {
                const mappedPosts: Post[] = data.map((p: any) => ({
                    id: p.id,
                    userId: p.user?.id,
                    user: p.user?.name || 'Người dùng ẩn',
                    email: p.user?.email || null,
                    phone: p.user?.phoneNumber || p.user?.phone || null,
                    title: p.title,
                    time: p.time || 'Vừa xong',
                    tags: p.tags || [],
                    content: p.content,
                    info: p.info ? Object.entries(p.info).map(([k, v]) => `${k}: ${v}`) : [],
                    images: p.imageUrls || []
                }));
                setSavedPosts(mappedPosts);
            }
        } catch (error) {
            console.error('Failed to fetch saved posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, [user.token]);

    const handleUnsave = async (id: string | number) => {
        Alert.alert(
            "Bỏ lưu",
            "Bạn có muốn bỏ lưu bài viết này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BASE_URL}/api/posts/${id}/save`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${user.token}` },
                            });

                            if (response.ok) {
                                setSavedPosts(prev => prev.filter(p => p.id !== id));
                            } else {
                                handleApiError(response);
                            }
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể cập nhật trạng thái lưu.");
                        }
                    }
                }
            ]
        );
    };

    const handleShowContact = (item: Post) => {
        const emailInfo = item.email ? item.email : "Chưa cập nhật";
        const phoneInfo = item.phone ? item.phone : "Chưa cập nhật";

        Alert.alert(
            "Thông tin liên hệ",
            `Người đăng: ${item.user}\n\n📧 Email: ${emailInfo}\n📞 SĐT: ${phoneInfo}`,
            [{ text: "Đóng", style: "cancel" }]
        );
    };

    const handleShowOptions = (item: Post) => {
        const options: AlertButton[] = [];
        
        options.push({
            text: 'Đánh giá người dùng',
            onPress: () => Alert.alert("Thông báo", `Chức năng đánh giá user ${item.user} đang phát triển.`)
        });

        options.push({
            text: 'Hủy',
            style: 'cancel'
        });

        Alert.alert("Tùy chọn", `Bài viết của ${item.user}`, options);
    };

    const renderPostItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPostClick(item)}
        >
            <View style={styles.postHeader}>
                <Text style={[styles.postUser, { color: colors.text }]}>{item.user}</Text>
            </View>
            
            <View style={[styles.postImageContainer, { backgroundColor: colors.iconBg }]}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0] }} style={styles.postCardImage} resizeMode="cover" />
                ) : (
                    <Ionicons name="image-outline" size={60} color={colors.subText} />
                )}
            </View>
            
            <View style={styles.postContent}>
                <Text style={[styles.postTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.postTime, { color: colors.subText }]}>{item.time}</Text>
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag, idx) => (
                        <View key={idx} style={[styles.tag, tag === 'Trao đổi' ? styles.tagBlue : styles.tagLightBlue]}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={[styles.postFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.footerIcon} onPress={() => handleShowContact(item)}>
                    <Ionicons name="chatbubble-outline" size={20} color={colors.subText} />
                </TouchableOpacity>
                
                {/* Nút Bookmark luôn sáng màu vì đây là trang Bookmark, bấm vào để Bỏ lưu */}
                <TouchableOpacity style={styles.footerIcon} onPress={() => handleUnsave(item.id)}>
                    <Ionicons
                        name="bookmark"
                        size={20}
                        color="#60A5FA" 
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.footerIcon} onPress={() => handleShowOptions(item)}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.subText} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.logoText, { color: colors.text }]}>
                    Quick<Text style={styles.logoHighlight}>Swap</Text>
                </Text>
                <TouchableOpacity onPress={onNotificationClick}>
                    <Ionicons name="notifications" size={24} color={colors.icon} />
                    {unreadCount > 0 && <View style={styles.notificationBadge} />}
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <Text style={[styles.screenTitle, { color: colors.text }]}>BÀI ĐĂNG ĐÃ LƯU</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#60A5FA" style={{ marginTop: 20 }} />
                ) : savedPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.subText }]}>Chưa có bài đăng nào được lưu.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={savedPosts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPostItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    logoText: { fontSize: 24, fontWeight: 'bold' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
    
    screenTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
    
    postCard: { borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 20 },
    postHeader: { marginBottom: 10 },
    postUser: { fontWeight: 'bold', fontSize: 16 },
    postImageContainer: { width: '100%', height: 200, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' },
    postCardImage: { width: '100%', height: '100%' },
    postContent: { marginBottom: 10 },
    postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    postTime: { fontSize: 12, marginBottom: 10 },
    tagsContainer: { flexDirection: 'row' },
    tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    postFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1 },
    footerIcon: { padding: 5 },
    
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16 }
});