package com.greenmind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entité User - Représente un utilisateur dans la base de données
 * ============================================================================
 * Cette classe définit la structure de la table "users" en base de données.
 * Chaque instance représente un utilisateur de l'application GreenMind.
 * 
 * Annotations utilisées:
 * - @Entity: Indique que c'est une entité JPA (table en base de données)
 * - @Table: Spécifie le nom de la table
 * - @Data: Lombok génère automatiquement getters, setters, toString, etc.
 * ============================================================================
 */
@Entity
@Table(name = "users")
@Data
public class User {
    
    // ========== IDENTIFIANT ==========
    
    /**
     * ID unique de l'utilisateur (clé primaire)
     * Généré automatiquement par la base de données
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========== INFORMATIONS PERSONNELLES ==========
    
    /**
     * Nom complet de l'utilisateur
     * Obligatoire (nullable = false)
     */
    @Column(nullable = false)
    private String name;
    
    /**
     * Email de l'utilisateur
     * Doit être unique et obligatoire
     */
    @Column(unique = true, nullable = false)
    private String email;
    
    // ========== GAMIFICATION ==========
    
    /**
     * Points accumulés par l'utilisateur
     * Utilisés pour calculer le niveau (niveau = points / 100)
     * Valeur par défaut: 0
     */
    @Column(nullable = false)
    private Integer points = 0;
    
    /**
     * Niveau de l'utilisateur
     * Calculé automatiquement: niveau = points / 100
     * Valeur par défaut: 0
     */
    @Column(nullable = false)
    private Integer level = 0;
    
    /**
     * Quantité de CO2 réduite par l'utilisateur (en kg)
     * Augmente quand l'utilisateur complète des missions/quiz
     * Valeur par défaut: 0.0
     */
    @Column(nullable = false)
    private Double co2Reduced = 0.0;
    
    /**
     * Nombre de jours consécutifs d'activité
     * Réinitialisé si l'utilisateur ne se connecte pas pendant 24h
     * Valeur par défaut: 0
     */
    @Column(nullable = false)
    private Integer currentStreak = 0;
    
    // ========== MÉTADONNÉES ==========
    
    /**
     * Date et heure de création du compte
     * Défini automatiquement à la création
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
