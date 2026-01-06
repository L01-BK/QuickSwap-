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
import { Post } from './PostDetail';

interface GridProps {
    onNotificationClick: () => void;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
}

export default function Grid({ onNotificationClick, allPosts, onPostClick }: GridProps) {
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchTitle, setSearchTitle] = useState('');

    const [searchHistory, setSearchHistory] = useState<string[]>(['Sách giải tích 1', 'Máy tính cầm tay']);

    const categories = [
        { id: 1, title: 'Tài liệu', icon: 'file-document', color: '#FFD700', bgColor: '#E0F2FE' },
        { id: 2, title: 'Dụng cụ', icon: 'calculator', color: '#6B7280', bgColor: '#E0F2FE' },
        { id: 3, title: 'Đồ mặc', icon: 'tshirt-crew', color: '#60A5FA', bgColor: '#E0F2FE' },
        { id: 4, title: 'Khác', icon: 'package-variant-closed', color: '#A78BFA', bgColor: '#E0F2FE' },
    ];

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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>
                    Quick<Text style={styles.logoHighlight}>Swap</Text>
                </Text>
                <TouchableOpacity onPress={onNotificationClick}>
                    <Ionicons name="notifications" size={24} color="#000" />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                
                <View style={styles.searchContainer}>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tiêu đề, danh mục..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={handleSearch}
                        onSubmitEditing={submitSearch} 
                    />
                    {isSearching ? (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={submitSearch}>
                            <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                {isSearching ? (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultHeader}>
                            <Text style={styles.sectionTitle}>{searchTitle}</Text>
                            <Text style={{color: '#888'}}>{filteredPosts.length} kết quả</Text>
                        </View>

                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <TouchableOpacity key={post.id} style={styles.postCard} onPress={() => onPostClick(post)}>
                                    <View style={styles.postHeader}><Text style={styles.postUser}>{post.user}</Text></View>
                                    <View style={styles.postImageContainer}>
                                        {post.images && post.images.length > 0 ? (
                                            <Image source={{ uri: post.images[0] }} style={styles.postCardImage} resizeMode="cover" />
                                        ) : (
                                            <Ionicons name="image-outline" size={60} color="#ccc" />
                                        )}
                                    </View>
                                    <View style={styles.postContent}>
                                        <Text style={styles.postTitle}>{post.title}</Text>
                                        <Text style={styles.postTime}>{post.time}</Text>
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
                                <Ionicons name="search" size={50} color="#E5E7EB" />
                                <Text style={{color: '#9CA3AF', marginTop: 10}}>Không tìm thấy bài viết nào.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Bạn đang tìm gì?</Text>

                        <View style={styles.categoriesRow}>
                            {categories.map((cat) => (
                                <TouchableOpacity 
                                    key={cat.id} 
                                    style={[styles.categoryCard, { backgroundColor: cat.bgColor }]}
                                    onPress={() => handleCategorySelect(cat.title)}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={30} color={cat.color} />
                                    <Text style={styles.categoryText}>{cat.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {searchHistory.length > 0 && (
                            <View style={styles.historySection}>
                                <Text style={styles.historyTitle}>Tìm kiếm trước đó</Text>
                                {searchHistory.map((item, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <Text style={styles.historyText}>{item}</Text>
                                        <TouchableOpacity onPress={() => handleSearch(item)}>
                                            <Ionicons name="arrow-forward" size={20} color="#999" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.illustrationContainer}>
                            <View style={styles.phoneFrame}>
                                <Ionicons name="search" size={80} color="#60A5FA" style={styles.illustIcon} />
                                <View style={styles.personMockup} /> 
                            </View>
                        </View>
                    </>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    logoText: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
    content: { paddingHorizontal: 20, paddingBottom: 100 },
    
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, height: 45, marginTop: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    searchIcon: { marginLeft: 10 },
    
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 25, marginBottom: 15 },
    categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    categoryCard: { width: '23%', aspectRatio: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 5 },
    categoryText: { marginTop: 5, fontSize: 14, color: '#4B5563' },
    
    historySection: { marginTop: 10 },
    historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
    historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    historyText: { fontSize: 15, color: '#9CA3AF' },
    
    illustrationContainer: { alignItems: 'center', marginTop: 40 },
    phoneFrame: { width: 180, height: 250, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 30, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    illustIcon: { opacity: 0.5 },
    personMockup: { position: 'absolute', bottom: 20, left: -20, width: 60, height: 120, backgroundColor: '#374151', borderRadius: 10 },

    resultsContainer: { marginTop: 10 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
    emptyState: { alignItems: 'center', marginTop: 50 },
    
    postCard: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 15, marginBottom: 20, backgroundColor: '#fff' },
    postHeader: { marginBottom: 10 },
    postUser: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    postImageContainer: { width: '100%', height: 180, backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' },
    postCardImage: { width: '100%', height: '100%' },
    postContent: { marginBottom: 10 },
    postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    postTime: { fontSize: 12, color: '#888', marginBottom: 10 },
    tagsContainer: { flexDirection: 'row' },
    tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});