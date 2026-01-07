import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateUser } from '../store/reducer/userSlice';
import { BASE_URL, handleApiError } from '../utils/api';

import Grid from './Grid';
import AddPost from './AddPost';
import Bookmark from './Bookmark';
import Profile from './Profile';
import { useThemeColors } from '../hooks/useThemeColors';
import { Post } from '../types';

interface HomeProps {
    onPostClick: (post: any) => void;
    onNotificationClick: () => void;
}

export default function Home({ onPostClick, onNotificationClick }: HomeProps) {
    const dispatch = useDispatch();
    const { colors, isNightMode } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<'home' | 'grid' | 'add' | 'bookmark' | 'profile'>('home');

    const [bookmarkedIds, setBookmarkedIds] = useState<(string | number)[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user.token) {
                try {
                    const response = await fetch(`${BASE_URL}/api/users/me`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                        },
                    });
                    const data = await handleApiError(response);
                    dispatch(updateUser(data));
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    // Optional: Handle token expiration or error
                }
            }
        };

        fetchUserData();
    }, [user.token, dispatch]);

    // Posts state
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (currentPage: number) => {
        if (!user.token || loading) return;
        setLoading(true);

        try {
            const limit = 10;
            const response = await fetch(`${BASE_URL}/api/posts?page=${currentPage}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            const data = await handleApiError(response);

            // Spring Page interface returns data in 'content' field
            const postsList = data.content || [];

            // If fewer items than limit, we reached the end
            if (postsList.length < limit) {
                setHasMore(false);
            }

            const mappedPosts: Post[] = postsList.map((p: any) => ({
                id: p.id,
                user: p.user?.name || 'Người dùng ẩn',
                title: p.title,
                time: p.time || 'Vừa xong',
                tags: p.tags || [],
                content: p.content,
                info: p.info ? Object.entries(p.info).map(([k, v]) => `${k}: ${v}`) : [],
                images: p.imageUrls || []
            }));

            if (currentPage === 0) {
                setAllPosts(mappedPosts);
            } else {
                setAllPosts(prev => [...prev, ...mappedPosts]);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchPosts(0);
    }, [user.token]);

    const loadMorePosts = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    const addNewPost = (newPost: any) => {
        setAllPosts(prev => [newPost, ...prev]);
        setActiveTab('home');
    };

    const toggleBookmark = (id: string | number) => {
        setBookmarkedIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    // Render items for FlatList
    const renderPostItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPostClick(item)}
        >
            <View style={styles.postHeader}><Text style={[styles.postUser, { color: colors.text }]}>{item.user}</Text></View>
            <View style={[styles.postImageContainer, { backgroundColor: colors.iconBg }]}>
                {item.images && item.images.length > 0 ? (
                    <Image
                        source={{ uri: item.images[0] }}
                        style={styles.postCardImage}
                        resizeMode="cover"
                    // FlatList handles lazy loading viewability, but we can add loadingIndicatorSource if needed
                    />
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
                <TouchableOpacity style={styles.footerIcon}><Ionicons name="chatbubble-outline" size={20} color={colors.subText} /></TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerIcon}
                    onPress={() => toggleBookmark(item.id)}
                >
                    <Ionicons
                        name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={bookmarkedIds.includes(item.id) ? "#60A5FA" : colors.subText}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon}><Ionicons name="ellipsis-horizontal" size={20} color={colors.subText} /></TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.logoText, { color: colors.text }]}>
                    Quick<Text style={styles.logoHighlight}>Swap</Text>
                </Text>
                <TouchableOpacity onPress={onNotificationClick}>
                    <Ionicons name="notifications" size={24} color={colors.icon} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            {/* Greeting */}
            <View style={styles.greetingContainer}>
                <Text style={[styles.greetingText, { color: colors.subText }]}>Chào mừng quay trở lại,</Text>
                <Text style={[styles.userNameText, { color: colors.text }]}>{user.name || user.username}.</Text>
            </View>

            {/* Banner Image */}
            <View style={styles.bannerContainer}>
                {/* Placeholder for the banner image shown in design */}
                <View style={styles.bannerPlaceholder}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/350x150' }} // Replace with local asset if available
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>
            </View>

            {/* Section Title */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bài đăng mới</Text>
        </View>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'grid':
                return (
                    <Grid
                        onNotificationClick={onNotificationClick}
                        allPosts={allPosts}
                        onPostClick={onPostClick}
                    />
                );
            case 'add':
                return <AddPost onPostSuccess={addNewPost} />;
            case 'bookmark':
                return (
                    <Bookmark
                        savedPosts={allPosts.filter(p => bookmarkedIds.includes(p.id))}
                        onPostClick={onPostClick}
                        onNotificationClick={onNotificationClick}
                        toggleBookmark={toggleBookmark}
                        bookmarkedIds={bookmarkedIds}
                    />
                );
            case 'profile':
                return <Profile />;
            case 'home':
            default:
                return (
                    <View style={{ flex: 1, paddingHorizontal: 20 }}>
                        <FlatList
                            data={allPosts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderPostItem}
                            ListHeaderComponent={renderHeader}
                            ListFooterComponent={
                                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    {loading && <ActivityIndicator size="large" color={colors.primary} />}
                                </View>
                            }
                            onEndReached={loadMorePosts}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {renderContent()}


            {/* Bottom Tab Bar */}
            <View style={styles.bottomTabContainer}>
                <View style={[styles.bottomTab, { backgroundColor: colors.primary }]}>

                    {/* Home */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'home' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('home')}
                    >
                        <Ionicons
                            name="home-outline"
                            size={22}
                            color="#fff"
                        />
                        {activeTab === 'home' && (
                            <Text style={styles.activeText}>Trang chủ</Text>
                        )}
                    </TouchableOpacity>

                    {/* Grid */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'grid' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('grid')}
                    >
                        <Ionicons name="grid-outline" size={22} color="#fff" />
                        {activeTab === 'grid' && (
                            <Text style={styles.activeText}>Danh mục</Text>
                        )}
                    </TouchableOpacity>

                    {/* Add */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'add' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('add')}
                    >
                        <Ionicons name="add-circle-outline" size={22} color="#fff" />
                        {activeTab === 'add' && (
                            <Text style={styles.activeText}>Đăng bài</Text>
                        )}
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'bookmark' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('bookmark')}
                    >
                        <Ionicons name="bookmark-outline" size={22} color="#fff" />
                        {activeTab === 'bookmark' && (
                            <Text style={styles.activeText}>Đã lưu</Text>
                        )}
                    </TouchableOpacity>

                    {/* Profile */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'profile' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('profile')}
                    >
                        <Ionicons name="person-outline" size={22} color="#fff" />
                        {activeTab === 'profile' && (
                            <Text style={styles.activeText}>Cá nhân</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoHighlight: {
        color: '#60A5FA',
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    greetingContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    greetingText: {
        fontSize: 16,
    },
    userNameText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bannerContainer: {
        marginBottom: 25,
        borderRadius: 12,
        overflow: 'hidden',
    },
    bannerPlaceholder: {
        width: '100%',
        height: 180,
        backgroundColor: '#FFE4B5',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    postCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    postHeader: {
        marginBottom: 10,
    },
    postUser: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        overflow: 'hidden'
    },
    postCardImage: {
        width: '100%',
        height: '100%',
    },
    postContent: {
        marginBottom: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postTime: {
        fontSize: 12,
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginRight: 8,
    },
    tagBlue: {
        backgroundColor: '#60A5FA',
    },
    tagLightBlue: {
        backgroundColor: '#93C5FD',
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
    },
    footerIcon: {
        padding: 5,
    },
    bottomTabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },

    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
    },

    activeTab: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 10,
    },

    activeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },

    addButton: {
        marginTop: -20, // nhô lên trên
    },
    activeTabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white for pill effect
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeTabText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 14,
    }

});
