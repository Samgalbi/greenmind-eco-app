package com.greenmind.service;

import com.greenmind.dto.AuthRequest;
import com.greenmind.dto.AuthResponse;
import com.greenmind.dto.RegisterRequest;
import com.greenmind.dto.VerifyEmailRequest;

public interface AuthService {
    AuthResponse registerRegularUser(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse verifyEmail(VerifyEmailRequest request);
}
