import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsProps {
    onBack: () => void;
}

export default function Notifications({ onBack }: NotificationsProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');

    const notifications = [
        {
            id: 1,
            title: 'Yêu cầu của bạn được chấp nhận',
            time: '11 phút trước',
            from: 'Vincent',
            product: 'Giáo trình triết học',
            status: 'Đồng ý/Từ chối',
            unread: false,
            avatar: 'https://i.pravatar.cc/100?u=vincent'
        },
        {
            id: 2,
            title: 'Lois Griffin đã gửi yêu cầu đến bạn',
            time: '1 giờ trước ago',
            unread: true,
            avatar: 'https://i.pravatar.cc/100?u=lois'
        },
        {
            id: 3,
            title: 'Bài viết của bạn đã được duyệt',
            time: '1 giờ trước ago',
            unread: true,
            avatar: 'https://i.pravatar.cc/100?u=system'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.logoText}>
                        Quick<Text style={styles.logoHighlight}>Swap</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View>
                        <Ionicons name="notifications" size={26} color="#60A5FA" />
                        <View style={styles.headerBadge} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={[styles.tabItem, activeTab === 'all' && styles.activeTabBorder]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả</Text>
                    <View style={styles.countBadge}><Text style={styles.countText}>2</Text></View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tabItem, activeTab === 'unread' && styles.activeTabBorder]}
                    onPress={() => setActiveTab('unread')}
                >
                    <Text style={styles.tabText}>Chưa đọc</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tabItem, activeTab === 'read' && styles.activeTabBorder]}
                    onPress={() => setActiveTab('read')}
                >
                    <Text style={styles.tabText}>Đã đọc</Text>
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.outlineButton}>
                    <Text style={styles.outlineButtonText}>Đánh dấu đã đọc tất cả</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineButton}>
                    <Text style={styles.outlineButtonText}>Lưu trữ đã đọc</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView style={styles.listContainer}>
                {notifications.map((item) => (
                    <View key={item.id} style={styles.notiCard}>
                        {item.unread && <View style={styles.unreadDot} />}
                        
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        
                        <View style={styles.notiContent}>
                            <Text style={styles.notiTitle}>{item.title}</Text>
                            <Text style={styles.notiTime}>{item.time}</Text>
                            
                            {item.from && (
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailText}>Từ: {item.from}</Text>
                                    <Text style={styles.detailText}>Sản phẩm: {item.product}</Text>
                                    <Text style={styles.detailText}>Trạng thái: {item.status}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    logoText: { fontSize: 26, fontWeight: 'bold', color: '#000' },
    logoHighlight: { color: '#60A5FA' },
    headerBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF4D4D',
        borderWidth: 2,
        borderColor: '#fff'
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginRight: 25,
    },
    activeTabBorder: {
        borderBottomWidth: 2,
        borderBottomColor: '#000'
    },
    tabText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
    activeTabText: { color: '#000', fontWeight: 'bold' },
    countBadge: {
        backgroundColor: '#FF4D4D',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        paddingHorizontal: 4
    },
    countText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    actionRow: {
        flexDirection: 'row',
        padding: 20,
        gap: 10
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    outlineButtonText: { fontSize: 13, color: '#4B5563' },
    listContainer: { flex: 1 },
    notiCard: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
        position: 'relative'
    },
    unreadDot: {
        position: 'absolute',
        left: 8,
        top: '50%',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6'
    },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    notiContent: { flex: 1 },
    notiTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
    notiTime: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
    detailBox: { marginTop: 8 },
    detailText: { fontSize: 14, color: '#6B7280', lineHeight: 20 }
});