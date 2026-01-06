import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme } from '../store/reducer/themeSlice';
import { navigateTo, setHomeActiveTab } from '../store/reducer/navigationSlice';

export default function Profile() {
    const dispatch = useDispatch();
    const isNightMode = useSelector((state: RootState) => state.theme.isNightMode);
    const user = useSelector((state: RootState) => state.user);

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

    const toggleNotification = () => setIsNotificationEnabled(previousState => !previousState);

    // Color definitions based on Light/Dark mode
    const backgroundColor = isNightMode ? '#121212' : '#FDFDFD';
    const cardBackgroundColor = isNightMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isNightMode ? '#FFFFFF' : '#000000';
    const subTextColor = isNightMode ? '#AAAAAA' : '#9E9E9E'; // Lighter grey for light mode

    // Icon colors matching the mockup
    const iconColor = isNightMode ? '#FFFFFF' : '#2D2D2D'; // Dark grey for icons themselves
    const purpleIconColor = isNightMode ? '#A78BFA' : '#5B4DBC'; // Deep purple for specific icons (Moon)
    const checkIconColor = isNightMode ? '#FFFFFF' : '#2D2D2D';

    // Icon Background colors - Lavender in light mode, Dark grey in night mode
    const iconBgColor = isNightMode ? '#333333' : '#F5F6FA';
    const purpleIconBgColor = isNightMode ? '#333333' : '#F5F6FA'; // Adjust if needed to be distinct

    const chevronColor = isNightMode ? '#666666' : '#C7C7CC';
    const cardColor = cardBackgroundColor;

    const handleMyAccountClick = () => {
        dispatch(setHomeActiveTab('profile'));
        dispatch(navigateTo('my-account'));
    };

    const handleLogout = () => {
        dispatch(navigateTo('login'));
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header Card */}
            <View style={styles.headerCardContainer}>
                <View style={styles.headerCard}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            {/* Placeholder Avatar */}
                            <View style={[styles.avatarPlaceholder, { backgroundColor: isNightMode ? '#333' : '#FF7F50' }]}>
                                {/* Using an illustration-like placeholder if possible, or just the user image */}
                                <Image
                                    style={styles.avatarImage}
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} // Example avatar
                                />
                            </View>
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerName}>{user.name}</Text>
                            <Text style={styles.headerSchool}>{user.university}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={[styles.sectionContainer, { backgroundColor: cardBackgroundColor }]}>
                    {/* My Account */}
                    <TouchableOpacity style={styles.row} onPress={handleMyAccountClick}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="person-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>My Account</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Make changes to your account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
                    </TouchableOpacity>

                    {/* Night Mode */}
                    <View style={styles.row}>
                        <View style={[styles.iconContainer, { backgroundColor: purpleIconBgColor }]}>
                            <Ionicons name="moon-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>Night</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Manage your light mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#81b0ff" }} // Light grey track when off
                            thumbColor={isNightMode ? "#f5dd4b" : "#A9A9A9"} // Dark grey thumb when off in light mode
                            ios_backgroundColor="#E0E0E0"
                            onValueChange={() => { dispatch(toggleTheme()); }}
                            value={isNightMode}
                        />
                    </View>

                    {/* Notification */}
                    <View style={styles.row}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="notifications-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>Notification</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Manage your notification</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#81b0ff" }}
                            thumbColor={isNotificationEnabled ? "#f5dd4b" : "#A9A9A9"}
                            ios_backgroundColor="#E0E0E0"
                            onValueChange={toggleNotification}
                            value={isNotificationEnabled}
                        />
                    </View>

                    {/* New Password */}
                    <TouchableOpacity style={styles.row}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="checkmark-circle-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>New Password</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Change your password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
                    </TouchableOpacity>

                    {/* Log out */}
                    <TouchableOpacity style={styles.row} onPress={handleLogout}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="log-out-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>Log out</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Further secure your account for safety</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
                    </TouchableOpacity>
                </View>

                {/* Section: More */}
                <Text style={[styles.sectionHeader, { color: textColor }]}>More</Text>

                <View style={[styles.sectionContainer, { backgroundColor: cardColor }]}>
                    {/* Help & Support */}
                    <TouchableOpacity style={styles.row}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="help-circle-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
                    </TouchableOpacity>

                    {/* About App */}
                    <TouchableOpacity style={styles.row}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name="heart-outline" size={22} color={iconColor} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: textColor }]}>About App</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerCardContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerCard: {
        backgroundColor: '#60A5FA', // Blue header
        borderRadius: 12,
        padding: 20,
        // Shadow for header
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
        marginRight: 15,
        overflow: 'hidden',
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSchool: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
        marginLeft: 5,
    },
    sectionContainer: {
        width: '100%',
        marginBottom: 10,
        padding: 16,

        backgroundColor: '#FFFFFF',
        borderRadius: 16,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,

        // Android shadow
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16, // Increased padding
        paddingHorizontal: 8
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25, // Circular
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    rowContent: {
        flex: 1,
        justifyContent: 'center',
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    rowSubtitle: {
        fontSize: 13,
    },
    separator: {
        height: 1,
        marginLeft: 60, // Indent to align with text
    },
});
