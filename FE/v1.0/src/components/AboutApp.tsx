import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { navigateTo } from '../store/reducer/navigationSlice';
import { useThemeColors } from '../hooks/useThemeColors';

export default function AboutApp() {
    const dispatch = useDispatch();
    const { colors } = useThemeColors();

    const handleBack = () => {
        dispatch(navigateTo('home'));
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
             {/* Header */}
             <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Về Quick Swap</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* Intro Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>🚀 About Quick Swap</Text>
                    <Text style={[styles.text, { color: colors.subText }]}>
                        Quick Swap là nền tảng giúp sinh viên trao đổi, cho mượn và chia sẻ đồ dùng một cách nhanh chóng và tiện lợi trong cộng đồng xung quanh bạn.
                    </Text>
                    <Text style={[styles.text, { color: colors.subText, marginTop: 10 }]}>
                        Chúng tôi tin rằng rất nhiều vật dụng chỉ được dùng trong thời gian ngắn nhưng lại tốn kém và lãng phí. Quick Swap ra đời để kết nối những người cần và những người có, giúp tiết kiệm chi phí, giảm lãng phí và xây dựng một cộng đồng sinh viên hỗ trợ lẫn nhau.
                    </Text>
                </View>

                {/* Why Choose Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>✨ Vì sao chọn Quick Swap?</Text>
                    <View style={styles.listContainer}>
                        <Text style={[styles.text, { color: colors.subText }]}>• Đăng bài và tìm đồ chỉ trong vài thao tác</Text>
                        <Text style={[styles.text, { color: colors.subText }]}>• Xác thực bằng email trường, tăng độ tin cậy</Text>
                        <Text style={[styles.text, { color: colors.subText }]}>• Nhắn tin trực tiếp, trao đổi nhanh chóng</Text>
                        <Text style={[styles.text, { color: colors.subText }]}>• Hoàn toàn miễn phí</Text>
                    </View>
                    
                    <Text style={[styles.text, { color: colors.subText, marginTop: 15, fontWeight: '500' }]}>
                        Quick Swap không chỉ là một ứng dụng trao đổi đồ dùng, mà còn là nơi chia sẻ – tiết kiệm – kết nối trong đời sống sinh viên hiện đại.
                    </Text>
                </View>

                {/* Illustration */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/images/about-us.png')} 
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 24,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'justify'
    },
    listContainer: {
        marginTop: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    illustration: {
        width: '100%',
        height: 220,
        borderRadius: 12,
    }
});