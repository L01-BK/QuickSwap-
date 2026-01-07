import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Keyboard
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';

interface GridProps {
    onNotificationClick: () => void;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
}

export default function Grid({ onNotificationClick, allPosts, onPostClick }: GridProps) {
    const { colors, isNightMode } = useThemeColors();
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchTitle, setSearchTitle] = useState('');

    const [searchHistory, setSearchHistory] = useState<string[]>(['Sách giải tích 1', 'Máy tính cầm tay']);

    const categories = [
        { id: 1, title: 'Tài liệu', icon: 'file-document', color: '#FFD700', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 2, title: 'Dụng cụ', icon: 'calculator', color: '#6B7280', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 3, title: 'Đồ mặc', icon: 'tshirt-crew', color: '#60A5FA', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
        { id: 4, title: 'Khác', icon: 'package-variant-closed', color: '#A78BFA', bgColor: isNightMode ? '#374151' : '#E0F2FE' },
    ]; // Thêm NightMode vào categories


    const addToHistory = (text: string) => {
        if (!text.trim()) return;

        setSearchHistory(prev => {
            const newHistory = [text, ...prev.filter(item => item !== text)];
            return newHistory.slice(0, 2);
        });
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text.trim() === '') {
            setIsSearching(false);
            return;
        }

        const lowerKeyword = text.toLowerCase();
        const results = allPosts.filter(post =>
            post.title.toLowerCase().includes(lowerKeyword)
        );

        setFilteredPosts(results);
        setSearchTitle(`Kết quả cho: "${text}"`);
        setIsSearching(true);
    };

    const submitSearch = () => {
        if (searchText.trim()) {
            addToHistory(searchText);
            Keyboard.dismiss();
        }
    };

    const handleCategorySelect = (categoryTitle: string) => {
        addToHistory(categoryTitle);

        const results = allPosts.filter(post =>
            post.tags.includes(categoryTitle) ||
            (post.info && post.info.some(i => i.includes(categoryTitle)))
        );

        setSearchText(categoryTitle);
        setFilteredPosts(results);
        setSearchTitle(`Danh mục: ${categoryTitle}`);
        setIsSearching(true);
    };

    const clearSearch = () => {
        setSearchText('');
        setIsSearching(false);
        setFilteredPosts([]);
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
                        onChangeText={handleSearch}
                        onSubmitEditing={submitSearch}
                    />
                    {isSearching ? (
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
                            <Text style={{ color: colors.subText }}>{filteredPosts.length} kết quả</Text>
                        </View>

                        {filteredPosts.length > 0 ? (
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
                                        <TouchableOpacity onPress={() => handleSearch(item)}>
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
