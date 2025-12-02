package com.greenmind.service;

import com.greenmind.dto.AuthRequest;
import com.greenmind.dto.AuthResponse;
import com.greenmind.dto.RegisterRequest;
import com.greenmind.dto.VerifyEmailRequest;
import com.greenmind.exception.BadRequestException;
import com.greenmind.exception.NotFoundException;
import com.greenmind.model.RegularUser;
import com.greenmind.model.User;
import com.greenmind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final TokenService tokenService;

    private static final String EMAIL_REGEX = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

    @Override
    @Transactional
    public AuthResponse registerRegularUser(RegisterRequest request) {
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());

        if (userRepository.existsByEmail(request.getEmail().toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("A user with this email already exists");
        }

        RegularUser user = new RegularUser();
        user.setEmail(request.getEmail().toLowerCase(Locale.ROOT));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setSurname(Optional.ofNullable(request.getSurname()).orElse(""));
        user.setAddress(Optional.ofNullable(request.getAddress()).orElse(""));
        user.setDateNaissance(LocalDate.now());
        user.setEmailVerified(false);
        user.setOtp(generateOtp());

        userRepository.save(user);
        mailService.sendVerificationEmail(user.getEmail(), user.getOtp());

        return AuthResponse.builder()
                .email(user.getEmail())
                .emailVerified(false)
                .message("Registration successful. Check your email for the verification code.")
                .build();
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());

        User user = userRepository.findByEmail(request.getEmail().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        if (user instanceof RegularUser regularUser && !regularUser.getEmailVerified()) {
            throw new BadRequestException("Email not verified");
        }

        String token = tokenService.generateToken(user.getId());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .emailVerified(true)
                .message("Login successful")
                .build();
    }

    @Override
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        validateEmail(request.getEmail());

        RegularUser user = userRepository.findByEmail(request.getEmail().toLowerCase(Locale.ROOT))
                .filter(RegularUser.class::isInstance)
                .map(RegularUser.class::cast)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getEmailVerified()) {
            return AuthResponse.builder()
                    .email(user.getEmail())
                    .emailVerified(true)
                    .message("Email already verified")
                    .token(tokenService.generateToken(user.getId()))
                    .build();
        }

        if (!request.getCode().equals(user.getOtp())) {
            throw new BadRequestException("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setOtp(null);
        userRepository.save(user);

        String token = tokenService.generateToken(user.getId());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .emailVerified(true)
                .message("Email verified")
                .build();
    }

    private void validateEmail(String email) {
        if (email == null || !email.matches(EMAIL_REGEX)) {
            throw new BadRequestException("Invalid email format");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long");
        }
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new BadRequestException("Password must contain letters and numbers");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
