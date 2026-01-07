import React, { useState } from 'react';
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
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';

interface GridProps {
    onNotificationClick: () => void;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
}

export default function Grid({ onNotificationClick, allPosts, onPostClick }: GridProps) {
    const { colors, isNightMode } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);

    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchTitle, setSearchTitle] = useState('');

    const [searchHistory, setSearchHistory] = useState<string[]>(['Sách giải tích 1', 'Máy tính cầm tay']);

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

    const performSearch = async (keyword: string) => {
        if (!keyword.trim()) return;
        
        setLoading(true);
        setIsSearching(true);
        setSearchTitle(`Đang tìm kiếm: "${keyword}"...`);
        setFilteredPosts([]);
        try {
            const response = await fetch(`${BASE_URL}/api/posts/search?keyword=${encodeURIComponent(keyword)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await handleApiError(response);
            
            const mappedPosts = mapApiResponseToPost(data);
            setFilteredPosts(mappedPosts);
            setSearchTitle(`Kết quả cho: "${keyword}"`);
            
        } catch (error) {
            console.error('Search error:', error);
            setSearchTitle(`Lỗi khi tìm kiếm`);
            Alert.alert("Lỗi", "Không thể tìm kiếm lúc này.");
        } finally {
            setLoading(false);
        }
    };

    const performFilter = async (categoryTitle: string) => {
        setLoading(true);
        setIsSearching(true);
        setSearchTitle(`Đang lọc danh mục: "${categoryTitle}"...`);
        setFilteredPosts([]);
        setSearchText(categoryTitle);

        try {
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
            console.error('Filter error:', error);
            Alert.alert("Lỗi", "Không thể lọc danh mục lúc này.");
        } finally {
            setLoading(false);
        }
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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.logoText, { color: colors.text }]}>
                    Quick<Text style={styles.logoHighlight}>Swap</Text>
                </Text>
                <TouchableOpacity onPress={onNotificationClick}>
                    <Ionicons name="notifications" size={24} color={colors.icon} />
                    <View style={styles.notificationBadge} />
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
                            filteredPosts.map((post) => (
                                <TouchableOpacity
                                    key={post.id}
                                    style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                                    onPress={() => onPostClick(post)}
                                >
                                    <View style={styles.postHeader}><Text style={[styles.postUser, { color: colors.text }]}>{post.user}</Text></View>
                                    <View style={[styles.postImageContainer, { backgroundColor: colors.iconBg }]}>
                                        {post.images && post.images.length > 0 ? (
                                            <Image source={{ uri: post.images[0] }} style={styles.postCardImage} resizeMode="cover" />
                                        ) : (
                                            <Ionicons name="image-outline" size={60} color={colors.subText} />
                                        )}
                                    </View>
                                    <View style={styles.postContent}>
                                        <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                                        <Text style={[styles.postTime, { color: colors.subText }]}>{post.time}</Text>
                                        <View style={styles.tagsContainer}>
                                            {post.tags.map((tag, idx) => (
                                                <View key={idx} style={[styles.tag, tag === 'Trao đổi' ? styles.tagBlue : styles.tagLightBlue]}>
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
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
                            <View style={[styles.phoneFrame, { borderColor: colors.border }]}>
                                <Ionicons name="search" size={80} color={colors.primary} style={styles.illustIcon} />
                                <View style={[styles.personMockup, { backgroundColor: isNightMode ? '#4B5563' : '#374151' }]} />
                            </View>
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

    illustrationContainer: { alignItems: 'center', marginTop: 40 },
    phoneFrame: { width: 180, height: 250, borderWidth: 1, borderRadius: 30, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    illustIcon: { opacity: 0.5 },
    personMockup: { position: 'absolute', bottom: 20, left: -20, width: 60, height: 120, borderRadius: 10 },

    resultsContainer: { marginTop: 10 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
    emptyState: { alignItems: 'center', marginTop: 50 },

    postCard: { borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 20 },
    postHeader: { marginBottom: 10 },
    postUser: { fontWeight: 'bold', fontSize: 16 },
    postImageContainer: { width: '100%', height: 180, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' },
    postCardImage: { width: '100%', height: '100%' },
    postContent: { marginBottom: 10 },
    postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    postTime: { fontSize: 12, marginBottom: 10 },
    tagsContainer: { flexDirection: 'row' },
    tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});