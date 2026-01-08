import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Image, ActivityIndicator, FlatList, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useThemeColors';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL, handleApiError } from '../utils/api';

interface NotificationsProps {
    onBack: () => void;
}

interface NotificationItem {
    id: number | string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type?: string;
    senderName?: string;
    senderAvatar?: string;
}

export default function Notifications({ onBack }: NotificationsProps) {
    const { colors } = useThemeColors();
    const user = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
    
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = async () => {
        if (!user.token) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/notifications/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await handleApiError(response);
            
            let rawList = Array.isArray(data) ? data : (data.content || []);
            
            const mappedList: NotificationItem[] = rawList.map((item: any) => ({
                id: item.id,
                title: item.title,
                message: item.body || item.message || '',
                
                isRead: item.read !== undefined ? item.read : item.isRead,
                
                createdAt: item.sentAt || item.createdAt || new Date().toISOString(),
                
                senderName: item.senderName,
                senderAvatar: item.senderAvatar,
                type: item.type
            }));

            mappedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setNotifications(mappedList);
        } catch (error) {
            console.error('Fetch notification error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user.token]);

    const handleMarkRead = async (id: string | number) => {
        console.log("--> Đang gửi yêu cầu đọc cho ID:", id, typeof id);

        const previousNotifications = [...notifications];
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));

        try {
            const url = `${BASE_URL}/api/notifications/me/${id}/read`;
            console.log("--> URL:", url);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("--> Server Status:", response.status); 

            const responseText = await response.text();
            console.log("--> Server Response Text:", responseText);
            
            if (!response.ok) {
                throw new Error(`API thất bại: ${response.status} - ${responseText}`);
            }

            console.log("--> Thành công! Server đã xác nhận.");

        } catch (error) {
            console.error("--> LỖI XẢY RA:", error);
            
            setNotifications(previousNotifications);
            Alert.alert("Lỗi", "Không thể đánh dấu đã đọc. Vui lòng thử lại.");
        }
    };

    const handleMarkAllRead = async () => {
        const hasUnread = notifications.some(n => !n.isRead);
        if (!hasUnread) return;

        Alert.alert(
            "Xác nhận",
            "Đánh dấu tất cả là đã đọc?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        const previousNotifications = [...notifications];
                        
                        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                        setMarkingAll(true);

                        try {
                            const response = await fetch(`${BASE_URL}/api/notifications/me/read-all`, {
                                method: 'PUT',
                                headers: { 'Authorization': `Bearer ${user.token}` }
                            });

                            if (!response.ok) {
                                throw new Error('Failed to mark all read');
                            }
                        } catch (error) {
                            console.error("Lỗi mark all:", error);
                            Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
                            
                            setNotifications(previousNotifications);
                        } finally {
                            setMarkingAll(false);
                        }
                    }
                }
            ]
        );
    };

    const filteredList = notifications.filter(item => {
        if (activeTab === 'unread') return !item.isRead;
        if (activeTab === 'read') return item.isRead;
        return true;
    });

    const getAvatar = (item: NotificationItem) => {
        return item.senderAvatar 
            ? { uri: item.senderAvatar } 
            : require('../../assets/noti-icon.png');
    };

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity 
            style={[
                styles.notiCard, 
                { 
                    borderBottomColor: colors.border, 
                    backgroundColor: item.isRead ? 'transparent' : (colors.card + '40')
                }
            ]}
            onPress={() => handleMarkRead(item.id)}
            activeOpacity={0.7}
        >
            {/* Chấm xanh chưa đọc */}
            {!item.isRead && <View style={styles.unreadDot} />}
            
            <Image source={getAvatar(item)} style={styles.avatar} />
            
            <View style={styles.notiContent}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>
                    {item.title}
                </Text>
                <Text style={[styles.detailText, { color: colors.subText }]} numberOfLines={2}>
                    {item.message}
                </Text>
                <Text style={[styles.notiTime, { color: colors.subText }]}>
                    {new Date(item.createdAt).toLocaleString('vi-VN', { 
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' 
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                    <Text style={[styles.headerTitle, { color: colors.text, marginLeft: 8 }]}>
                        Thông báo
                    </Text>
                </TouchableOpacity>
                
                {/* Nút Đọc tất cả (chỉ hiện khi có tin chưa đọc) */}
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead} disabled={markingAll}>
                        {markingAll ? (
                            <ActivityIndicator size="small" color="#60A5FA" />
                        ) : (
                            <Ionicons name="checkmark-done-circle-outline" size={26} color="#60A5FA" />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Tabs */}
            <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
                {['all', 'unread', 'read'].map((tab) => {
                    let label = 'Tất cả';
                    if (tab === 'unread') label = `Chưa đọc (${unreadCount})`;
                    if (tab === 'read') label = 'Đã đọc';

                    const isActive = activeTab === tab;

                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabItem, 
                                isActive && [styles.activeTabBorder, { borderBottomColor: '#60A5FA' }]
                            ]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text style={[
                                styles.tabText, 
                                { color: isActive ? '#60A5FA' : colors.subText },
                                isActive && styles.activeTabText
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#60A5FA" />
                </View>
            ) : (
                <FlatList 
                    data={filteredList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshing={loading}
                    onRefresh={fetchNotifications}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={60} color={colors.border} />
                            <Text style={{ marginTop: 15, color: colors.subText }}>
                                {activeTab === 'unread' ? 'Bạn đã đọc hết thông báo!' : 'Không có thông báo nào.'}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    
    tabBar: { flexDirection: 'row', paddingHorizontal: 10, borderBottomWidth: 1 },
    tabItem: { 
        paddingVertical: 12, 
        paddingHorizontal: 15, 
        marginRight: 10 
    },
    activeTabBorder: { borderBottomWidth: 3 },
    tabText: { fontSize: 15, fontWeight: '500' },
    activeTabText: { fontWeight: 'bold' },

    notiCard: { 
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        position: 'relative',
        alignItems: 'flex-start'
    },
    unreadDot: { 
        position: 'absolute', 
        left: 8, 
        top: 35, 
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: '#3B82F6' 
    },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 15, backgroundColor: '#eee' },
    notiContent: { flex: 1 },
    notiTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
    detailText: { fontSize: 14, lineHeight: 20, marginBottom: 6 },
    notiTime: { fontSize: 12, opacity: 0.7 },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
});