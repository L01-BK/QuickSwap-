import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo, setHomeActiveTab } from '../store/reducer/navigationSlice';


export default function MyAccount() {
    const dispatch = useDispatch();
    const isNightMode = useSelector((state: RootState) => state.theme.isNightMode);
    const user = useSelector((state: RootState) => state.user);

    const onBack = () => {
        dispatch(setHomeActiveTab('profile'));
        dispatch(navigateTo('home'));
    };

    const backgroundColor = isNightMode ? '#121212' : '#fff';
    const textColor = isNightMode ? '#fff' : '#000';
    const cardBg = isNightMode ? '#1E1E1E' : '#fff';
    const subTextColor = isNightMode ? '#aaa' : '#555';
    const dividerColor = isNightMode ? '#333' : '#F3F4F6';
    const iconColor = isNightMode ? '#fff' : '#000';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={iconColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>My Account</Text>
                <TouchableOpacity style={styles.editHeaderButton}>
                    <Ionicons name="pencil" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header Block */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar */}
                        <View style={styles.avatarPlaceholder}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                                style={styles.avatar}
                            />
                        </View>
                    </View>

                    <Text style={[styles.nameText, { color: textColor }]}>{user.name}</Text>
                    <View style={styles.handleContainer}>
                        <Text style={[styles.handleText, { color: subTextColor }]}>{user.handle}</Text>
                        <TouchableOpacity style={styles.editHandleButton}>
                            <Ionicons name="pencil" size={16} color={iconColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Card */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Username</Text>
                        <Text style={[styles.value, { color: subTextColor }]}>{user.username}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>My Rating</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <Ionicons name="star-outline" size={20} color="#FFD700" />
                            <Text style={[styles.ratingText, { color: textColor }]}>{user.rating}</Text>
                        </View>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Email</Text>
                        <Text style={[styles.value, styles.link, { color: subTextColor }]}>{user.email}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Phone</Text>
                        <Text style={[styles.value, { color: subTextColor }]}>{user.phone}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>University</Text>
                        <Text style={[styles.value, { color: subTextColor }]}>{user.university}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Address</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={[styles.value, { color: subTextColor }]}>{user.address}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    editHeaderButton: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatarContainer: {
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#fff',
        backgroundColor: '#FF6B6B', // Fallback color
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    handleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    handleText: {
        fontSize: 16,
        color: '#555',
        marginRight: 8,
    },
    editHandleButton: {
        padding: 4,
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        // Card shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: '#333',
        textAlign: 'right',
        flex: 2,
    },
    link: {
        textDecorationLine: 'underline',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});
