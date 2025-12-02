package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Join table tracking user progress on missions
 */
@Entity
@Table(name = "user_missions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "mission_id"}))
@Data
public class UserMission {

    public enum Status {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private RegularUser user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.NOT_STARTED;

    @Min(0)
    @Column(nullable = false)
    private Integer progress = 0;

    @Column(nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;
}