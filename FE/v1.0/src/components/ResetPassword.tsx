import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ResetPasswordProps {
    onFinish: () => void;
    onCancel: () => void;
}

export default function ResetPassword({ onFinish, onCancel }: ResetPasswordProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [confirmPasswordError, setConfirmPasswordError] = useState('');


    const title = "ĐẶT LẠI MẬT KHẨU";
    const subtitle = "Mật khẩu được đặt lại phải khác với trước đó.";

    const handleFinish = () => {
        let isValid = true;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

        if (!password) {
            setPasswordError('Vui lòng nhập mật khẩu');
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
            onFinish();
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
                    <View style={styles.backSlot}>
                        <TouchableOpacity onPress={onCancel}>
                            <Ionicons name="chevron-back" size={28} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.logoText}>
                        Quick<Text style={styles.logoHighlight}>Swap</Text>
                    </Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>

                    <View style={styles.contentContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Mật khẩu"
                                style={styles.input}
                                secureTextEntry
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
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
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}


                        <TouchableOpacity style={styles.button} onPress={handleFinish}>
                            <Text style={styles.buttonText}>TIẾP THEO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>HỦY BỎ</Text>
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
    // ResetPassword specific styles
    contentContainer: {
        flex: 1,
        marginTop: 20
    },
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
        marginBottom: 15,
        marginTop: 20,
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
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    }
});
