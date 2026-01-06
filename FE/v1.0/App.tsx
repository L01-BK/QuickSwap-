import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Provider } from 'react-redux';
import { store } from './src/store';

import Onboarding from './src/components/Onboarding';
import Login from './src/components/Login';
import Register from './src/components/Register';
import OTP from './src/components/OTP';
import ForgotPassword from './src/components/ForgotPassword';
import ResetPassword from './src/components/ResetPassword';
import MyAccount from './src/components/MyAccount';

import Home from './src/components/Home';
import PostDetail, { Post } from './src/components/PostDetail';
import Profile from './src/components/Profile';


/* =======================
   App
======================= */

import { useSelector } from 'react-redux';
import { RootState } from './src/store';

/* =======================
  MainContent
======================= */

function MainContent() {
  const { currentScreen, otpContext, selectedPost, homeActiveTab } = useSelector((state: RootState) => state.navigation);

  const renderScreen = () => {
    switch (currentScreen) {

      /* ---------- Onboarding ---------- */
      case 'onboarding':
        return <Onboarding />;

      /* ---------- Login ---------- */
      case 'login':
        return <Login />;

      /* ---------- Register ---------- */
      case 'register':
        return <Register />;

      /* ---------- Forgot Password ---------- */
      case 'forgot-password':
        return <ForgotPassword />;

      /* ---------- OTP ---------- */
      case 'otp':
        return <OTP />;

      /* ---------- Reset Password ---------- */
      case 'reset-password':
        return <ResetPassword />;

      /* ---------- Home ---------- */
      case 'home':
        return <Home />;

      /* ---------- Post Detail ---------- */
      case 'post-detail':
        return <PostDetail />;

      /* ---------- My Account ---------- */
      case 'my-account':
        return <MyAccount />;

      case 'profile':
        return <Profile />;

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
   App
======================= */

export default function App() {
  return (
    <Provider store={store}>
      <MainContent />
    </Provider>
  );
}

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Root background will be controlled by components now or global theme listener
  },
});
