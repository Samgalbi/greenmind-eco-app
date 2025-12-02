package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Mission entity created by admin
 */
@Entity
@Table(name = "missions")
@Data
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer duration; // Number of days

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer points;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Double co2Impact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Min(0)
    @Column(nullable = false)
    private Integer progress = 0;

    @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserMission> userMissions = new ArrayList<>();
}