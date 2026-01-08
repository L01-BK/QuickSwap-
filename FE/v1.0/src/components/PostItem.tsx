import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';

interface PostItemProps {
    item: Post;
    isBookmarked: boolean;
    onPress: (post: Post) => void;
    onShowContact: (post: Post) => void;
    onToggleBookmark: (id: string | number) => void;
    onShowOptions: (post: Post) => void;
}

const PostItem = memo(({ item, isBookmarked, onPress, onShowContact, onToggleBookmark, onShowOptions }: PostItemProps) => {
    const { colors } = useThemeColors();

    return (
        <TouchableOpacity
            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPress(item)}
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
                <TouchableOpacity style={styles.footerIcon} onPress={() => onShowContact(item)}>
                    <Ionicons name="chatbubble-outline" size={20} color={colors.subText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={() => onToggleBookmark(item.id)}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isBookmarked ? "#60A5FA" : colors.subText}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={() => onShowOptions(item)}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.subText} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
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
});

export default PostItem;
