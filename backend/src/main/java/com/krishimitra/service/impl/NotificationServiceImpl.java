package com.krishimitra.service.impl;

import com.krishimitra.entity.Notification;
import com.krishimitra.entity.User;
import com.krishimitra.exception.ResourceNotFoundException;
import com.krishimitra.repository.NotificationRepository;
import com.krishimitra.repository.UserRepository;
import com.krishimitra.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getMyNotifications(String userEmail) {
        User user = getUser(userEmail);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    @Transactional
    public void markRead(Long notifId, String userEmail) {
        User user = getUser(userEmail);
        notificationRepository.markReadByIdAndUser(notifId, user);
    }

    @Override
    @Transactional
    public void markAllRead(String userEmail) {
        User user = getUser(userEmail);
        notificationRepository.markAllReadByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = getUser(userEmail);
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
