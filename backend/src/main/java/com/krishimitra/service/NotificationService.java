package com.krishimitra.service;

import com.krishimitra.entity.Notification;
import java.util.List;

public interface NotificationService {
    List<Notification> getMyNotifications(String userEmail);
    void markRead(Long notifId, String userEmail);
    void markAllRead(String userEmail);
    long getUnreadCount(String userEmail);
}
