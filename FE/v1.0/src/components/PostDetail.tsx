import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/* =======================
   Types
======================= */

export interface Post {
    id: string | number;
    user: string;
    title: string;
    time: string;
    tags: string[];
    content?: string;
    info?: string[];
}

interface PostDetailProps {
    post: Post | null;
    onBack: () => void;
}

/* =======================
   Component
======================= */

export default function PostDetail({ post, onBack }: PostDetailProps) {
    // Guard: tránh crash khi chưa có post
    if (!post) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Bài viết của {post.user}
                </Text>

                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.card}>

                    {/* User */}
                    <View style={styles.userSection}>
                        <Text style={styles.userName}>{post.user}</Text>
                    </View>

                    {/* Image placeholder */}
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={80} color="#ccc" />
                    </View>

                    {/* Pagination dots */}
                    <View style={styles.paginationDots}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                    </View>

                    {/* Details */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{post.title}</Text>
                        <Text style={styles.time}>{post.time}</Text>

                        {/* Tags */}
                        <View style={styles.tagsContainer}>
                            {post.tags.map((tag, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tag,
                                        tag === 'Trao đổi'
                                            ? styles.tagBlue
                                            : styles.tagLightBlue,
                                    ]}
                                >
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Content */}
                        {post.content && (
                            <>
                                <Text style={styles.sectionHeader}>
                                    Nội dung bài đăng
                                </Text>
                                <Text style={styles.description}>
                                    {post.content}
                                </Text>
                            </>
                        )}

                        {/* Extra info */}
                        {post.info && post.info.length > 0 && (
                            <>
                                <Text style={styles.sectionHeader}>
                                    Thông tin thêm
                                </Text>
                                {post.info.map((line, index) => (
                                    <Text
                                        key={index}
                                        style={styles.infoLine}
                                    >
                                        {line}
                                    </Text>
                                ))}
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="bookmark-outline"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: 20,
    },
    userSection: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePlaceholder: {
        width: '100%',
        height: 300,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
    },
    dot: {
        width: 30,
        height: 4,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 2,
        borderRadius: 2,
    },
    dotActive: {
        backgroundColor: '#60A5FA',
    },
    detailsContainer: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    time: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
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
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
    },
    infoLine: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    iconButton: {
        padding: 10,
    },
});
