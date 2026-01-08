import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View , ActivityIndicator} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
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

import AsyncStorage from '@react-native-async-storage/async-storage';

/* =======================
   App
======================= */

import { useSelector } from 'react-redux';
import { RootState } from './src/store';
import { navigateTo, selectPost } from './src/store/reducer/navigationSlice';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://a17f8771274c12695b323c33331a3eeb@o4510670371553280.ingest.us.sentry.io/4510670372667392',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  tracesSampleRate: 1.0, // Ghi lại 100% các giao dịch hiệu suất (giảm xuống 0.1 khi prod)
  _experiments: {
    profilesSampleRate: 1.0, // Theo dõi mức độ sử dụng CPU
  },
  
  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

/* =======================
  MainContent
======================= */

function MainContent() {
  const dispatch = useDispatch();
  const currentScreen = useSelector((state: RootState) => state.navigation.currentScreen);
  const selectedPost = useSelector((state: RootState) => state.navigation.selectedPost);

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        const token = await AsyncStorage.getItem('userToken'); // Tuỳ chọn: Nếu bạn có lưu token để tự động login

        if (hasSeen === 'true') {
           // Nếu đã xem onboarding, chuyển sang login (hoặc home nếu đã có logic auto-login khác)
           dispatch(navigateTo('login'));
        } 
        // Nếu chưa xem (hasSeen là null), Redux state mặc định đã là 'onboarding' nên không cần làm gì
        
      } catch (error) {
        console.log('Lỗi kiểm tra onboarding:', error);
      } finally {
        // Kết thúc quá trình kiểm tra
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, [dispatch]);

  const handlePostClick = (post: any) => {
    dispatch(selectPost(post));
    dispatch(navigateTo('post-detail'));
  };

  const handleNotificationClick = () => {
    dispatch(navigateTo('notification'));
  };

  if (isLoading) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size="large" color="#60A5FA" />
          </View>
      );
  }


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

export default Sentry.wrap(function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainContent />
      </SafeAreaProvider>
    </Provider>
  );
});

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
});