import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

interface ForgotPasswordProps {
    onNext: () => void;
    onCancel: () => void;
}

export default function ForgotPassword({ onNext, onCancel }: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const title = "QUÊN MẬT KHẨU";
    const subtitle = "Nhập tài khoản email của bạn để đặt lại mật khẩu.";

    const handleNext = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Vui lòng nhập email');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Sai định dạng email');
            return;
        }
        setEmailError('');
        onNext();
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>

            {/* Background */}
            <View style={styles.background} pointerEvents="none">
                <View style={styles.circle1} />
                <View style={styles.circle2} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.logoText}>
                                Quick<Text style={styles.logoHighlight}>Swap</Text>
                            </Text>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>{subtitle}</Text>

                            <View style={styles.contentContainer}>
                                <Image
                                    source={require('../../assets/images/mail.png')}
                                    style={styles.image}
                                    resizeMode="contain"
                                />

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Email"
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (emailError) setEmailError('');
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {emailError ? (
                                    <Text style={styles.errorText}>{emailError}</Text>
                                ) : null}

                                <TouchableOpacity style={styles.button} onPress={handleNext}>
                                    <Text style={styles.buttonText}>TIẾP THEO</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                    <Text style={styles.cancelButtonText}>HỦY BỎ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    circle1: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#C8E6FF',
        opacity: 0.5,
    },
    circle2: {
        position: 'absolute',
        bottom: -20,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#93C5FD',
        opacity: 0.5,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 32,
        paddingHorizontal: 30,
        paddingTop: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        minHeight: 48,
        justifyContent: 'center',
    },
    backSlot: {
        position: 'absolute',
        left: 0,
        height: 48,
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    logoHighlight: {
        color: '#60A5FA',
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B4161',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 30,
        lineHeight: 20,
        textAlign: 'center',
    },
    // ForgotPassword specific styles
    contentContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 250,
        marginBottom: 24,
    },
    inputContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 8, // Reduced margin for error text below
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#000',
    },
    errorText: {
        color: '#FF6B6B', // Light red error color
        fontSize: 12,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#60A5FA',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
