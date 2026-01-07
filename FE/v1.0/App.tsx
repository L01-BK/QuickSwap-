import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';

import Onboarding from './src/components/Onboarding';
import Login from './src/components/Login';
import Register from './src/components/Register';
import OTP from './src/components/OTP';
import ForgotPassword from './src/components/ForgotPassword';
import ResetPassword from './src/components/ResetPassword';
import MyAccount from './src/components/MyAccount';

import Home from './src/components/Home';
import PostDetail from './src/components/PostDetail';
import { Post } from './src/types';
import Profile from './src/components/Profile';
import Notification from './src/components/Notification';
import HelpSupport from './src/components/HelpSupport';
import AboutApp from './src/components/AboutApp';


/* =======================
   App
======================= */

import { useSelector } from 'react-redux';
import { RootState } from './src/store';
import { navigateTo, selectPost } from './src/store/reducer/navigationSlice';

/* =======================
  MainContent
======================= */

function MainContent() {
  const dispatch = useDispatch();
  const { currentScreen, otpContext, selectedPost, homeActiveTab } = useSelector((state: RootState) => state.navigation);

  const handlePostClick = (post: any) => {
    dispatch(selectPost(post));
    dispatch(navigateTo('post-detail'));
  };

  const handleNotificationClick = () => {
    dispatch(navigateTo('notification'));
  };

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
        return (
          <Home
            onPostClick={handlePostClick}
            onNotificationClick={handleNotificationClick}
          />
        );

      /* ---------- Post Detail ---------- */
      case 'post-detail':
        return <PostDetail />;

      /* ---------- My Account ---------- */
      case 'my-account':
        return <MyAccount />;

      case 'profile':
        return <Profile />;

      case 'notification':
        return <Notification onBack={() => dispatch(navigateTo('home'))} />;

      case 'help-support':
        return <HelpSupport />;

      case 'about-app':
        return <AboutApp />;

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
    backgroundColor: '#fff', 
  },
});