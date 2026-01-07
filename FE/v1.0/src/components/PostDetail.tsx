import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, AlertButton, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo } from '../store/reducer/navigationSlice';
import { useThemeColors } from '../hooks/useThemeColors';
import { BASE_URL, handleApiError } from '../utils/api';
import { Post } from '../types';

import UserProfile from './UserProfile'; // Import thêm component UserProfile

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostDetail() {
    const dispatch = useDispatch();
    const initialPost = useSelector((state: RootState) => state.navigation.selectedPost);
    const user = useSelector((state: RootState) => state.user);
    const onBack = () => dispatch(navigateTo('home'));

    const { colors } = useThemeColors();
    const [post, setPost] = useState<Post | null>(initialPost);
    
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    // Thêm state viewingUser giống Home.tsx
    const [viewingUser, setViewingUser] = useState<{id: string | number, name: string} | null>(null);
    
    const cardWidth = SCREEN_WIDTH - 40;

    if (!initialPost) {
        return null;
    }

    useEffect(() => {
        const fetchPostDetailAndStatus = async () => {
            if (initialPost?.id) {
                try {
                    const response = await fetch(`${BASE_URL}/api/posts/${initialPost.id}`, {
                        headers: { 'Authorization': `Bearer ${user.token}` },
                    });
                    const data = await handleApiError(response);
                    
                    const mappedPost: Post = {
                        id: data.id,
                        userId: data.user?.id,
                        user: data.user?.name || 'Người dùng ẩn',
                        email: data.user?.email || null,
                        phone: data.user?.phoneNumber || data.user?.phone || null,
                        title: data.title,
                        time: data.time || 'Vừa xong',
                        tags: data.tags || [],
                        content: data.content,
                        info: data.info ? Object.entries(data.info).map(([k, v]) => `${k}: ${v}`) : [],
                        images: data.imageUrls || []
                    };
                    setPost(mappedPost);

                    const savedRes = await fetch(`${BASE_URL}/api/users/me/saved`, {
                        headers: { 'Authorization': `Bearer ${user.token}` },
                    });
                    const savedData = await handleApiError(savedRes);
                    if(Array.isArray(savedData)) {
                        const found = savedData.find((p: any) => p.id === initialPost.id);
                        setIsBookmarked(!!found);
                    }

                } catch (error) {
                    console.error('Failed to fetch post details:', error);
                }
            }
        };

        fetchPostDetailAndStatus();
    }, [initialPost?.id, user.token]);


    const handleShowContact = () => {
        const currentPost: any = post || initialPost;
        if (!currentPost) return;

        const emailInfo = currentPost.email ? currentPost.email : "Chưa cập nhật";
        const phoneInfo = currentPost.phone ? currentPost.phone : "Chưa cập nhật";

        Alert.alert(
            "Thông tin liên hệ",
            `Người đăng: ${currentPost.user}\n\n📧 Email: ${emailInfo}\n📞 SĐT: ${phoneInfo}`,
            [{ text: "Đóng", style: "cancel" }]
        );
    };

    const handleToggleBookmark = async () => {
        if (!post) return;
        const currentStatus = isBookmarked;
        
        setIsBookmarked(!currentStatus);

        try {
            const method = currentStatus ? 'DELETE' : 'POST';
            const response = await fetch(`${BASE_URL}/api/posts/${post.id}/save`, {
                method: method,
                headers: { 'Authorization': `Bearer ${user.token}` },
            });

            if (!response.ok) {
                setIsBookmarked(currentStatus);
                handleApiError(response);
            }
        } catch (error) {
            setIsBookmarked(currentStatus);
            console.error('Bookmark error:', error);
        }
    };

    const displayPost = post || initialPost;

    // Cập nhật hàm này để giống logic Home.tsx
    const handleDetailOptions = () => {
        const currentPost = post || initialPost;
        if (!currentPost) return;

        const isOwner = user.id === currentPost.userId;
        const options: AlertButton[] = [];

        if (isOwner) {
            options.push({
                text: 'Xóa bài đăng',
                style: 'destructive',
                onPress: () => {
                    Alert.alert(
                        "Cảnh báo",
                        "Bạn có chắc chắn muốn xóa bài này? Hành động này sẽ xóa vĩnh viễn.",
                        [
                            { text: "Hủy", style: "cancel" },
                            { 
                                text: "Xóa ngay", 
                                style: "destructive", 
                                onPress: async () => {
                                    try {
                                        const res = await fetch(`${BASE_URL}/api/posts/${currentPost.id}`, {
                                            method: 'DELETE',
                                            headers: { 'Authorization': `Bearer ${user.token}` }
                                        });

                                        if (res.ok) {
                                            Alert.alert("Đã xóa", "Bài viết đã được xóa thành công.", [
                                                { text: "OK", onPress: () => dispatch(navigateTo('home')) } 
                                            ]);
                                        } else {
                                            Alert.alert("Lỗi", "Không thể xóa bài viết này.");
                                        }
                                    } catch (e) {
                                        Alert.alert("Lỗi kết nối", "Vui lòng kiểm tra mạng.");
                                    }
                                }
                            }
                        ]
                    );
                }
            });
        } else {
            options.push({
                text: 'Xem tài khoản người dùng',
                onPress: () => {
                    setViewingUser({
                        id: currentPost.userId,
                        name: currentPost.user
                    });
                }
            });
        }

        options.push({ text: 'Hủy', style: 'cancel' });
        Alert.alert("Tùy chọn", isOwner ? "Quản lý bài viết" : `Bài viết của ${currentPost.user}`, options);
    };

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / cardWidth);
        setActiveImageIndex(currentIndex);
    };

    // Render UserProfile nếu đang xem user
    if (viewingUser) {
        return (
            <UserProfile 
                userId={viewingUser.id} 
                initialName={viewingUser.name}
                onBack={() => setViewingUser(null)}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.subText }]}>Bài viết của {displayPost.user}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.userSection, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.userName, { color: colors.text }]}>{displayPost.user}</Text>
                    </View>

                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.iconBg }]}>
                        {displayPost.images && displayPost.images.length > 0 ? (
                            <FlatList
                                data={displayPost.images}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, index) => index.toString()}
                                onMomentumScrollEnd={onMomentumScrollEnd}
                                renderItem={({ item }) => (
                                    <Image 
                                        source={{ uri: item }} 
                                        style={[styles.postImage, { width: cardWidth }]} 
                                        resizeMode="cover" 
                                    />
                                )}
                            />
                        ) : (
                            <Ionicons name="image-outline" size={80} color={colors.subText} />
                        )}
                    </View>

                    {displayPost.images && displayPost.images.length > 1 && (
                        <View style={[styles.paginationDots, { backgroundColor: colors.iconBg }]}>
                            {displayPost.images.map((_, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.dot, 
                                        index === activeImageIndex ? styles.dotActive : { backgroundColor: colors.border }
                                    ]} 
                                />
                            ))}
                        </View>
                    )}

                    <View style={styles.detailsContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>{displayPost.title}</Text>
                        <Text style={[styles.time, { color: colors.subText }]}>{displayPost.time}</Text>
                        <View style={styles.tagsContainer}>
                            {displayPost.tags.map((tag: string, index: number) => (
                                <View key={index} style={[styles.tag, tag === 'Trao đổi' ? styles.tagBlue : styles.tagLightBlue]}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                        {displayPost.content && (
                            <>
                                <Text style={[styles.sectionHeader, { color: colors.text }]}>Nội dung bài đăng</Text>
                                <Text style={[styles.description, { color: colors.subText }]}>{displayPost.content}</Text>
                            </>
                        )}
                        {displayPost.info && displayPost.info.length > 0 && (
                            <>
                                <Text style={[styles.sectionHeader, { color: colors.text }]}>Thông tin thêm</Text>
                                {displayPost.info.map((line: string, index: number) => (
                                    <Text key={index} style={[styles.infoLine, { color: colors.subText }]}>{line}</Text>
                                ))}
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.iconButton} onPress={handleShowContact}>
                    <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={handleToggleBookmark}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isBookmarked ? "#60A5FA" : colors.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={handleDetailOptions}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 16, fontWeight: '500' },
    scrollContent: { padding: 20 },
    card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
    userSection: { padding: 15, borderBottomWidth: 1 },
    userName: { fontWeight: 'bold', fontSize: 16 },
    imagePlaceholder: { width: '100%', height: 300, alignItems: 'center', justifyContent: 'center' },
    postImage: { width: '100%', height: '100%' },
    paginationDots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
    dot: { width: 30, height: 4, marginHorizontal: 2, borderRadius: 2 },
    dotActive: { backgroundColor: '#60A5FA' },
    detailsContainer: { padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    time: { fontSize: 14, marginBottom: 10 },
    tagsContainer: { flexDirection: 'row', marginBottom: 20 },
    tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    sectionHeader: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
    description: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
    infoLine: { fontSize: 14, lineHeight: 22 },
    bottomBar: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingVertical: 10 },
    iconButton: { padding: 10 },
});