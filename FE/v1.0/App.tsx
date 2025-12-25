import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Onboarding from './src/components/Onboarding';
import Login from './src/components/Login';
import Register from './src/components/Register';
import OTP from './src/components/OTP';
import ForgotPassword from './src/components/ForgotPassword';
import ResetPassword from './src/components/ResetPassword';

import Home from './src/components/Home';
import PostDetail, { Post } from './src/components/PostDetail';

/* =======================
   Types
======================= */

type Screen =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'otp'
  | 'forgot-password'
  | 'reset-password'
  | 'home'
  | 'post-detail';

type OtpContext = 'register' | 'forgot-password';

/* =======================
   App
======================= */

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [otpContext, setOtpContext] = useState<OtpContext>('register');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {

      /* ---------- Onboarding ---------- */
      case 'onboarding':
        return (
          <Onboarding
            onFinish={() => setCurrentScreen('login')}
            onLogin={() => setCurrentScreen('login')}
            onRegister={() => setCurrentScreen('register')}
          />
        );

      /* ---------- Login ---------- */
      case 'login':
        return (
          <Login
            onLogin={() => setCurrentScreen('home')}
            onRegister={() => setCurrentScreen('register')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
          />
        );

      /* ---------- Register ---------- */
      case 'register':
        return (
          <Register
            onRegister={() => {
              setOtpContext('register');
              setCurrentScreen('otp');
            }}
            onLogin={() => setCurrentScreen('login')}
          />
        );

      /* ---------- Forgot Password ---------- */
      case 'forgot-password':
        return (
          <ForgotPassword
            onNext={() => {
              setOtpContext('forgot-password');
              setCurrentScreen('otp');
            }}
            onCancel={() => setCurrentScreen('login')}
          />
        );

      /* ---------- OTP ---------- */
      case 'otp':
        return (
          <OTP
            onVerify={() => {
              if (otpContext === 'forgot-password') {
                setCurrentScreen('reset-password');
              } else {
                setCurrentScreen('login');
              }
            }}
            onResend={() => console.log('Resend OTP')}
            onBack={() => {
              if (otpContext === 'forgot-password') {
                setCurrentScreen('forgot-password');
              } else {
                setCurrentScreen('register');
              }
            }}
          />
        );

      /* ---------- Reset Password ---------- */
      case 'reset-password':
        return (
          <ResetPassword
            onFinish={() => setCurrentScreen('login')}
            onCancel={() => setCurrentScreen('login')}
          />
        );

      /* ---------- Home ---------- */
      case 'home':
        return (
          <Home
            onPostClick={(post) => {
              setSelectedPost(post);
              setCurrentScreen('post-detail');
            }}
          />
        );

      /* ---------- Post Detail ---------- */
      case 'post-detail':
        return (
          <PostDetail
            post={selectedPost}
            onBack={() => {
              setCurrentScreen('home');
              setSelectedPost(null);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="auto" />
    </View>
  );
}

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
