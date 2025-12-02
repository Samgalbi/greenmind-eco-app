package com.greenmind.service;

import com.greenmind.dto.RegisterRequest;
import com.greenmind.exception.BadRequestException;
import com.greenmind.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void register_withInvalidEmail_shouldThrow() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John");
        request.setEmail("invalid-email");
        request.setPassword("Password1");

        assertThrows(BadRequestException.class, () -> authService.registerRegularUser(request));
    }

    @Test
    void register_withWeakPassword_shouldThrow() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Jane");
        request.setEmail("jane@example.com");
        request.setPassword("short");

        assertThrows(BadRequestException.class, () -> authService.registerRegularUser(request));
    }

    @Test
    void register_duplicateEmail_shouldThrow() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Sam");
        request.setEmail("sam@example.com");
        request.setPassword("Password1");

        authService.registerRegularUser(request);
        assertThrows(BadRequestException.class, () -> authService.registerRegularUser(request));
    }
}
