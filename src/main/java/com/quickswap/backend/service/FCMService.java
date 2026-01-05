package com.quickswap.backend.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FCMService {

    public void sendNotification(String token, String title, String body) {
        try {
            // Tạo thông báo
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            // Tạo message gửi đi
            Message message = Message.builder()
                    .setToken(token) // Token của máy người nhận
                    .setNotification(notification)
                    .putData("click_action", "FLUTTER_NOTIFICATION_CLICK") // Để Mobile xử lý khi bấm vào
                    .putData("screen", "RequestDetail") // Ví dụ: Bấm vào thì nhảy vào màn hình chi tiết
                    .build();

            // Gửi qua Firebase
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Đã gửi thông báo thành công: " + response);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Lỗi gửi thông báo: " + e.getMessage());
        }
    }
}