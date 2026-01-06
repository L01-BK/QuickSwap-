import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from './PostDetail';

interface BookmarkProps {
    savedPosts: Post[];
    onPostClick: (post: Post) => void;
    onNotificationClick: () => void;
    toggleBookmark: (id: string | number) => void;
    bookmarkedIds: (string | number)[];
}

export default function Bookmark({ 
    savedPosts, 
    onPostClick, 
    onNotificationClick, 
    toggleBookmark,
    bookmarkedIds 
}: BookmarkProps) {
    return (
        <View style={styles.container}>
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
                <Text style={styles.screenTitle}>BÀI ĐĂNG ĐÃ LƯU</Text>

                {savedPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có bài đăng nào được lưu.</Text>
                    </View>
                ) : (
                    savedPosts.map((post) => (
                        <TouchableOpacity 
                            key={post.id} 
                            style={styles.postCard} 
                            onPress={() => onPostClick(post)}
                        >
                            <View style={styles.postHeader}>
                                <Text style={styles.postUser}>{post.user}</Text>
                            </View>

                            <View style={styles.postImageContainer}>
                                <Ionicons name="image-outline" size={80} color="#ccc" />
                            </View>

                            <View style={styles.postContent}>
                                <Text style={styles.postTitle}>{post.title}</Text>
                                <Text style={styles.postTime}>{post.time}</Text>
                                
                                <View style={styles.tagsContainer}>
                                    {post.tags.map((tag, index) => (
                                        <View 
                                            key={index} 
                                            style={[
                                                styles.tag, 
                                                tag === 'Trao đổi' ? styles.tagBlue : styles.tagLightBlue
                                            ]}
                                        >
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.postFooter}>
                                <TouchableOpacity style={styles.footerIcon}>
                                    <Ionicons name="chatbubble-outline" size={20} color="#000" />
                                </TouchableOpacity>
                                
                                <View style={styles.footerDivider} />
                                
                                <TouchableOpacity 
                                    style={styles.footerIcon}
                                    onPress={() => toggleBookmark(post.id)}
                                >
                                    <Ionicons 
                                        name="bookmark" 
                                        size={20} 
                                        color="#3B4161" 
                                    />
                                </TouchableOpacity>

                                <View style={styles.footerDivider} />

                                <TouchableOpacity style={styles.footerIcon}>
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logoText: { fontSize: 28, fontWeight: 'bold', color: '#000' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: {
        position: 'absolute', top: 2, right: 2,
        width: 8, height: 8, borderRadius: 4, backgroundColor: 'red',
    },
    scrollContent: { paddingHorizontal: 20 },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3B4161',
        marginVertical: 20,
    },
    postCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    postHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    postUser: { fontWeight: 'bold', fontSize: 15, color: '#333' },
    postImageContainer: {
        width: '100%', height: 250,
        backgroundColor: '#F9FAFB',
        alignItems: 'center', justifyContent: 'center',
    },
    postContent: { padding: 15 },
    postTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
    postTime: { fontSize: 13, color: '#999', marginBottom: 10 },
    tagsContainer: { flexDirection: 'row' },
    tag: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    postFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
    },
    footerIcon: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    footerDivider: { width: 1, height: 20, backgroundColor: '#E0E0E0' },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#888', fontSize: 16 }
});