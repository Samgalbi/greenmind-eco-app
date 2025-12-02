package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Join table tracking user quiz attempts
 */
@Entity
@Table(name = "quiz_attempts")
@Data
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private RegularUser user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private Boolean passed = false;

    @Min(0)
    @Column(nullable = false)
    private Integer score = 0;

    @Min(0)
    @Column(nullable = false)
    private Integer earnedPoints = 0;

    @Min(0)
    @Column(nullable = false)
    private Double earnedCo2 = 0.0;

    @Column(nullable = false)
    private LocalDateTime attemptedAt = LocalDateTime.now();
}