package com.greenmind.service;

public interface MailService {
    void sendVerificationEmail(String to, String code);
}
