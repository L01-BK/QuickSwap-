import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- OTP Component ---

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { navigateTo, setResetOtp, setHomeActiveTab } from '../store/reducer/navigationSlice';
import { checkOtp } from '../services/authService';
import { ActivityIndicator } from 'react-native';

export default function OTP() {
    const dispatch = useDispatch();
    const { otpContext, resetEmail } = useSelector((state: RootState) => state.navigation);
    const [loading, setLoading] = useState(false);

    const onVerify = () => {
        if (otpContext === 'register') {
            dispatch(navigateTo('login'));
        } else {
            dispatch(navigateTo('reset-password'));
        }
    };

    const onResend = () => {
        console.log("Resend OTP");
        // Implement resend logic here if needed
    };

    const onBack = () => {
        if (otpContext === 'register') {
            dispatch(navigateTo('register'));
        } else if (otpContext === 'profile-change-password') {
            dispatch(setHomeActiveTab('profile'));
            dispatch(navigateTo('home'));
        } else {
            dispatch(navigateTo('forgot-password'));
        }
    };
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
    const [otpError, setOtpError] = useState('');
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        if (!/^[0-9]*$/.test(text)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (otpError) setOtpError('');

        // Auto focus next
        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
        // Auto focus prev if delete
        if (!text && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        if (otp.some(digit => digit === '')) {
            setOtpError('Vui lòng nhập đủ mã xác minh 6 số');
            return;
        }
        setOtpError('');

        if (otpContext === 'forgot-password' || otpContext === 'profile-change-password') {
            try {
                setLoading(true);
                const otpString = otp.join('');
                await checkOtp(resetEmail || '', otpString);
                dispatch(setResetOtp(otpString));
                onVerify();
            } catch (error: any) {
                setOtpError(error.message || 'Mã OTP không đúng hoặc đã hết hạn');
            } finally {
                setLoading(false);
            }
        } else {
            // Register flow logic (if needed in future, currently just mock)
            onVerify();
        }
    };

    const title = "NHẬP MÃ XÁC MINH";
    const subtitle = `Chúng tôi đã gửi mã 6 số tới ${resetEmail || 'email của bạn'}`;

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
                        {onBack && (
                            <TouchableOpacity onPress={onBack}>
                                <Ionicons name="chevron-back" size={28} color="#000" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.logoText}>
                        Quick<Text style={styles.logoHighlight}>Swap</Text>
                    </Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                                textAlign="center"
                            />
                        ))}
                    </View>
                    {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'ĐANG KIỂM TRA...' : 'XÁC NHẬN'}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>KHÔNG NHẬN ĐƯỢC MÃ? </Text>
                        <TouchableOpacity onPress={onResend}>
                            <Text style={styles.linkText}>GỬI LẠI MÃ</Text>
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
    // OTP Specific Styles
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 40,
        marginTop: 20,
    },

    otpInput: {
        width: 45,
        height: 55,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        fontSize: 20,
        fontWeight: 'bold',
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
        marginBottom: 20,
        textAlign: 'center',
    }
});
