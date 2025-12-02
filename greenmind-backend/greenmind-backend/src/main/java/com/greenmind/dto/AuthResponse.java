package com.greenmind.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private boolean emailVerified;
    private String message;
}
