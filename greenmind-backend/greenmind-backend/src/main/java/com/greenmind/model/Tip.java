package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Tip entity created by admin
 */
@Entity
@Table(name = "tips")
@Data
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotBlank
    @Column(nullable = false, length = 1500)
    private String description;

    @Min(0)
    @Column(nullable = false)
    private Integer likes = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "tip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TipLike> tipLikes = new ArrayList<>();
}