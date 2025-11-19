# Guide du Code Frontend - GreenMind

## 📁 Structure des Fichiers

```
src/
├── App.tsx                    # Composant principal (navigation, état global)
├── main.tsx                   # Point d'entrée de l'application
├── index.css                  # Styles globaux (Tailwind)
├── components/
│   ├── Dashboard.tsx          # Tableau de bord
│   ├── Quizzes.tsx           # Système de quiz
│   ├── Missions.tsx          # Missions écologiques
│   ├── EcoTips.tsx           # Astuces écologiques
│   ├── UserProfile.tsx       # Profil utilisateur
│   └── ui/                   # Composants UI réutilisables
├── services/
│   └── api.ts                # Appels API vers le backend
└── hooks/
    └── useApi.ts             # Hook personnalisé pour les requêtes
```

---

## 🎯 App.tsx - Composant Principal

### Rôle
- Point central de l'application
- Gère la navigation entre les sections
- Maintient l'état global (points, CO₂)
- Distribue les données aux composants enfants

### Concepts Clés

#### 1. useState - Gestion de l'État
```typescript
const [activeTab, setActiveTab] = useState('dashboard');
```
**Explication:**
- `useState` est un Hook React pour gérer l'état
- `activeTab`: valeur actuelle
- `setActiveTab`: fonction pour modifier la valeur
- `'dashboard'`: valeur initiale

#### 2. Props - Passage de Données
```typescript
<Dashboard 
  userPoints={userPoints} 
  globalCO2Reduced={globalCO2Reduced}
/>
```
**Explication:**
- Les props sont des données passées du parent aux enfants
- Comme des paramètres de fonction
- Permet la communication parent → enfant

#### 3. Callbacks - Communication Enfant → Parent
```typescript
<Quizzes 
  onComplete={(points, co2) => {
    addPoints(points);
    addCO2Reduction(co2);
  }}
/>
```
**Explication:**
- Le parent passe une fonction au composant enfant
- L'enfant appelle cette fonction pour informer le parent
- Permet la communication enfant → parent

---

## 📊 Dashboard.tsx - Tableau de Bord

### Concepts Importants

#### 1. Calculs Dérivés
```typescript
const userLevel = Math.floor(userPoints / 100);
const progressToNextLevel = ((userPoints % 100) / 100) * 100;
```
**Explication:**
- `Math.floor()`: arrondit vers le bas (450 / 100 = 4)
- `%` (modulo): reste de la division (450 % 100 = 50)
- Ces valeurs sont recalculées automatiquement quand `userPoints` change

#### 2. Map - Itération sur des Tableaux
```typescript
{stats.map((stat) => {
  const Icon = stat.icon;
  return (
    <div key={stat.label}>
      <Icon className={stat.color} />
      <p>{stat.value}</p>
    </div>
  );
})}
```
**Explication:**
- `map()` parcourt chaque élément du tableau
- Retourne un composant JSX pour chaque élément
- `key` est obligatoire pour identifier chaque élément

#### 3. Graphiques avec Recharts
```typescript
<BarChart data={weeklyData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Bar dataKey="points" fill="#10b981" />
</BarChart>
```
**Explication:**
- `data`: tableau de données à afficher
- `dataKey`: quelle propriété afficher
- `fill`: couleur des barres

---

## 🎮 Quizzes.tsx - Système de Quiz

### Logique du Quiz

#### 1. États Multiples
```typescript
const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
const [score, setScore] = useState(0);
```
**Explication:**
- `selectedQuiz`: quel quiz est actif (null = aucun)
- `currentQuestion`: index de la question actuelle (0, 1, 2...)
- `selectedAnswer`: réponse choisie par l'utilisateur
- `score`: nombre de bonnes réponses

#### 2. Logique de Validation
```typescript
const isCorrect = selectedAnswer === quiz.questions[currentQuestion].correct;
if (isCorrect) {
  setScore(score + 1);
}
```
**Explication:**
- Compare la réponse sélectionnée avec la bonne réponse
- Si correct, incrémente le score
- Stocke le résultat pour l'affichage final

#### 3. Navigation entre Questions
```typescript
if (currentQuestion < quiz.questions.length - 1) {
  // Passer à la question suivante
  setCurrentQuestion(currentQuestion + 1);
} else {
  // Afficher les résultats
  setShowResult(true);
}
```
**Explication:**
- Vérifie s'il reste des questions
- Si oui: passe à la suivante
- Si non: affiche l'écran de résultats

#### 4. Calcul du Résultat
```typescript
const percentage = (score / quiz.questions.length) * 100;
const passed = percentage >= 66;
```
**Explication:**
- Calcule le pourcentage de bonnes réponses
- Quiz réussi si ≥ 66% (2/3 des questions)
- Détermine si l'utilisateur gagne des points

---

## 🎯 Missions.tsx - Missions Écologiques

### Concepts Clés

#### 1. Mise à Jour d'État Complexe
```typescript
setMissions(missions.map(mission => {
  if (mission.id === missionId && mission.progress < mission.total) {
    const newProgress = mission.progress + 1;
    return { ...mission, progress: newProgress };
  }
  return mission;
}));
```
**Explication:**
- `map()` crée un nouveau tableau
- Trouve la mission à mettre à jour
- `...mission`: copie toutes les propriétés
- Modifie uniquement `progress`
- Retourne le nouveau tableau

#### 2. Spread Operator (...)
```typescript
return { ...mission, progress: newProgress };
```
**Explication:**
- `...mission`: copie toutes les propriétés de l'objet
- `progress: newProgress`: remplace la propriété progress
- Crée un nouvel objet (immutabilité)

