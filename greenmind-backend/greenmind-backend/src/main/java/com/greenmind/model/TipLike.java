package com.greenmind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Join table tracking user likes on tips
 */
@Entity
@Table(name = "tip_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "tip_id"}))
@Data
public class TipLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private RegularUser user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tip_id", nullable = false)
    private Tip tip;

    @Column(nullable = false)
    private LocalDateTime likedAt = LocalDateTime.now();
}