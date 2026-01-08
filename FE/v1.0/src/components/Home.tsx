import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, AlertButton, Dimensions, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo, setHomeActiveTab, MainTab, setHomePosts, setHomePage, setHomeScrollOffset } from '../store/reducer/navigationSlice';
import { updateUser } from '../store/reducer/userSlice';
import { BASE_URL, handleApiError } from '../utils/api';

import Grid from './Grid';
import AddPost from './AddPost';
import Bookmark from './Bookmark';
import Profile from './Profile';
import { useThemeColors } from '../hooks/useThemeColors';
import { Post } from '../types';

import UserProfile from './UserProfile';

interface HomeProps {
    onPostClick: (post: any) => void;
    onNotificationClick: () => void;
}

export default function Home({ onPostClick, onNotificationClick }: HomeProps) {
    const BANNER_DATA = [
    { id: '1', image: require('../../assets/images/banner-1.jpg') },
    { id: '2', image: require('../../assets/images/banner-2.jpg') },
    { id: '3', image: require('../../assets/images/banner-3.jpg') },
    ];

    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const bannerRef = React.useRef<FlatList>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            if (activeBannerIndex < BANNER_DATA.length - 1) {
                bannerRef.current?.scrollToIndex({ index: activeBannerIndex + 1, animated: true });
            } else {
                bannerRef.current?.scrollToIndex({ index: 0, animated: true });
            }
        }, 4000);
        return () => clearInterval(timer);
    }, [activeBannerIndex]);

    const dispatch = useDispatch();
    const { colors } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);
    const activeTab = useSelector((state: RootState) => state.navigation.homeActiveTab);
    const { homePosts, homePage, homeScrollOffset } = useSelector((state: RootState) => state.navigation);

    const [unreadCount, setUnreadCount] = useState(0);

    const handleSwitchTab = (tab: MainTab) => {
        dispatch(setHomeActiveTab(tab));
    };

    const [bookmarkedIds, setBookmarkedIds] = useState<(string | number)[]>([]);

    const [viewingUser, setViewingUser] = useState<{id: string | number, name: string} | null>(null);

    const fetchUnreadNotifications = async () => {
        if (!user.token) return;
        try {
            const response = await fetch(`${BASE_URL}/api/notifications/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await handleApiError(response);
            
            const rawList = Array.isArray(data) ? data : (data.content || []);
            
            const count = rawList.filter((item: any) => {
                const isRead = item.read !== undefined ? item.read : item.isRead;
                return !isRead;
            }).length;

            setUnreadCount(count);
        } catch (error) {
            console.log('Failed to fetch unread count:', error);
        }
    };
    useEffect(() => {
        fetchUnreadNotifications();
        
        const interval = setInterval(fetchUnreadNotifications, 5000);
        return () => clearInterval(interval);
    }, [user.token]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user.token) {
                try {
                    const response = await fetch(`${BASE_URL}/api/users/me`, {
                        headers: { 'Authorization': `Bearer ${user.token}` },
                    });
                    const data = await handleApiError(response);
                    dispatch(updateUser(data));
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

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
                    console.log('Failed to fetch saved list for ids:', error);
                }
            }
        };

        fetchUserData();
        fetchSavedIds();
    }, [user.token, dispatch]);

    const [allPosts, setAllPosts] = useState<Post[]>(homePosts);
    const [page, setPage] = useState(homePage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sectionTitleY, setSectionTitleY] = useState(0);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setHasMore(true);
        setPage(0);
        dispatch(setHomePage(0));
        
        // Gọi trực tiếp fetchPosts với page 0
        await fetchPosts(0);
        
        setRefreshing(false);
    }, [user.token]);
    const fetchPosts = async (currentPage: number) => {
        if (!user.token || loading) return;
        setLoading(true);
        try {
            const limit = 5;
            const response = await fetch(`${BASE_URL}/api/posts?page=${currentPage}&limit=${limit}`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await handleApiError(response);
            const postsList = data.content || [];

            if (postsList.length < limit) setHasMore(false);

            const mappedPosts: Post[] = postsList.map((p: any) => {
                return {
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
                };
            });

            if (currentPage === 0) {
                setAllPosts(mappedPosts);
                dispatch(setHomePosts(mappedPosts));
            } else {
                setAllPosts(prev => {
                    const newPosts = [...prev, ...mappedPosts];
                    dispatch(setHomePosts(newPosts));
                    return newPosts;
                });
            }

        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
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
    const handleDeletePost = async (postId: string | number) => {
        try {
            const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` },
            });

            if (response.ok) {
                setAllPosts(prev => prev.filter(p => p.id !== postId));
                Alert.alert("Thành công", "Đã xóa bài viết.");
            } else {
                handleApiError(response);
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
        }
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
                    "Xác nhận",
                    "Bạn có chắc chắn muốn xóa bài viết này không?",
                    [
                        { text: "Hủy", style: "cancel" },
                        { 
                            text: "Xóa", 
                            style: "destructive", 
                            onPress: () => handleDeletePost(item.id)
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
                    id: item.userId,
                    name: item.user
                });
            }
        });
    }

    options.push({ text: 'Hủy', style: 'cancel' });
    Alert.alert("Tùy chọn", isOwner ? "Quản lý bài viết" : `Bài viết của ${item.user}`, options);
};

    useEffect(() => {
        if (activeTab === 'home') {
            // if (homePosts.length === 0) {
                setPage(0);
                setHasMore(true);
                fetchPosts(0);
            // } else {
            //     setAllPosts(homePosts);
            //     setPage(homePage);
            // }
        }
    }, [user.token, activeTab]);
    

    const loadMorePosts = () => {
        if (loading || allPosts.length === 0) return;

        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(setHomePage(nextPage));
            fetchPosts(nextPage);
        }
    };

    const addNewPost = (newPost: any) => {
        setAllPosts(prev => [newPost, ...prev]);
        dispatch(setHomePosts([newPost, ...allPosts]));
        dispatch(setHomeActiveTab('home'));
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
            console.error('Bookmark error:', error);
            setBookmarkedIds(prev =>
                isSaved ? [...prev, id] : prev.filter(itemId => itemId !== id)
            );
        }
    };

    const renderPostItem = useCallback(({ item }: { item: Post }) => (
        <TouchableOpacity
            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPostClick(item)}
        >
            <View style={styles.postHeader}><Text style={[styles.postUser, { color: colors.text }]}>{item.user}</Text></View>
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
    ), [colors, bookmarkedIds]);



    const renderScrollableHeader = () => (
        <View>
            <View style={styles.greetingContainer}>
                <Text style={[styles.greetingText, { color: colors.subText }]}>Chào mừng quay trở lại,</Text>
                <Text style={[styles.userNameText, { color: colors.text }]}>{user.name || user.username}.</Text>
            </View>
            <View style={styles.bannerWrapper}>
            <FlatList
                ref={bannerRef}
                data={BANNER_DATA}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 40));
                    setActiveBannerIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.bannerSlide}>
                        {/* Bỏ { uri: ... } đi vì item.image giờ đã là kết quả của require */}
                        <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
                    </View>
                )}
            />
            {/* Chấm tròn chỉ báo (Pagination Dots) */}
            <View style={styles.paginationContainer}>
                {BANNER_DATA.map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.dot, 
                            { backgroundColor: index === activeBannerIndex ? '#60A5FA' : 'rgba(255,255,255,0.5)' }
                        ]} 
                    />
                ))}
            </View>
        </View>
            <Text
                style={[styles.sectionTitle, { color: colors.text }]}
                onLayout={(event) => setSectionTitleY(event.nativeEvent.layout.y)}
            >
                Bài đăng mới
            </Text>
        </View>
    );

    const flatListRef = React.useRef<FlatList>(null);
    // Removed scroll persistence logic as requested

    const renderContent = () => {
        switch (activeTab) {
            case 'grid':
                return <Grid onNotificationClick={onNotificationClick} allPosts={allPosts} onPostClick={onPostClick} unreadCount={unreadCount}/>;
            case 'add':
                return <AddPost />;
            case 'bookmark':
                return (
                    <Bookmark
                        onPostClick={onPostClick}
                        onNotificationClick={onNotificationClick}
                        unreadCount={unreadCount}
                    />
                );
            case 'profile':
                return <Profile />;
            case 'home':
            default:
                return (
                    <View style={{ flex: 1 }}> 
                        {/* Fixed Header placed OUTSIDE of FlatList */}
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
                        <FlatList
                            ref={flatListRef}
                            data={allPosts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderPostItem}
                            ListHeaderComponent={renderScrollableHeader()}
                            ListFooterComponent={
                                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    {loading && <ActivityIndicator size="large" color={colors.primary} />}
                                </View>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[colors.primary]} // Android
                                    tintColor={colors.primary} // iOS
                                />
                            }
                            onEndReached={loadMorePosts}
                            onEndReachedThreshold={0.01}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    </View>
                );
        }
    };
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {renderContent()}
            <View style={styles.bottomTabContainer}>
                <View style={[styles.bottomTab, { backgroundColor: colors.primary }]}>

                    {/* Home */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'home' && styles.activeTab
                        ]}
                        onPress={() => dispatch(setHomeActiveTab('home'))}
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
                        onPress={() => dispatch(setHomeActiveTab('grid'))}
                    >
                        <Ionicons name="grid-outline" size={22} color="#fff" />
                        {activeTab === 'grid' && <Text style={styles.activeText}>Danh mục</Text>}
                    </TouchableOpacity>

                    {/* Add */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'add' && styles.activeTab
                        ]}
                        onPress={() => dispatch(setHomeActiveTab('add'))}
                    >
                        <Ionicons name="add-circle-outline" size={22} color="#fff" />
                        {activeTab === 'add' && <Text style={styles.activeText}>Đăng bài</Text>}
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'bookmark' && styles.activeTab
                        ]}
                        onPress={() => dispatch(setHomeActiveTab('bookmark'))}
                    >
                        <Ionicons name="bookmark-outline" size={22} color="#fff" />
                        {activeTab === 'bookmark' && <Text style={styles.activeText}>Đã lưu</Text>}
                    </TouchableOpacity>

                    {/* Profile */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'profile' && styles.activeTab
                        ]}
                        onPress={() => dispatch(setHomeActiveTab('profile'))}
                    >
                        <Ionicons name="person-outline" size={22} color="#fff" />
                        {activeTab === 'profile' && <Text style={styles.activeText}>Cá nhân</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    logoText: { fontSize: 24, fontWeight: 'bold' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
    greetingContainer: { marginTop: 20, marginBottom: 20 },
    greetingText: { fontSize: 16 },
    userNameText: { fontSize: 24, fontWeight: 'bold' },
    bannerContainer: { marginBottom: 25, borderRadius: 12, overflow: 'hidden' },
    bannerPlaceholder: { width: '100%', height: 180, backgroundColor: '#FFE4B5', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
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
    bottomTabContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    bottomTab: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, paddingHorizontal: 10, paddingBottom: 12 },
    tabItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 7 },
    activeTab: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10 },
    activeText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 6 },
    bannerWrapper: {
        marginBottom: 25,
        borderRadius: 12,
        overflow: 'hidden',
        height: 180,
        position: 'relative',
    },
    bannerSlide: {
        width: SCREEN_WIDTH - 40, // Trừ đi paddingHorizontal của FlatList mẹ
        height: 180,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});