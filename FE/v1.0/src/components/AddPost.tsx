import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Image, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useThemeColors } from '../hooks/useThemeColors';
import { Post } from '../types';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setHomeActiveTab } from '../store/reducer/navigationSlice';
import { BASE_URL, handleApiError } from '../utils/api';

import * as Notifications from 'expo-notifications';



const convertCategoryToEnum = (uiCategory: string) => {
    switch (uiCategory) {
        case 'Tài liệu': return 'TAI_LIEU';
        case 'Dụng cụ': return 'DUNG_CU';
        case 'Đồ mặc': return 'DO_MAC';
        case 'Khác': return 'KHAC';
        default: return 'KHAC';
    }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AddPost() {
    const dispatch = useDispatch();
    const { colors } = useThemeColors();
    
    const user = useSelector((state: RootState) => state.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [category, setCategory] = useState('Tài liệu');
    const [condition, setCondition] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [department, setDepartment] = useState('');

    const categories = ['Tài liệu', 'Dụng cụ', 'Đồ mặc', 'Khác'];

    React.useEffect(() => {
        (async () => {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Bạn cần cấp quyền thông báo để nhận tin tức!');
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        })();
    }, []);
    
    const pickImage = async () => {
        if (images.length >= 4) {
            Alert.alert("Thông báo", "Bạn chỉ được đăng tối đa 4 ảnh.");
            return;
        }
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Lỗi", "Cần cấp quyền truy cập thư viện ảnh.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleConditionChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        if (numericValue === '') {
            setCondition('');
            return;
        }
        const value = parseInt(numericValue);
        if (value >= 0 && value <= 100) {
            setCondition(numericValue);
        } else if (value > 100) {
            setCondition('100');
        }
    };

    const handleConfirmPost = async () => {
    if (!title.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề bài đăng.");
        return;
    }
    if (!content.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập nội dung bài đăng.");
        return;
    }
    if (!condition) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tình trạng sản phẩm (0-100%).");
        return;
    }

    setIsSubmitting(true);

    try {
        const postPayload = {
            title: title.trim(),
            content: content.trim(),
            price: 0,
            
            category: convertCategoryToEnum(category), 
            
            conditionPercent: `${condition}%`, 
            isbnOrAuthor: author.trim(),
            subjectCode: subject.trim(),
            faculty: department.trim(),
            
            imageUrls: images, 
            tags: ['Trao đổi', category]
        };

        const response = await fetch(`${BASE_URL}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(postPayload),
        });

        await handleApiError(response);
        try {
                const notiPayload = {
                    title: "Đăng bài thành công",
                    message: `Bài viết "${title}" của bạn đã được đăng lên hệ thống.`,
                    type: "SYSTEM"
                };

                await fetch(`${BASE_URL}/api/notifications/send-to-user/${user.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify(notiPayload),
                });
                
            } catch (notiError) {
                console.log("Lỗi tạo lịch sử thông báo:", notiError);
            }
        setShowConfirmModal(false);
        resetForm();
        
        await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Đăng bài thành công! 🎉",
                    body: `Bài viết "${title}" của bạn đã được đăng lên QuickSwap.`,
                    sound: true,
                },
                trigger: null,
            });

        Alert.alert("Thành công", "Bài viết đã được đăng!", [
            {
                text: "OK",
                onPress: () => {
                    dispatch(setHomeActiveTab('home')); 
                }
            }
        ]);

    } catch (error: any) {
        console.error("Post Error:", error);
        Alert.alert("Lỗi", error.message || "Không thể đăng bài viết lúc này.");
    } finally {
        setIsSubmitting(false);
    }
};

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImages([]);
        setCategory('Tài liệu');
        setCondition('');
        setAuthor('');
        setSubject('');
        setDepartment('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} style={styles.avatar} />
                    <View>
                        <Text style={[styles.userName, { color: colors.text }]}>{user.name || 'Người dùng'}</Text>
                        <View style={styles.ratingRow}>
                            <Text style={[styles.ratingText, { color: colors.subText }]}>4,5</Text>
                            <Ionicons name="star" size={14} color="#FFD700" />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.postButton} onPress={() => setShowConfirmModal(true)}>
                    <Text style={styles.postButtonText}>Đăng</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                 {/* ... (Phần UI Input giữ nguyên như cũ) ... */}
                 
                <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TextInput
                        placeholder="Tiêu đề bài viết (Ngắn gọn)"
                        style={[styles.titleInput, { color: colors.text }]}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={colors.placeholder}
                    />

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TextInput
                        placeholder="Mô tả chi tiết về món đồ bạn muốn trao đổi..."
                        multiline
                        style={[styles.contentInput, { color: colors.subText }]}
                        value={content}
                        onChangeText={setContent}
                        placeholderTextColor={colors.placeholder}
                    />
                </View>

                {/* Image Picker */}
                <View style={styles.imagePickerRow}>
                    <TouchableOpacity style={styles.addPhotoCircle} onPress={pickImage}>
                        <View style={styles.blueCircle}>
                            <Ionicons name="image" size={24} color="#fff" />
                        </View>
                        <Text style={[styles.photoCount, { color: colors.text }]}>{images.length}/4</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {images.map((uri, index) => (
                            <View key={index} style={[styles.imagePlaceholder, { borderColor: colors.border }]}>
                                <Image source={{ uri: uri }} style={styles.uploadedImage} />
                                <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                                    <Ionicons name="close-circle" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin thêm:</Text>

                <View style={[styles.infoForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.fieldLabel, { color: colors.subText }]}>Danh mục <Text style={styles.required}>*</Text></Text>
                    <View style={styles.categoryContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.catChip,
                                    { borderColor: colors.border },
                                    category === cat && styles.catChipActive
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.catText, { color: colors.subText }, category === cat && styles.catTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.fieldLabel, { color: colors.subText }]}>Tình trạng (%) <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.smallInput, { color: colors.text, borderColor: colors.border }]}
                            keyboardType="numeric"
                            placeholder="VD: 95"
                            value={condition}
                            onChangeText={handleConditionChange}
                            maxLength={3}
                            placeholderTextColor={colors.placeholder}
                        />
                        <Text style={[styles.unitText, { color: colors.subText }]}>%</Text>
                    </View>

                    <Text style={[styles.fieldLabel, { color: colors.subText }]}>Tác giả (Nếu có)</Text>
                    <TextInput
                        style={[styles.fullInput, { color: colors.text, borderColor: colors.border }]}
                        placeholder="Nhập tên tác giả..."
                        value={author}
                        onChangeText={setAuthor}
                        placeholderTextColor={colors.placeholder}
                    />

                    <View style={styles.rowSplit}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={[styles.fieldLabel, { color: colors.subText }]}>Môn học (Nếu có)</Text>
                            <TextInput
                                style={[styles.fullInput, { color: colors.text, borderColor: colors.border }]}
                                placeholder="VD: Triết học"
                                value={subject}
                                onChangeText={setSubject}
                                placeholderTextColor={colors.placeholder}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.fieldLabel, { color: colors.subText }]}>Khoa (Nếu có)</Text>
                            <TextInput
                                style={[styles.fullInput, { color: colors.text, borderColor: colors.border }]}
                                placeholder="VD: CNTT"
                                value={department}
                                onChangeText={setDepartment}
                                placeholderTextColor={colors.placeholder}
                            />
                        </View>
                    </View>

                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal transparent visible={showConfirmModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        {isSubmitting ? (
                            <View style={{ alignItems: 'center', padding: 20 }}>
                                <ActivityIndicator size="large" color="#60A5FA" />
                                <Text style={{ marginTop: 10, color: colors.text }}>Đang đăng bài...</Text>
                            </View>
                        ) : (
                            <>
                                <Ionicons name="help-circle-outline" size={50} color="#60A5FA" />
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Xác nhận đăng bài</Text>
                                <Text style={[styles.modalSub, { color: colors.subText }]}>Thông tin sẽ được hiển thị công khai trên QuickSwap.</Text>
                                <View style={styles.modalActions}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                                        <Text style={styles.cancelBtnText}>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmPost}>
                                        <Text style={styles.confirmBtnText}>Đồng ý</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 10 },
    userName: { fontWeight: 'bold', fontSize: 16, color: '#3B4161' },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 14, marginRight: 3 },
    postButton: { backgroundColor: '#60A5FA', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 10 },
    postButtonText: { color: '#fff', fontWeight: 'bold' },
    scrollBody: { padding: 20 },

    inputCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        minHeight: 200,
    },
    titleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        marginVertical: 5,
    },
    contentInput: {
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'top',
        paddingVertical: 10,
    },

    // Image Picker Styles
    imagePickerRow: { flexDirection: 'row', marginBottom: 25, alignItems: 'center', height: 80 },
    addPhotoCircle: { alignItems: 'center', marginRight: 15 },
    blueCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#93C5FD', justifyContent: 'center', alignItems: 'center' },
    photoCount: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
    imagePlaceholder: { width: 70, height: 70, borderRadius: 8, marginRight: 10, borderWidth: 1, position: 'relative' },
    uploadedImage: { width: '100%', height: '100%', borderRadius: 8 },
    removeIcon: { position: 'absolute', top: -8, right: -8, backgroundColor: 'white', borderRadius: 12 },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

    // INFO FORM STYLES
    infoForm: {
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    fieldLabel: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
    required: { color: 'red' },

    // Category Chips
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    catChip: {
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
        borderWidth: 1, marginRight: 8, marginBottom: 8
    },
    catChipActive: { backgroundColor: '#60A5FA', borderColor: '#60A5FA' },
    catText: { fontSize: 13 },
    catTextActive: { color: '#fff', fontWeight: 'bold' },

    // Inputs
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    smallInput: {
        borderWidth: 1, borderRadius: 8,
        padding: 10, width: 80, fontSize: 16, textAlign: 'center'
    },
    unitText: { marginLeft: 10, fontSize: 16 },
    fullInput: {
        borderWidth: 1, borderRadius: 8,
        padding: 10, fontSize: 15, marginBottom: 15
    },
    rowSplit: { flexDirection: 'row' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', borderRadius: 20, padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    modalSub: { textAlign: 'center', marginBottom: 20 },
    modalActions: { flexDirection: 'row', width: '100%' },
    cancelBtn: { flex: 1, alignItems: 'center', padding: 12 },
    confirmBtn: { flex: 1, backgroundColor: '#60A5FA', alignItems: 'center', padding: 12, borderRadius: 10 },
    cancelBtnText: { color: '#999', fontWeight: 'bold' },
    confirmBtnText: { color: '#fff', fontWeight: 'bold' }
});