import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo } from '../store/reducer/navigationSlice';
import { useThemeColors } from '../hooks/useThemeColors';
import { BASE_URL, handleApiError } from '../utils/api';
import { Post } from '../types';

export default function PostDetail() {
    const dispatch = useDispatch();
    const initialPost = useSelector((state: RootState) => state.navigation.selectedPost);
    const user = useSelector((state: RootState) => state.user);
    const onBack = () => dispatch(navigateTo('home'));

    // Theme
    const { colors } = useThemeColors();

    const [post, setPost] = useState<Post | null>(initialPost);

    // Guard: tránh crash khi chưa có post
    if (!initialPost) {
        return null;
    }

    useEffect(() => {
        const fetchPostDetail = async () => {
            if (initialPost?.id) {
                try {
                    const response = await fetch(`${BASE_URL}/api/posts/${initialPost.id}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                        },
                    });
                    const data = await handleApiError(response);

                    // Map API response (PostResponse) to Frontend Post type
                    // Backend: user is object (UserResponse), info is Map
                    // Frontend: user is string, info is Array
                    const mappedPost: Post = {
                        id: data.id,
                        user: data.user?.name || 'Người dùng ẩn',
                        title: data.title,
                        time: data.time || 'Vừa xong',
                        tags: data.tags || [],
                        content: data.content,
                        info: data.info ? Object.entries(data.info).map(([k, v]) => `${k}: ${v}`) : [],
                        images: data.imageUrls || []
                    };

                    setPost(mappedPost);
                } catch (error) {
                    console.error('Failed to fetch post details:', error);
                    // Optional: Alert or fallback
                }
            }
        };

        fetchPostDetail();
    }, [initialPost?.id, user.token]);

    // Use 'post' state for rendering, which starts as 'initialPost' and updates with API data
    const displayPost = post || initialPost;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: colors.subText }]}>
                    Bài viết của {displayPost.user}
                </Text>

                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

                    {/* User */}
                    <View style={[styles.userSection, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.userName, { color: colors.text }]}>{displayPost.user}</Text>
                    </View>

                    {/* Image */}
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.iconBg }]}>
                        {displayPost.images && displayPost.images.length > 0 ? (
                            <Image
                                source={{ uri: displayPost.images[0] }}
                                style={styles.postImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="image-outline" size={80} color={colors.subText} />
                        )}
                    </View>

                    {/* Pagination dots (only if multiple images) */}
                    {displayPost.images && displayPost.images.length > 1 && (
                        <View style={[styles.paginationDots, { backgroundColor: colors.iconBg }]}>
                            {displayPost.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === 0 ? styles.dotActive : { backgroundColor: colors.border }
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Details */}
                    <View style={styles.detailsContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>{displayPost.title}</Text>
                        <Text style={[styles.time, { color: colors.subText }]}>{displayPost.time}</Text>

                        {/* Tags */}
                        <View style={styles.tagsContainer}>
                            {displayPost.tags.map((tag: string, index: number) => (
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
                        {displayPost.content && (
                            <>
                                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                                    Nội dung bài đăng
                                </Text>
                                <Text style={[styles.description, { color: colors.subText }]}>
                                    {displayPost.content}
                                </Text>
                            </>
                        )}

                        {/* Extra info */}
                        {displayPost.info && displayPost.info.length > 0 && (
                            <>
                                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                                    Thông tin thêm
                                </Text>
                                {displayPost.info.map((line: string, index: number) => (
                                    <Text
                                        key={index}
                                        style={[styles.infoLine, { color: colors.subText }]}
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
            <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="bookmark-outline"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
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
        fontWeight: '500',
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    userSection: {
        padding: 15,
        borderBottomWidth: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePlaceholder: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    dot: {
        width: 30,
        height: 4,
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
    },
    time: {
        fontSize: 14,
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
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    infoLine: {
        fontSize: 14,
        lineHeight: 22,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        paddingVertical: 10,
    },
    iconButton: {
        padding: 10,
    },
});
