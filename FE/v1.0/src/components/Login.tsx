import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

interface LoginProps {
    onLogin: () => void;
    onRegister: () => void;
    onForgotPassword?: () => void;
}

export default function Login({ onLogin, onRegister, onForgotPassword }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const title = "ĐĂNG NHẬP";
    const subtitle = "Chào mừng quay trở lại! Hãy đăng nhập để tiếp tục.";

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

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
        } else {
            setPasswordError('');
        }

        if (isValid) {
            onLogin();
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Background Circles */}
            <View style={styles.background} pointerEvents="none">
                <View style={styles.circle1} />
                <View style={styles.circle2} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError) setPasswordError('');
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <AntDesign
                                name={showPassword ? 'eye' : 'eye-invisible'}
                                size={22}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </View>

                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}


                    <View style={styles.optionsRow}>
                        <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>Lưu mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onForgotPassword}>
                            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>BẠN KHÔNG CÓ TÀI KHOẢN? </Text>
                        <TouchableOpacity onPress={onRegister}>
                            <Text style={styles.linkText}>ĐĂNG KÝ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    // Login specific styles
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
    eyeIcon: {
        padding: 5,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#60A5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#60A5FA',
    },
    checkboxLabel: {
        color: '#333',
    },
    forgotPassword: {
        color: '#666',
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#60A5FA',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
