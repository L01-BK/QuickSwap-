import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';

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
    const { colors } = useThemeColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.screenTitle, { color: colors.text }]}>BÀI ĐĂNG ĐÃ LƯU</Text>

                {savedPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.subText }]}>Chưa có bài đăng nào được lưu.</Text>
                    </View>
                ) : (
                    savedPosts.map((post) => (
                        <TouchableOpacity
                            key={post.id}
                            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => onPostClick(post)}
                        >
                            <View style={[styles.postHeader, { borderBottomColor: colors.border }]}>
                                <Text style={[styles.postUser, { color: colors.text }]}>{post.user}</Text>
                            </View>

                            <View style={[styles.postImageContainer, { backgroundColor: colors.iconBg }]}>
                                {post.images && post.images.length > 0 ? (
                                    <Image
                                        source={{ uri: post.images[0] }}
                                        style={styles.postCardImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Ionicons name="image-outline" size={80} color={colors.subText} />
                                )}
                            </View>

                            <View style={styles.postContent}>
                                <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                                <Text style={[styles.postTime, { color: colors.subText }]}>{post.time}</Text>

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

                            <View style={[styles.postFooter, { borderTopColor: colors.border }]}>
                                <TouchableOpacity style={styles.footerIcon}>
                                    <Ionicons name="chatbubble-outline" size={20} color={colors.icon} />
                                </TouchableOpacity>

                                <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

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

                                <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

                                <TouchableOpacity style={styles.footerIcon}>
                                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
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
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logoText: { fontSize: 28, fontWeight: 'bold' },
    logoHighlight: { color: '#60A5FA' },
    notificationBadge: {
        position: 'absolute', top: 2, right: 2,
        width: 8, height: 8, borderRadius: 4, backgroundColor: 'red',
    },
    scrollContent: { paddingHorizontal: 20 },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    postCard: {
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden'
    },
    postHeader: { padding: 12, borderBottomWidth: 1 },
    postUser: { fontWeight: 'bold', fontSize: 15 },
    postImageContainer: {
        width: '100%', height: 250,
        alignItems: 'center', justifyContent: 'center',
    },
    postCardImage: {
        width: '100%',
        height: '100%',
    },
    postContent: { padding: 15 },
    postTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
    postTime: { fontSize: 13, marginBottom: 10 },
    tagsContainer: { flexDirection: 'row' },
    tag: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
    tagBlue: { backgroundColor: '#60A5FA' },
    tagLightBlue: { backgroundColor: '#93C5FD' },
    tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    postFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        alignItems: 'center',
    },
    footerIcon: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    footerDivider: { width: 1, height: 20 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16 }
});
