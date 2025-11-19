package com.greenmind.service;

import com.greenmind.model.User;
import com.greenmind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public User updateUserPoints(Long id, Integer points) {
        User user = getUserById(id);
        user.setPoints(user.getPoints() + points);
        user.setLevel(user.getPoints() / 100);
        return userRepository.save(user);
    }
    
    public User updateUserCO2(Long id, Double co2) {
        User user = getUserById(id);
        user.setCo2Reduced(user.getCo2Reduced() + co2);
        return userRepository.save(user);
    }
}
