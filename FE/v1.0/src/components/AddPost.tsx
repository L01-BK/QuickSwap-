import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    Image, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface AddPostProps {
    onPostSuccess: (post: any) => void;
}

export default function AddPost({ onPostSuccess }: AddPostProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const [images, setImages] = useState<string[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [category, setCategory] = useState('Tài liệu');
    const [condition, setCondition] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [department, setDepartment] = useState('');

    const categories = ['Tài liệu', 'Dụng cụ', 'Đồ mặc', 'Khác'];

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

    const handleConfirmPost = () => {
        // --- VALIDATE ---
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

        const infoArray = [];
        infoArray.push(`Danh mục: ${category}`);
        infoArray.push(`Tình trạng: ${condition}%`);
        if (author.trim()) infoArray.push(`Tác giả: ${author.trim()}`);
        if (subject.trim()) infoArray.push(`Môn học: ${subject.trim()}`);
        if (department.trim()) infoArray.push(`Khoa: ${department.trim()}`);

        const newPostData = {
            id: Date.now().toString(),
            user: 'Kevin Nguyễn',
            title: title.trim(), // Sử dụng Title riêng
            time: 'Vừa xong',
            content: content.trim(), // Sử dụng Content riêng
            tags: ['Trao đổi', category],
            info: infoArray,
            images: images
        };
        
        onPostSuccess(newPostData);
        setShowConfirmModal(false);
        
        // Reset form
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
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=26' }} style={styles.avatar} />
                    <View>
                        <Text style={styles.userName}>Kevin Nguyễn</Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.ratingText}>4,5</Text>
                            <Ionicons name="star" size={14} color="#FFD700" />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.postButton} onPress={() => setShowConfirmModal(true)}>
                    <Text style={styles.postButtonText}>Đăng</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                
                <View style={styles.inputCard}>
                    <TextInput
                        placeholder="Tiêu đề bài viết (Ngắn gọn)"
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#999"
                    />
                    
                    <View style={styles.divider} />

                    <TextInput
                        placeholder="Mô tả chi tiết về món đồ bạn muốn trao đổi..."
                        multiline
                        style={styles.contentInput}
                        value={content}
                        onChangeText={setContent}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Image Picker */}
                <View style={styles.imagePickerRow}>
                    <TouchableOpacity style={styles.addPhotoCircle} onPress={pickImage}>
                        <View style={styles.blueCircle}>
                            <Ionicons name="image" size={24} color="#fff" />
                        </View>
                        <Text style={styles.photoCount}>{images.length}/4</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {images.map((uri, index) => (
                            <View key={index} style={styles.imagePlaceholder}>
                                <Image source={{ uri: uri }} style={styles.uploadedImage} />
                                <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                                    <Ionicons name="close-circle" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <Text style={styles.sectionTitle}>Thông tin thêm:</Text>
                
                <View style={styles.infoForm}>
                    <Text style={styles.fieldLabel}>Danh mục <Text style={styles.required}>*</Text></Text>
                    <View style={styles.categoryContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity 
                                key={cat} 
                                style={[styles.catChip, category === cat && styles.catChipActive]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.fieldLabel}>Tình trạng (%) <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputRow}>
                        <TextInput 
                            style={styles.smallInput} 
                            keyboardType="numeric"
                            placeholder="VD: 95"
                            value={condition}
                            onChangeText={handleConditionChange}
                            maxLength={3}
                        />
                        <Text style={styles.unitText}>%</Text>
                    </View>

                    <Text style={styles.fieldLabel}>Tác giả (Nếu có)</Text>
                    <TextInput 
                        style={styles.fullInput} 
                        placeholder="Nhập tên tác giả..."
                        value={author}
                        onChangeText={setAuthor}
                    />

                    <View style={styles.rowSplit}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.fieldLabel}>Môn học (Nếu có)</Text>
                            <TextInput 
                                style={styles.fullInput} 
                                placeholder="VD: Triết học"
                                value={subject}
                                onChangeText={setSubject}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel}>Khoa (Nếu có)</Text>
                            <TextInput 
                                style={styles.fullInput} 
                                placeholder="VD: CNTT"
                                value={department}
                                onChangeText={setDepartment}
                            />
                        </View>
                    </View>

                </View>
                
                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal transparent visible={showConfirmModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons name="help-circle-outline" size={50} color="#60A5FA" />
                        <Text style={styles.modalTitle}>Xác nhận đăng bài</Text>
                        <Text style={styles.modalSub}>Thông tin sẽ được hiển thị công khai trên QuickSwap.</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmPost}>
                                <Text style={styles.confirmBtnText}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
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
        borderColor: '#E5E7EB', 
        borderRadius: 16, 
        padding: 15, 
        marginBottom: 20, 
        backgroundColor: '#fff',
        minHeight: 200,
    },
    titleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 5,
    },
    contentInput: { 
        fontSize: 16, 
        color: '#555', 
        flex: 1,
        textAlignVertical: 'top',
        paddingVertical: 10,
    },

    // Image Picker Styles
    imagePickerRow: { flexDirection: 'row', marginBottom: 25, alignItems: 'center', height: 80 },
    addPhotoCircle: { alignItems: 'center', marginRight: 15 },
    blueCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#93C5FD', justifyContent: 'center', alignItems: 'center' },
    photoCount: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
    imagePlaceholder: { width: 70, height: 70, borderRadius: 8, marginRight: 10, borderWidth: 1, borderColor: '#eee', position: 'relative' },
    uploadedImage: { width: '100%', height: '100%', borderRadius: 8 },
    removeIcon: { position: 'absolute', top: -8, right: -8, backgroundColor: 'white', borderRadius: 12 },
    
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    
    // INFO FORM STYLES
    infoForm: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 16, 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    fieldLabel: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '500' },
    required: { color: 'red' },
    
    // Category Chips
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    catChip: { 
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, 
        borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, marginBottom: 8 
    },
    catChipActive: { backgroundColor: '#60A5FA', borderColor: '#60A5FA' },
    catText: { color: '#666', fontSize: 13 },
    catTextActive: { color: '#fff', fontWeight: 'bold' },

    // Inputs
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    smallInput: { 
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, 
        padding: 10, width: 80, fontSize: 16, textAlign: 'center' 
    },
    unitText: { marginLeft: 10, fontSize: 16, color: '#555' },
    fullInput: { 
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, 
        padding: 10, fontSize: 15, marginBottom: 15, color: '#333'
    },
    rowSplit: { flexDirection: 'row' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    modalSub: { textAlign: 'center', color: '#666', marginBottom: 20 },
    modalActions: { flexDirection: 'row', width: '100%' },
    cancelBtn: { flex: 1, alignItems: 'center', padding: 12 },
    confirmBtn: { flex: 1, backgroundColor: '#60A5FA', alignItems: 'center', padding: 12, borderRadius: 10 },
    cancelBtnText: { color: '#999', fontWeight: 'bold' },
    confirmBtnText: { color: '#fff', fontWeight: 'bold' }
});