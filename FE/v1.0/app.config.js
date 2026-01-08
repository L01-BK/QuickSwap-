export default {
  expo: {
    name: "QuickSwap",
    slug: "QuickSwap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      // ĐÂY LÀ PHẦN QUAN TRỌNG ĐÃ ĐƯỢC SỬA:
      // Nó sẽ ưu tiên lấy từ biến bí mật trên EAS.
      // Nếu chạy ở máy local (không có biến) thì nó lấy file ./google-services.json
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.davincentius.QuickSwap"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "nguyen-gia-thinh"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "473eda0f-0c77-4158-9b2a-cc494b6903d7"
      }
    }
  }
};