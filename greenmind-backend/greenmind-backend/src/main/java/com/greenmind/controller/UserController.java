package com.greenmind.controller;

import com.greenmind.model.User;
import com.greenmind.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ============================================================================
 * UserController - Contrôleur REST pour la gestion des utilisateurs
 * ============================================================================
 * Ce contrôleur expose les endpoints de l'API pour gérer les utilisateurs.
 * Il fait le lien entre les requêtes HTTP et la logique métier (UserService).
 * 
 * Annotations:
 * - @RestController: Indique que c'est un contrôleur REST (retourne du JSON)
 * - @RequestMapping: Définit le préfixe de tous les endpoints (/api/users)
 * - @RequiredArgsConstructor: Lombok génère le constructeur avec injection
 * ============================================================================
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    // Injection du service utilisateur (logique métier)
    private final UserService userService;
    
    // ========== ENDPOINTS DE LECTURE ==========
    
    /**
     * GET /api/users
     * Récupère la liste de tous les utilisateurs
     * 
     * @return Liste de tous les utilisateurs en base de données
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    /**
     * GET /api/users/{id}
     * Récupère un utilisateur spécifique par son ID
     * 
     * @param id - ID de l'utilisateur à récupérer
     * @return L'utilisateur correspondant ou erreur 404 si non trouvé
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    
    // ========== ENDPOINTS DE CRÉATION ==========
    
    /**
     * POST /api/users
     * Crée un nouvel utilisateur
     * 
     * @param user - Données de l'utilisateur à créer (JSON dans le body)
     * @return L'utilisateur créé avec son ID généré
     * 
     * Exemple de body:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com"
     * }
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }
    
    // ========== ENDPOINTS DE MISE À JOUR ==========
    
    /**
     * PUT /api/users/{id}/points
     * Ajoute des points à un utilisateur
     * Le niveau est recalculé automatiquement (niveau = points / 100)
     * 
     * @param id - ID de l'utilisateur
     * @param request - Map contenant les points à ajouter
     * @return L'utilisateur mis à jour
     * 
     * Exemple de body:
     * {
     *   "points": 50
     * }
     */
    @PutMapping("/{id}/points")
    public ResponseEntity<User> updatePoints(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer points = request.get("points");
        return ResponseEntity.ok(userService.updateUserPoints(id, points));
    }
    
    /**
     * PUT /api/users/{id}/co2
     * Ajoute une réduction de CO2 à un utilisateur
     * 
     * @param id - ID de l'utilisateur
     * @param request - Map contenant le CO2 à ajouter (en kg)
     * @return L'utilisateur mis à jour
     * 
     * Exemple de body:
     * {
     *   "co2": 15.5
     * }
     */
    @PutMapping("/{id}/co2")
    public ResponseEntity<User> updateCO2(
            @PathVariable Long id,
            @RequestBody Map<String, Double> request) {
        Double co2 = request.get("co2");
        return ResponseEntity.ok(userService.updateUserCO2(id, co2));
    }
    
    // ========== ENDPOINT DE TEST ==========
    
    /**
     * GET /api/users/test
     * Endpoint simple pour vérifier que le backend fonctionne
     * 
     * @return Message de confirmation
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working! 🚀");
    }
}
