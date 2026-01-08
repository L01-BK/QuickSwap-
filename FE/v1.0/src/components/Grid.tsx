import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Keyboard,
    ActivityIndicator,
    Alert,
    AlertButton
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';
import UserProfile from './UserProfile';

import * as Sentry from '@sentry/react-native';

interface GridProps {
    onNotificationClick: () => void;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
    unreadCount: number;
}

export default function Grid({ onNotificationClick, allPosts, onPostClick, unreadCount }: GridProps) {
    const { colors, isNightMode } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);

    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchTitle, setSearchTitle] = useState('');

    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    
    const [bookmarkedIds, setBookmarkedIds] = useState<(string | number)[]>([]);

    const [viewingUser, setViewingUser] = useState<{id: string | number, name: string} | null>(null);

    useEffect(() => {
        const fetchSavedIds = async () => {
            if (user.token) {
                try {
                    const response = await fetch(`${BASE_URL}/api/users/me/saved`, {
                        headers: { 'Authorization': `Bearer ${user.token}` },
                    });
                    const data = await handleApiError(response);
                    if (Array.isArray(data)) {
                        const ids = data.map((item: any) => item.id);
                        setBookmarkedIds(ids);
                    }
                } catch (error) {
                    Sentry.captureException(error);
                    console.log('Failed to fetch saved list for ids in Grid:', error);
                }
            }
        };
        fetchSavedIds();
    }, [user.token]);

    const categories = [
        { id: 1, title: 'Tài liệu', icon: 'file-document', color: '#FFD700', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 2, title: 'Dụng cụ', icon: 'calculator', color: '#6B7280', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 3, title: 'Đồ mặc', icon: 'tshirt-crew', color: '#60A5FA', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 4, title: 'Khác', icon: 'package-variant-closed', color: '#A78BFA', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
    ];

    const addToHistory = (text: string) => {
        if (!text.trim()) return;
        setSearchHistory(prev => {
            const newHistory = [text, ...prev.filter(item => item !== text)];
            return newHistory.slice(0, 2);
        });
    };

    const mapApiResponseToPost = (dataList: any[]): Post[] => {
        return dataList.map((p: any) => ({
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
    };
    
    const handleShowContact = (item: any) => {
        const emailInfo = item.email ? item.email : "Chưa cập nhật";
        const phoneInfo = item.phone ? item.phone : "Chưa cập nhật";

        Alert.alert(
            "Thông tin liên hệ",
            `Người đăng: ${item.user}\n\n📧 Email: ${emailInfo}\n📞 SĐT: ${phoneInfo}`,
            [{ text: "Đóng", style: "cancel" }]
        );
    };

    const toggleBookmark = async (id: string | number) => {
        const isSaved = bookmarkedIds.includes(id);
        
        setBookmarkedIds(prev => 
            isSaved ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );

        try {
            const method = isSaved ? 'DELETE' : 'POST';
            const response = await fetch(`${BASE_URL}/api/posts/${id}/save`, {
                method: method,
                headers: { 'Authorization': `Bearer ${user.token}` },
            });

            if (!response.ok) {
                setBookmarkedIds(prev => 
                    isSaved ? [...prev, id] : prev.filter(itemId => itemId !== id)
                );
                handleApiError(response);
            }
        } catch (error) {
            Sentry.captureException(error);
            console.error('Bookmark error:', error);
            setBookmarkedIds(prev => 
                isSaved ? [...prev, id] : prev.filter(itemId => itemId !== id)
            );
        }
    };

    const handleDeletePost = async (postId: string | number) => {
        await Sentry.startSpan({ name: "Delete_Post_Grid", op: "http.client" }, async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` },
            });

            if (response.ok) {
                setFilteredPosts(prev => prev.filter(p => p.id !== postId));
                Alert.alert("Thành công", "Đã xóa bài viết.");
            } else {
                handleApiError(response);
            }
        } catch (error) {
            Sentry.captureException(error);
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
        }
        });
    };

    const handleShowOptions = (item: Post) => {
        const isOwner = user.id === item.userId;
        const options: AlertButton[] = [];

        if (isOwner) {
            options.push({
                text: 'Xóa bài đăng',
                style: 'destructive',
                onPress: () => {
                    Alert.alert(
                        "Xác nhận xóa",
                        "Bạn có chắc chắn muốn xóa bài viết này không?",
                        [
                            { text: "Hủy", style: "cancel" },
                            { text: "Xóa", style: "destructive", onPress: () => handleDeletePost(item.id) }
                        ]
                    );
                }
            });
        } else {

            options.push({
                text: 'Xem tài khoản người dùng',
                onPress: () => {
                    setViewingUser({
                        id: item.userId,
                        name: item.user
                    });
                }
            });
        }

        options.push({
            text: 'Hủy',
            style: 'cancel'
        });

        Alert.alert("Tùy chọn", isOwner ? "Quản lý bài viết của bạn" : `Bài viết của ${item.user}`, options);
    };

    const performSearch = async (keyword: string) => {
        if (!keyword.trim()) return;
        
        setLoading(true);
        setIsSearching(true);
        setSearchTitle(`Đang tìm kiếm: "${keyword}"...`);
        setFilteredPosts([]);
        await Sentry.startSpan({ name: "Search_Posts", op: "http.client" }, async (span) => {
        try {
            span?.setAttribute("keyword_length", keyword.length);
            const response = await fetch(`${BASE_URL}/api/posts/search?keyword=${encodeURIComponent(keyword)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await handleApiError(response);
            
            const mappedPosts = mapApiResponseToPost(data);
            setFilteredPosts(mappedPosts);
            setSearchTitle(`Kết quả cho: "${keyword}"`);
            Sentry.setTag("search_result_count", mappedPosts.length);
            
        } catch (error) {
            Sentry.captureException(error);
            console.error('Search error:', error);
            setSearchTitle(`Lỗi khi tìm kiếm`);
            Alert.alert("Lỗi", "Không thể tìm kiếm lúc này.");
        } finally {
            setLoading(false);
        }
        });
    };

    const performFilter = async (categoryTitle: string) => {
        setLoading(true);
        setIsSearching(true);
        setSearchTitle(`Đang lọc danh mục: "${categoryTitle}"...`);
        setFilteredPosts([]);
        setSearchText(categoryTitle);

        await Sentry.startSpan({ name: "Filter_Category", op: "http.client" }, async (span) => {
        try {
            span?.setAttribute("category", categoryTitle);
            const response = await fetch(`${BASE_URL}/api/posts/filter?tag=${encodeURIComponent(categoryTitle)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await handleApiError(response);

            let mappedPosts = mapApiResponseToPost(data);

            if (mappedPosts.length > 0) {
                mappedPosts = mappedPosts.filter(post => {
                    return post.tags && post.tags.some(tag => 
                        tag.toLowerCase().includes(categoryTitle.toLowerCase()) || 
                        categoryTitle.toLowerCase().includes(tag.toLowerCase())
                    );
                });
            }

            setFilteredPosts(mappedPosts);
            setSearchTitle(`Danh mục: ${categoryTitle}`);

        } catch (error) {
            Sentry.captureException(error);
            console.error('Filter error:', error);
            Alert.alert("Lỗi", "Không thể lọc danh mục lúc này.");
        } finally {
            setLoading(false);
        }
        });
    };

    const submitSearch = () => {
        if (searchText.trim()) {
            addToHistory(searchText);
            Keyboard.dismiss();
            performSearch(searchText);
        }
    };

    const handleCategorySelect = (categoryTitle: string) => {
        addToHistory(categoryTitle);
        performFilter(categoryTitle);
    };

    const handleHistoryClick = (text: string) => {
        setSearchText(text);
        performSearch(text);
    };

    const clearSearch = () => {
        setSearchText('');
        setIsSearching(false);
        setFilteredPosts([]);
        setLoading(false);
    };

    const renderPostItem = (item: Post) => (
        <TouchableOpacity
            key={item.id}
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
                <TouchableOpacity style={styles.footerIcon} onPress={() => toggleBookmark(item.id)}>
                    <Ionicons
                        name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={bookmarkedIds.includes(item.id) ? "#60A5FA" : colors.subText}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={() => handleShowOptions(item)}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.subText} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Tìm kiếm tiêu đề, danh mục..."
                        placeholderTextColor={colors.placeholder}
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={submitSearch}
                        returnKeyType="search"
                    />
                    {isSearching || searchText.length > 0 ? (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color={colors.placeholder} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={submitSearch}>
                            <Ionicons name="search-outline" size={20} color={colors.placeholder} style={styles.searchIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                {isSearching ? (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{searchTitle}</Text>
                            {!loading && <Text style={{ color: colors.subText }}>{filteredPosts.length} kết quả</Text>}
                        </View>

                        {loading ? (
                            <View style={{ marginTop: 50, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={{ color: colors.subText, marginTop: 10 }}>Đang tải dữ liệu...</Text>
                            </View>
                        ) : filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => renderPostItem(post))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="search" size={50} color={colors.border} />
                                <Text style={{ color: colors.subText, marginTop: 10 }}>Không tìm thấy bài viết nào.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bạn đang tìm gì?</Text>

                        <View style={styles.categoriesRow}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.categoryCard, { backgroundColor: cat.bgColor }]}
                                    onPress={() => handleCategorySelect(cat.title)}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={30} color={cat.color} />
                                    <Text style={[styles.categoryText, { color: isNightMode ? '#E5E7EB' : '#4B5563' }]}>{cat.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {searchHistory.length > 0 && (
                            <View style={styles.historySection}>
                                <Text style={[styles.historyTitle, { color: colors.text }]}>Tìm kiếm trước đó</Text>
                                {searchHistory.map((item, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <Text style={[styles.historyText, { color: colors.subText }]}>{item}</Text>
                                        <TouchableOpacity onPress={() => handleHistoryClick(item)}>
                                            <Ionicons name="arrow-forward" size={20} color={colors.placeholder} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.illustrationContainer}>
                            <Image 
                                source={require('../../assets/images/search.png')} 
                                style={styles.illustrationImage}
                                resizeMode="contain"
                            />
                        </View>
                    </>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    logoText: { fontSize: 24, fontWeight: 'bold' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
    content: { paddingHorizontal: 20, paddingBottom: 100 },

    searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, height: 45, marginTop: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    searchIcon: { marginLeft: 10 },

    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 25, marginBottom: 15 },
    categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    categoryCard: { width: '23%', aspectRatio: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 5 },
    categoryText: { marginTop: 5, fontSize: 14 },

    historySection: { marginTop: 10 },
    historyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    historyText: { fontSize: 15 },

    illustrationContainer: { 
        alignItems: 'center', 
        marginTop: 40,
        marginBottom: 20
    },
    
    illustrationImage: {
        width: 300, 
        height: 250,
    },

    resultsContainer: { marginTop: 10 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
    emptyState: { alignItems: 'center', marginTop: 50 },

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
});