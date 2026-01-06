import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Grid from './Grid';
import AddPost from './AddPost';
import Bookmark from './Bookmark';
import Profile from './Profile';

interface HomeProps {
    onPostClick: (post: any) => void;
    onNotificationClick: () => void;
}

export default function Home({ onPostClick, onNotificationClick }: HomeProps) {
    const userName = "Kevin Nguyễn";
    const [activeTab, setActiveTab] = useState<'home' | 'grid' | 'add' | 'bookmark' | 'profile'>('home');

    const [bookmarkedIds, setBookmarkedIds] = useState<(string | number)[]>([]);
    // Dummy data for posts
    const [allPosts, setAllPosts] = useState([
    {
        id: '1',
        user: 'Nguyễn Văn A',
        title: 'Sách giáo trình môn triết học',
        time: 'Đăng 14h trước',
        content: 'Sách còn rất mới, rất hay...',
        tags: ['Trao đổi', 'Tài liệu'],
        info: [
            'Danh mục: Tài liệu', 
            'Tình trạng: 99%', 
            'Tác giả: Bộ GD&ĐT',
            'Môn học: Triết học Mác-Lênin'
        ],
        images: [] as string[]
    },
    {
        id: '2',
        user: 'Trần Thị B',
        title: 'Tai nghe Bluetooth cũ',
        time: 'Đăng 2 ngày trước',
        tags: ['Cho mượn', 'Dụng cụ'],
        info: [
            'Danh mục: Dụng cụ', 
            'Tình trạng: 85%'
        ],
        images: [] as string[]
    },
    {
        id: '3',
        user: 'Nguyễn Văn A',
        title: 'Đồ thể dục size XXL',
        time: 'Đăng 2 ngày trước',
        tags: ['Cho mượn', 'Đồ mặc'],
        info: [
            'Danh mục: Đồ mặc', 
            'Tình trạng: 85%'
        ],
        images: [] as string[]
    },
    {
        id: '4',
        user: 'Trần Thị B',
        title: 'Máy tính',
        time: 'Đăng 2 ngày trước',
        tags: ['Cho mượn', 'Dụng cụ'],
        info: [
            'Danh mục: Dụng cụ', 
            'Tình trạng: 85%'
        ],
        images: [] as string[]
    }
    
]);
    const addNewPost = (newPost: any) => {
        setAllPosts(prev => [newPost, ...prev]);
        setActiveTab('home');
    };

    const toggleBookmark = (id: string | number) => {
        setBookmarkedIds(prev => 
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'grid':
                return(
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
                    <View style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.logoText}>
                                Quick<Text style={styles.logoHighlight}>Swap</Text>
                            </Text>
                            <TouchableOpacity onPress={onNotificationClick}>
                                <Ionicons name="notifications" size={24} color="#000" />
                                <View style={styles.notificationBadge} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {/* Greeting */}
                            <View style={styles.greetingContainer}>
                                <Text style={styles.greetingText}>Chào mừng quay trở lại,</Text>
                                <Text style={styles.userNameText}>{userName}.</Text>
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
                            <Text style={styles.sectionTitle}>Bài đăng mới</Text>

                            {/* Posts List */}
                            {allPosts.map((post) => (
                                <TouchableOpacity key={post.id} style={styles.postCard} onPress={() => onPostClick(post)}>
                                    <View style={styles.postHeader}><Text style={styles.postUser}>{post.user}</Text></View>
                                    <View style={styles.postImageContainer}>
        {post.images && post.images.length > 0 ? (
            <Image 
                source={{ uri: post.images[0] }} 
                style={styles.postCardImage}
                resizeMode="cover"
            />
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
                                    <View style={styles.postFooter}>
                                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="chatbubble-outline" size={20} color="#555" /></TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.footerIcon} 
                                            onPress={() => toggleBookmark(post.id)}
                                        >
                                            <Ionicons 
                                                name={bookmarkedIds.includes(post.id) ? "bookmark" : "bookmark-outline"} 
                                                size={20} 
                                                color={bookmarkedIds.includes(post.id) ? "#60A5FA" : "#555"} 
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="ellipsis-horizontal" size={20} color="#555" /></TouchableOpacity>
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

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderContent()}


            {/* Bottom Tab Bar */}
            <View style={styles.bottomTabContainer}>
                <View style={styles.bottomTab}>

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
