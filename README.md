# GreenMind - Plateforme de Sensibilisation Écologique

Une application web gamifiée pour encourager les comportements écologiques à travers des quiz, missions et défis quotidiens.

## 🌱 À Propos

GreenMind est une plateforme interactive qui permet aux utilisateurs de :
- Participer à des quiz éducatifs sur l'écologie
- Accomplir des missions écologiques quotidiennes
- Suivre leur impact environnemental (réduction CO₂)
- Gagner des points et débloquer des badges
- Consulter des astuces écologiques pratiques

## 🚀 Technologies Utilisées

### Frontend
- React 18.3 avec TypeScript
- Vite 6.3.5
- Tailwind CSS v4
- Radix UI Components
- Recharts pour les graphiques
- Lucide React pour les icônes

### Backend
- Spring Boot 3.5.7
- Spring Security 6
- Spring Data JPA
- MySQL 8.4
- Lombok

## 📦 Installation

### Prérequis
- Node.js 18+
- Java 17+
- MySQL 8+ (ou XAMPP)
- Maven

### Frontend

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

L'application sera accessible sur `http://localhost:3000`

### Backend

```bash
# Naviguer vers le dossier backend
cd greenmind-backend/greenmind-backend

# Lancer l'application
./mvnw spring-boot:run
```

L'API sera accessible sur `http://localhost:8080`

### Base de Données

1. Créer une base de données MySQL :
```sql
CREATE DATABASE greenmind_db;
```

2. La configuration se trouve dans `application.properties`
3. Les tables seront créées automatiquement au démarrage

## 🎯 Fonctionnalités

### Dashboard
- Vue d'ensemble des statistiques utilisateur
- Compteur collectif de CO₂ réduit
- Graphiques de progression hebdomadaire
- Badges récents débloqués

### Quiz Écologiques
- Quiz sur différents thèmes (recyclage, énergie, alimentation)
- Système de points et récompenses
- Validation à 66% de bonnes réponses
- Impact CO₂ calculé

### Missions
- Défis quotidiens et hebdomadaires
- Catégories : Eau, Déchets, Transport, Énergie, Alimentation
- Suivi de progression
- Récompenses en points et réduction CO₂

### Astuces Écologiques
- Conseils pratiques classés par catégorie
- Estimation d'impact pour chaque astuce
- Système de likes
- Recherche et filtres

### Profil Utilisateur
- Système de niveaux (100 points = 1 niveau)
- Collection de badges
- Historique d'activité
- Statistiques personnelles

## 📡 API Endpoints

### Users
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détails utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}/points` - Mettre à jour les points
- `PUT /api/users/{id}/co2` - Mettre à jour le CO₂

### Quizzes
- `GET /api/quizzes` - Liste des quiz
- `GET /api/quizzes/{id}` - Détails d'un quiz
- `POST /api/quizzes/submit` - Soumettre un quiz

### Missions
- `GET /api/missions` - Liste des missions
- `PUT /api/missions/{id}/progress` - Mettre à jour la progression
- `POST /api/missions/{id}/complete` - Compléter une mission

### Tips
- `GET /api/tips` - Liste des astuces
- `POST /api/tips/{id}/like` - Liker une astuce

## 🔒 Sécurité

- Spring Security configuré
- Endpoints publics pour les tests
- BCrypt pour le hachage des mots de passe
- CORS configuré pour le frontend
- Sessions stateless (REST API)

## 🎨 Structure du Projet

```
greenmind/
├── src/                          # Frontend React
│   ├── components/              # Composants React
│   │   ├── Dashboard.tsx
│   │   ├── Quizzes.tsx
│   │   ├── Missions.tsx
│   │   ├── EcoTips.tsx
│   │   ├── UserProfile.tsx
│   │   └── ui/                  # Composants UI réutilisables
│   ├── services/                # Services API
│   │   └── api.ts
│   ├── hooks/                   # Custom React hooks
│   └── App.tsx                  # Composant principal
│
└── greenmind-backend/           # Backend Spring Boot
    └── src/main/java/com/greenmind/
        ├── config/              # Configuration
        ├── controller/          # REST Controllers
        ├── service/             # Logique métier
        ├── repository/          # Accès données
        └── model/               # Entités JPA
```

## 👥 Auteur

Projet développé dans le cadre d'un projet académique.

## 📄 Licence

Ce projet est à usage éducatif.
