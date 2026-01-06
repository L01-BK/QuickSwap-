import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo, selectPost, setHomeActiveTab } from '../store/reducer/navigationSlice';

import Grid from './Grid';
import AddPost from './AddPost';
import Bookmark from './Bookmark';
import Profile from './Profile';

export default function Home() {
    const dispatch = useDispatch();
    const isNightMode = useSelector((state: RootState) => state.theme.isNightMode);
    const user = useSelector((state: RootState) => state.user);
    const { homeActiveTab } = useSelector((state: RootState) => state.navigation);
    const userName = user.name;

    // We use homeActiveTab from Redux instead of local state
    const activeTab = homeActiveTab;
    const setActiveTab = (tab: any) => dispatch(setHomeActiveTab(tab));

    // Dummy data for posts
    const posts = [
        {
            id: '1',
            user: 'Nguyễn Văn A',
            title: 'Sách giáo trình môn triết học',
            time: 'Đăng 14h trước',
            content: 'Sách còn rất mới, rất hay...',
            tags: ['Trao đổi', 'Miễn phí'],
            info: [
                'Danh mục: Sách',
                'Tình trạng: Như mới',
            ]
        },
        {
            id: 2,
            user: 'Trần Thị B',
            title: 'Tai nghe Bluetooth',
            time: 'Đăng 2 ngày trước',
            tags: ['Cho mượn'],
            content: 'Tai nghe còn rất mới, pin tốt...',
            info: [
                'Danh mục: Phụ kiện',
                'Tình trạng: Như mới',
            ]
        }
        // Add more dummy items if needed for scrolling test
    ];


    const containerBg = isNightMode ? '#121212' : '#fff';
    const textColor = isNightMode ? '#fff' : '#000';
    const subTextColor = isNightMode ? '#aaa' : '#333';
    const cardBg = isNightMode ? '#1E1E1E' : '#fff';
    const postTitleColor = isNightMode ? '#E0E0E0' : '#333';


    const renderContent = () => {
        switch (activeTab) {
            case 'grid':
                return <Grid />;
            case 'add':
                return <AddPost />;
            case 'bookmark':
                return <Bookmark />;
            case 'profile':
                return <Profile />;
            case 'home':
            default:
                return (
                    <View style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.logoText, { color: textColor }]}>
                                Quick<Text style={styles.logoHighlight}>Swap</Text>
                            </Text>
                            <TouchableOpacity>
                                <Ionicons name="notifications" size={24} color={textColor} />
                                <View style={styles.notificationBadge} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {/* Greeting */}
                            <View style={styles.greetingContainer}>
                                <Text style={[styles.greetingText, { color: subTextColor }]}>Chào mừng quay trở lại,</Text>
                                <Text style={[styles.userNameText, { color: isNightMode ? '#90CAF9' : '#3B4161' }]}>{userName}.</Text>
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
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Bài đăng mới</Text>

                            {/* Posts List */}
                            {posts.map((post) => (
                                <TouchableOpacity key={post.id} style={[styles.postCard, { backgroundColor: cardBg, borderColor: isNightMode ? '#333' : '#E0E0E0' }]} onPress={() => {
                                    dispatch(selectPost(post as any));
                                    dispatch(navigateTo('post-detail'));
                                }}>
                                    <View style={styles.postHeader}>
                                        <Text style={[styles.postUser, { color: isNightMode ? '#fff' : '#333' }]}>{post.user}</Text>
                                    </View>

                                    <View style={[styles.postImageContainer, { backgroundColor: isNightMode ? '#2C2C2C' : '#F3F4F6' }]}>
                                        <Ionicons name="image-outline" size={60} color="#ccc" />
                                    </View>

                                    <View style={styles.postContent}>
                                        <Text style={[styles.postTitle, { color: postTitleColor }]}>{post.title}</Text>
                                        <Text style={styles.postTime}>{post.time}</Text>
                                        <View style={styles.tagsContainer}>
                                            {post.tags.map((tag, index) => (
                                                <View key={index} style={[
                                                    styles.tag,
                                                    tag === 'Trao đổi' ? styles.tagBlue : styles.tagLightBlue
                                                ]}>
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={[styles.postFooter, { borderTopColor: isNightMode ? '#333' : '#F3F4F6' }]}>
                                        <Ionicons name="chatbubble-outline" size={20} color={isNightMode ? '#aaa' : '#555'} style={styles.footerIcon} />
                                        <Ionicons name="bookmark-outline" size={20} color={isNightMode ? '#aaa' : '#555'} style={styles.footerIcon} />
                                        <Ionicons name="ellipsis-horizontal" size={20} color={isNightMode ? '#aaa' : '#555'} style={styles.footerIcon} />
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {/* Spacer for Bottom Tab */}
                            <View style={{ height: 80 }} />
                        </ScrollView>
                    </View>
                );
        }
    };

    // Explicit return for TS
    const handleTabChange = (tab: 'home' | 'grid' | 'add' | 'bookmark' | 'profile') => {
        dispatch(setHomeActiveTab(tab));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]} edges={['top']}>
            {renderContent()}


            {/* Bottom Tab Bar */}
            <View style={styles.bottomTabContainer}>
                <View style={[styles.bottomTab, isNightMode && { backgroundColor: '#1E1E1E', borderTopColor: '#333', borderTopWidth: 1 }]}>

                    {/* Home */}
                    <TouchableOpacity
                        style={[
                            styles.tabItem,
                            activeTab === 'home' && styles.activeTab
                        ]}
                        onPress={() => handleTabChange('home')}
                    >
                        <Ionicons
                            name="home-outline"
                            size={22}
                            color={isNightMode ? "#fff" : "#fff"}
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
                        onPress={() => handleTabChange('grid')}
                    >
                        <Ionicons name="grid-outline" size={22} color={isNightMode ? "#fff" : "#fff"} />
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
                        onPress={() => handleTabChange('add')}
                    >
                        <Ionicons name="add-circle-outline" size={22} color={isNightMode ? "#fff" : "#fff"} />
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
                        onPress={() => handleTabChange('bookmark')}
                    >
                        <Ionicons name="bookmark-outline" size={22} color={isNightMode ? "#fff" : "#fff"} />
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
                        onPress={() => handleTabChange('profile')}
                    >
                        <Ionicons name="person-outline" size={22} color={isNightMode ? "#fff" : "#fff"} />
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
        backgroundColor: '#fff',
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
        color: '#000',
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
        color: '#333',
    },
    userNameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B4161',
    },
    bannerContainer: {
        marginBottom: 25,
        borderRadius: 12,
        overflow: 'hidden',
    },
    bannerPlaceholder: {
        width: '100%',
        height: 180,
        backgroundColor: '#FFE4B5', // Mocking the yellowish tone from screenshot
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
        color: '#000',
        marginBottom: 15,
    },
    postCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    postHeader: {
        marginBottom: 10,
    },
    postUser: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    postImageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    postContent: {
        marginBottom: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    postTime: {
        fontSize: 12,
        color: '#888',
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
        borderTopColor: '#F3F4F6',
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
        backgroundColor: '#60A5FA',
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
