import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo, setHomeActiveTab } from '../store/reducer/navigationSlice';
import { updateUser } from '../store/reducer/userSlice';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile } from '../services/userService';
import { uploadImage } from '../services/uploadService';
import { ActivityIndicator } from 'react-native';


export default function MyAccount() {
    const dispatch = useDispatch();
    const isNightMode = useSelector((state: RootState) => state.theme.isNightMode);
    const user = useSelector((state: RootState) => state.user);

    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState(user);
    const [isUploading, setIsUploading] = React.useState(false);

    React.useEffect(() => {
        setFormData(user);
    }, [user]);

    const onBack = () => {
        dispatch(setHomeActiveTab('profile'));
        dispatch(navigateTo('home'));
    };

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                // Call API to update user profile
                const updatedUser = await updateUserProfile(formData, user.token);
                dispatch(updateUser(updatedUser));
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to update profile:", error);
                // Optionally handle error state here
                alert("Failed to update profile. Please try again.");
            }
        } else {
            setIsEditing(true);
        }
    };

    const pickImage = async () => {
        if (!isEditing) return;

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            try {
                setIsUploading(true);
                const localUri = result.assets[0].uri;
                // Optimistic update
                handleChange('avatarUrl', localUri);

                if (user.token) {
                    const response = await uploadImage(localUri, user.token);
                    console.log('Upload response:', response.url);
                    handleChange('avatarUrl', response.url);
                } else {
                    console.error("No auth token found");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const backgroundColor = isNightMode ? '#121212' : '#fff';
    const textColor = isNightMode ? '#fff' : '#000';
    const cardBg = isNightMode ? '#1E1E1E' : '#fff';
    const subTextColor = isNightMode ? '#aaa' : '#555';
    const dividerColor = isNightMode ? '#333' : '#F3F4F6';
    const iconColor = isNightMode ? '#fff' : '#000';
    const inputBorderColor = isNightMode ? '#555' : '#ddd';

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<Ionicons key={i} name="star" size={20} color="#FFD700" />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<Ionicons key={i} name="star-half" size={20} color="#FFD700" />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={20} color="#FFD700" />);
            }
        }
        return stars;
    };

    const renderField = (label: string, field: keyof typeof formData, isLink = false, readOnly = false) => (
        <View style={styles.row}>
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            {isEditing && !readOnly ? (
                <TextInput
                    style={[styles.input, { color: subTextColor, borderColor: inputBorderColor }]}
                    value={String(formData[field] || '')}
                    onChangeText={(text) => handleChange(field as string, text)}
                    multiline={field === 'address'}
                />
            ) : (
                <Text style={[styles.value, isLink && styles.link, { color: subTextColor }]}>
                    {formData[field]}
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={iconColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>My Account</Text>
                <TouchableOpacity
                    onPress={handleEditToggle}
                    style={styles.editHeaderButton}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <ActivityIndicator size="small" color={iconColor} />
                    ) : (
                        <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={26} color={iconColor} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header Block */}
                <View style={styles.profileHeader}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={!isEditing}>
                        {/* Placeholder Avatar */}
                        <View style={styles.avatarPlaceholder}>
                            <Image
                                source={{ uri: formData.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                                style={styles.avatar}
                            />
                            {isEditing && (
                                <View style={styles.cameraIconOverlay}>
                                    {isUploading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="camera" size={30} color="#fff" />
                                    )}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {isEditing ? (
                        <TextInput
                            style={[styles.nameInput, { color: textColor, borderColor: inputBorderColor }]}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="Name"
                            placeholderTextColor={subTextColor}
                        />
                    ) : (
                        <Text style={[styles.nameText, { color: textColor }]}>{formData.name}</Text>
                    )}

                    {/* Remove handle UI */}
                </View>

                {/* Info Card */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    {renderField('Username', 'username')}
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>My Rating</Text>
                        <View style={styles.ratingContainer}>
                            {renderStars(formData.rating)}
                            <Text style={[styles.ratingText, { color: textColor }]}>{formData.rating}</Text>
                        </View>
                    </View>
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    {renderField('Email', 'email', true, true)}
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    {renderField('Phone', 'phone')}
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    {renderField('University', 'university')}
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    {renderField('Address', 'address')}
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
    input: {
        fontSize: 16,
        borderBottomWidth: 1,
        paddingVertical: 5,
        minWidth: 150,
        textAlign: 'right',
    },
    nameInput: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 200,
    },
    handleInput: {
        fontSize: 16,
        borderBottomWidth: 1,
        minWidth: 100,
        textAlign: 'center',
    },
    cameraIconOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
