package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Regular user entity with gamification features
 */
@Entity
@DiscriminatorValue("REGULAR_USER")
@Data
@EqualsAndHashCode(callSuper = true)
public class RegularUser extends User {
    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(length = 6)
    private String otp;

    // Gamification fields
    @Column(nullable = false)
    private Integer points = 0;

    @Column(nullable = false)
    private Integer level = 0;

    @Column(nullable = false)
    private Double co2Reduced = 0.0;

    @Column(nullable = false)
    private Integer currentStreak = 0;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserMission> userMissions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAttempt> quizAttempts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TipLike> tipLikes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_badges",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    private List<Badge> badges = new ArrayList<>();
}