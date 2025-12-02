package com.greenmind.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SimpleMailService implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUser;

    @Value("${spring.mail.password:}")
    private String mailPass;

    @Override
    public void sendVerificationEmail(String to, String code) {
        if (mailUser == null || mailUser.isBlank() || mailPass == null || mailPass.isBlank()) {
            log.info("Simulating verification email to {} with code {} (no SMTP credentials set)", to, code);
            log.info("Ethereal inbox: https://ethereal.email/login (user: {}, pass: {})", mailUser, mailPass);
            log.info("Set ETHEREAL_USER and ETHEREAL_PASS to send real messages.");
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Your GreenMind verification code");
            helper.setText("Your verification code is: " + code, false);
            mailSender.send(message);
            log.info("Sent verification code to {}", to);
            log.info("Ethereal inbox: https://ethereal.email/login");
            log.info("Ethereal credentials -> user: {}, pass: {}", mailUser, mailPass);
        } catch (Exception ex) {
            // Keep dev experience smooth even if SMTP not configured
            log.error("Failed to send verification email to {}: {}", to, ex.getMessage());
        }
    }
}
