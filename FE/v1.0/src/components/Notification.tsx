import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Image, SafeAreaView, ActivityIndicator, FlatList
} from 'react-native';
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

    const fetchNotifications = async () => {
        if (!user.token) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/notifications/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await handleApiError(response);
            
            const list = Array.isArray(data) ? data : (data.content || []);
            setNotifications(list);
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
        try {
            await fetch(`${BASE_URL}/api/notifications/me/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.log(error);
        }
    };

    const filteredList = notifications.filter(item => {
        if (activeTab === 'unread') return !item.isRead;
        if (activeTab === 'read') return item.isRead;
        return true;
    });

    const getAvatar = (item: NotificationItem) => {
        return item.senderAvatar 
            ? { uri: item.senderAvatar } 
            : { uri: 'https://i.pravatar.cc/100?img=12' };
    };

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity 
            style={[styles.notiCard, { borderBottomColor: colors.border, backgroundColor: item.isRead ? 'transparent' : colors.card }]}
            onPress={() => handleMarkRead(item.id)}
        >
            {!item.isRead && <View style={styles.unreadDot} />}
            <Image source={getAvatar(item)} style={styles.avatar} />
            <View style={styles.notiContent}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.detailText, { color: colors.subText }]} numberOfLines={2}>
                    {item.message}
                </Text>
                <Text style={[styles.notiTime, { color: colors.subText, fontSize: 11, marginTop: 4 }]}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={[styles.logoText, { color: colors.text }]}>
                        Quick<Text style={styles.logoHighlight}>Swap</Text>
                    </Text>
                </TouchableOpacity>
                <View>
                    <Ionicons name="notifications" size={26} color="#60A5FA" />
                    {notifications.some(n => !n.isRead) && <View style={styles.headerBadge} />}
                </View>
            </View>

            {/* Tabs */}
            <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
                {['all', 'unread', 'read'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabItem, activeTab === tab && [styles.activeTabBorder, { borderBottomColor: colors.text }]]}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text style={[styles.tabText, { color: colors.subText }, activeTab === tab && [styles.activeTabText, { color: colors.text }]]}>
                            {tab === 'all' ? 'Tất cả' : tab === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#60A5FA" />
            ) : (
                <FlatList 
                    data={filteredList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: colors.subText }}>Không có thông báo nào.</Text>
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
        paddingVertical: 15
    },
    logoText: { fontSize: 26, fontWeight: 'bold' },
    logoHighlight: { color: '#60A5FA' },
    headerBadge: {
        position: 'absolute', top: -2, right: -2, width: 10, height: 10,
        borderRadius: 5, backgroundColor: '#FF4D4D', borderWidth: 2, borderColor: '#fff'
    },
    tabBar: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1 },
    tabItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginRight: 25 },
    activeTabBorder: { borderBottomWidth: 2 },
    tabText: { fontSize: 16, fontWeight: '500' },
    activeTabText: { fontWeight: 'bold' },
    notiCard: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, position: 'relative' },
    unreadDot: { position: 'absolute', left: 8, top: '50%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6' },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    notiContent: { flex: 1 },
    notiTitle: { fontSize: 15, fontWeight: 'bold' },
    notiTime: { fontSize: 13, marginTop: 2 },
    detailText: { fontSize: 14, lineHeight: 20 }
});