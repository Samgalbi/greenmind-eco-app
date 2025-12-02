package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Category entity for missions, quizzes, and tips
 */
@Entity
@Table(name = "categories")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Mission> missions = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    private List<Quiz> quizzes = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    private List<Tip> tips = new ArrayList<>();
}