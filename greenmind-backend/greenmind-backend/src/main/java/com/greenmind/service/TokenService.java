package com.greenmind.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final Map<String, Long> tokens = new ConcurrentHashMap<>();

    public String generateToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, userId);
        return token;
    }

    public Optional<Long> validate(String token) {
        return Optional.ofNullable(tokens.get(token));
    }

    public void revoke(String token) {
        tokens.remove(token);
    }
}
