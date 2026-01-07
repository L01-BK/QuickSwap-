import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Register Component ---

import { useDispatch } from 'react-redux';
import { navigateTo, setOtpContext } from '../store/reducer/navigationSlice';
import { updateUser } from '../store/reducer/userSlice';
import { BASE_URL, handleApiError } from '../utils/api';
import { Alert } from 'react-native';

// --- Register Component ---


export default function Register() {
    const dispatch = useDispatch();

    const onRegister = () => {
        dispatch(setOtpContext('register'));
        dispatch(navigateTo('otp'));
    };
    const onLogin = () => dispatch(navigateTo('login'));

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const title = "ĐĂNG KÝ";
    const subtitle = "Có vẻ như bạn chưa có tài khoản. Hãy tạo một tài khoản mới cho bạn nhé!";

    const handleRegister = async () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Simplified password regex for testing purposes, or match backend if known. 
        // Keeping original regex: At least 1 uppercase, 1 number.
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

        if (!name) {
            setNameError('Vui lòng nhập tên');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!email) {
            setEmailError('Vui lòng nhập email');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Sai định dạng email');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('Mật khẩu phải chứa ít nhất 8 ký tự');
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Mật khẩu không khớp');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        if (isValid) {
            // Call API
            try {
                const response = await fetch(`${BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });

                const data = await handleApiError(response);

                // Assuming successful registration logs the user in immediately
                if (data.token && data.user) {
                    // Assuming successful registration logs the user in immediately
                    // But we want to Alert first as per request
                    dispatch(updateUser({ ...data.user, token: data.token })); // Keep this if we assume they are "logged in" contextually

                    Alert.alert(
                        "Đăng ký thành công",
                        "Bạn đã đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.",
                        [
                            {
                                text: "OK",
                                onPress: () => dispatch(navigateTo('login'))
                            }
                        ]
                    );

                } else {
                    // Fallback if structure is different
                    onRegister();
                }

            } catch (error: any) {
                console.log('Register Error:', error);
                Alert.alert("Đăng ký thất bại", error.message || "Đã có lỗi xảy ra");
            }
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>

            {/* Background Circles */}
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

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Tên"
                                    style={styles.input}
                                    placeholderTextColor="#888"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        if (nameError) setNameError('');
                                    }}
                                />
                            </View>

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

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Mật khẩu"
                                    style={styles.input}
                                    secureTextEntry
                                    placeholderTextColor="#888"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (passwordError) setPasswordError('');
                                    }}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Nhập lại mật khẩu"
                                    style={styles.input}
                                    secureTextEntry
                                    placeholderTextColor="#888"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (confirmPasswordError) setConfirmPasswordError('');
                                    }}
                                />
                            </View>

                            {nameError ? (
                                <Text style={styles.errorText}>{nameError}</Text>
                            ) : emailError ? (
                                <Text style={styles.errorText}>{emailError}</Text>
                            ) : passwordError ? (
                                <Text style={styles.errorText}>{passwordError}</Text>
                            ) : confirmPasswordError ? (
                                <Text style={styles.errorText}>{confirmPasswordError}</Text>
                            ) : null}

                            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>TRỞ LẠI </Text>
                                <TouchableOpacity onPress={onLogin}>
                                    <Text style={styles.linkText}>ĐĂNG NHẬP</Text>
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
    // Register specific styles
    inputContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 15,
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
    button: {
        backgroundColor: '#60A5FA',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 13,
    },
    linkText: {
        color: '#60A5FA',
        fontWeight: 'bold',
        fontSize: 13,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    }
});
