import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { navigateTo } from '../store/reducer/navigationSlice';
import { useThemeColors } from '../hooks/useThemeColors';

export default function HelpSupport() {
    const dispatch = useDispatch();
    const { colors } = useThemeColors();

    const handleBack = () => {
        dispatch(navigateTo('profile'));
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Câu hỏi thường gặp</Text>
                {/* View rỗng để cân bằng layout header */}
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* Question 1 */}
                <View style={styles.section}>
                    <Text style={[styles.question, { color: colors.text }]}>1. QuickSwap là gì?</Text>
                    <Text style={[styles.answer, { color: colors.subText }]}>
                        Quick Swap là ứng dụng giúp sinh viên trao đổi, cho mượn hoặc xin đồ dùng một cách nhanh chóng trong cộng đồng cùng trường hoặc khu vực gần bạn.
                    </Text>
                </View>

                {/* Question 2 */}
                <View style={styles.section}>
                    <Text style={[styles.question, { color: colors.text }]}>2. Ai có thể sử dụng Quick Swap?</Text>
                    <Text style={[styles.answer, { color: colors.subText }]}>
                        Ứng dụng dành cho sinh viên, ưu tiên đăng ký bằng email trường để đảm bảo độ tin cậy và an toàn cho cộng đồng.
                    </Text>
                </View>

                {/* Question 3 */}
                <View style={styles.section}>
                    <Text style={[styles.question, { color: colors.text }]}>3. Tôi có thể đăng những loại đồ nào?</Text>
                    <Text style={[styles.answer, { color: colors.subText }]}>Bạn có thể đăng:</Text>
                    <View style={styles.bulletPoint}>
                        <Text style={[styles.bulletText, { color: colors.subText }]}>• Đồ học tập (sách, giáo trình, máy tính cầm tay)</Text>
                        <Text style={[styles.bulletText, { color: colors.subText }]}>• Đồ điện tử (tai nghe, sạc, chuột)</Text>
                        <Text style={[styles.bulletText, { color: colors.subText }]}>• Đồ sinh hoạt (quạt mini, ổ cắm, nồi cơm mini)</Text>
                        <Text style={[styles.bulletText, { color: colors.subText }]}>• Các vật dụng còn sử dụng tốt, hợp pháp</Text>
                    </View>
                </View>

                {/* Question 4 */}
                <View style={styles.section}>
                    <Text style={[styles.question, { color: colors.text }]}>4. Làm sao để liên hệ với người đăng bài?</Text>
                    <Text style={[styles.answer, { color: colors.subText }]}>
                        Bạn có thể nhắn tin trực tiếp trong ứng dụng để trao đổi chi tiết về thời gian, địa điểm và hình thức mượn/đổi.
                    </Text>
                </View>

                {/* Illustration Image */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/images/help.png')} 
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
        marginBottom: 20,
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
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    answer: {
        fontSize: 15,
        lineHeight: 22,
    },
    bulletPoint: {
        marginTop: 5,
        paddingLeft: 10,
    },
    bulletText: {
        fontSize: 15,
        lineHeight: 24,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    illustration: {
        width: '100%',
        height: 200,
    }
});