#### 3. Filtrage de Données
```typescript
const filteredMissions = filter === 'all' 
  ? missions 
  : missions.filter(m => m.category === filter);
```
**Explication:**
- Opérateur ternaire: `condition ? siVrai : siFaux`
- `filter()`: garde seulement les éléments qui correspondent
- Permet d'afficher toutes les missions ou par catégorie

---

## 💡 EcoTips.tsx - Astuces Écologiques

### Fonctionnalités

#### 1. Recherche en Temps Réel
```typescript
const filteredTips = tipsData.filter(tip => {
  const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
  return matchesSearch && matchesCategory;
});
```
**Explication:**
- `toLowerCase()`: ignore la casse (majuscules/minuscules)
- `includes()`: vérifie si le texte contient la recherche
- Combine recherche ET catégorie
- Résultat mis à jour instantanément

#### 2. Gestion des Likes avec Set
```typescript
const [likedTips, setLikedTips] = useState<Set<number>>(new Set());

const handleLike = (tipId: number) => {
  setLikedTips(prev => {
    const newSet = new Set(prev);
    if (newSet.has(tipId)) {
      newSet.delete(tipId);  // Unlike
    } else {
      newSet.add(tipId);     // Like
    }
    return newSet;
  });
};
```
**Explication:**
- `Set`: collection d'éléments uniques
- `has()`: vérifie si l'élément existe
- `add()`: ajoute un élément
- `delete()`: retire un élément
- Permet de toggle (activer/désactiver) les likes

---

## 👤 UserProfile.tsx - Profil Utilisateur

### Affichage des Données

#### 1. Filtrage de Badges
```typescript
const unlockedBadges = allBadges.filter(b => b.unlocked);
const lockedBadges = allBadges.filter(b => !b.unlocked);
```
**Explication:**
- Sépare les badges en deux groupes
- `b.unlocked`: badges débloqués
- `!b.unlocked`: badges verrouillés
- Permet un affichage différent pour chaque groupe

#### 2. Affichage Conditionnel
```typescript
{badge.date && (
  <p className="text-xs text-gray-500">
    <Calendar className="w-3 h-3" />
    {badge.date}
  </p>
)}
```
**Explication:**
- `&&`: opérateur logique ET
- Si `badge.date` existe, affiche le paragraphe
- Si `badge.date` est null/undefined, n'affiche rien
- Évite les erreurs d'affichage

---

## 🔧 Concepts React Importants

### 1. Composants Fonctionnels
```typescript
export function Dashboard({ userPoints }: DashboardProps) {
  return <div>...</div>;
}
```
**Explication:**
- Fonction qui retourne du JSX
- Reçoit des props en paramètre
- Peut utiliser des Hooks (useState, useEffect, etc.)

### 2. JSX - JavaScript + XML
```typescript
<div className="text-green-600">
  {userPoints} points
</div>
```
**Explication:**
- Syntaxe qui ressemble à HTML
- `{}`: pour insérer du JavaScript
- `className` au lieu de `class`
- Compilé en JavaScript par Vite

### 3. Événements
```typescript
<button onClick={() => setActiveTab('dashboard')}>
  Dashboard
</button>
```
**Explication:**
- `onClick`: événement de clic
- `() => ...`: fonction fléchée (arrow function)
- Exécutée quand l'utilisateur clique

### 4. Rendu Conditionnel
```typescript
{activeTab === 'dashboard' && <Dashboard />}
{activeTab === 'quizzes' && <Quizzes />}
```
**Explication:**
- Affiche le composant seulement si la condition est vraie
- Un seul composant visible à la fois
- Permet la navigation entre sections

---

## 🎨 Tailwind CSS

### Classes Utilitaires
```typescript
className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
```
**Explication:**
- `bg-green-600`: fond vert
- `text-white`: texte blanc
- `p-4`: padding de 1rem (16px)
- `rounded-lg`: coins arrondis
- `hover:bg-green-700`: fond plus foncé au survol

### Responsive Design
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```
**Explication:**
- `grid-cols-1`: 1 colonne par défaut (mobile)
- `md:grid-cols-2`: 2 colonnes sur tablette
- `lg:grid-cols-4`: 4 colonnes sur desktop
- S'adapte automatiquement à la taille d'écran

---

## 🔄 Flux de Données

### Parent → Enfant (Props)
```
App.tsx (userPoints: 450)
    ↓ props
Dashboard.tsx (reçoit userPoints)
    ↓ affiche
"450 points"
```

### Enfant → Parent (Callbacks)
```
Quizzes.tsx (quiz terminé)
    ↓ appelle onComplete(50, 5)
App.tsx (reçoit les valeurs)
    ↓ met à jour
userPoints: 450 → 500
globalCO2: 12547 → 12552
```

---

## 💡 Bonnes Pratiques Utilisées

1. **Composants Réutilisables**: ui/button, ui/card, etc.
2. **Séparation des Responsabilités**: Chaque composant a un rôle précis
3. **TypeScript**: Types pour éviter les erreurs
4. **Immutabilité**: Ne jamais modifier directement l'état
5. **Keys dans les Listes**: Pour optimiser le rendu
6. **Nommage Clair**: Noms de variables explicites

---

## 🚀 Pour Aller Plus Loin

### Prochaines Étapes
1. Connecter au vrai backend (API)
2. Ajouter l'authentification
3. Sauvegarder les données en base
4. Ajouter des tests
5. Optimiser les performances

### Ressources
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Recharts: https://recharts.org
