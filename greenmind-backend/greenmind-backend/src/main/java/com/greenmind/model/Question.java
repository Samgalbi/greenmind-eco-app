package com.greenmind.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Question entity belonging to a quiz
 */
@Entity
@Table(name = "questions")
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String content;

    @ElementCollection
    @CollectionTable(name = "question_responses", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "response", nullable = false, length = 500)
    private List<String> responses = new ArrayList<>();

    @NotBlank
    @Column(nullable = false, length = 500)
    private String correctResponse;
}