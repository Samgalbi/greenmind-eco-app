# Explication Détaillée des Composants

## 📝 Missions.tsx - Missions Écologiques

### Concept Principal
Gère les missions quotidiennes/hebdomadaires que l'utilisateur peut accomplir.

### États Importants
```typescript
const [missions, setMissions] = useState(missionsData);
const [filter, setFilter] = useState<string>('all');
```
- `missions`: Liste des missions avec leur progression
- `filter`: Catégorie sélectionnée (all, Eau, Déchets, etc.)

### Logique Clé: Mise à Jour de Progression
```typescript
setMissions(missions.map(mission => {
  if (mission.id === missionId && mission.progress < mission.total) {
    const newProgress = mission.progress + 1;
    
    // Si mission complétée
    if (newProgress === mission.total) {
      onComplete(mission.points, mission.co2Impact);
      toast.success(`Mission accomplie ! +${mission.points} points`);
    }
    
    return { ...mission, progress: newProgress };
  }
  return mission;
}));
```

**Explication:**
1. `map()` parcourt toutes les missions
2. Trouve la mission à mettre à jour
3. Incrémente la progression
4. Si complétée (progress === total), appelle onComplete
5. Retourne un nouveau tableau (immutabilité)

### Filtrage par Catégorie
```typescript
const filteredMissions = filter === 'all' 
  ? missions 
  : missions.filter(m => m.category === filter);
```
- Si "all": affiche toutes les missions
- Sinon: filtre par catégorie sélectionnée

### Calcul de Statistiques
```typescript
const activeMissions = missions.filter(m => m.progress > 0 && m.progress < m.total);
const completedMissions = missions.filter(m => m.progress === m.total);
```
- `activeMissions`: missions en cours (commencées mais pas finies)
- `completedMissions`: missions terminées

---

## 💡 EcoTips.tsx - Astuces Écologiques

### Concept Principal
Affiche des conseils écologiques avec recherche et filtres.

### États Importants
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('all');
const [likedTips, setLikedTips] = useState<Set<number>>(new Set());
```
- `searchTerm`: Texte de recherche
- `selectedCategory`: Catégorie filtrée
- `likedTips`: Set des IDs des astuces likées

### Recherche en Temps Réel
```typescript
const filteredTips = tipsData.filter(tip => {
  const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
  return matchesSearch && matchesCategory;
});
```

**Explication:**
1. `toLowerCase()`: Ignore majuscules/minuscules
2. `includes()`: Vérifie si le titre contient le terme recherché
3. Combine recherche ET catégorie
4. Résultat mis à jour instantanément à chaque frappe

### Gestion des Likes avec Set
```typescript
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

**Pourquoi un Set?**
- Garantit l'unicité (pas de doublons)
- Méthodes pratiques: `has()`, `add()`, `delete()`
- Plus performant que Array pour vérifier l'existence

### Affichage du Nombre de Likes
```typescript
<span>{tip.likes + (isLiked ? 1 : 0)} personnes trouvent cela utile</span>
```
- `tip.likes`: Likes de base
- `+ (isLiked ? 1 : 0)`: Ajoute 1 si l'utilisateur a liké

---

## 👤 UserProfile.tsx - Profil Utilisateur

### Concept Principal
Affiche les informations, badges et activités de l'utilisateur.

### Calculs de Progression
```typescript
const userLevel = Math.floor(userPoints / 100);
const nextLevelPoints = (userLevel + 1) * 100;
const progressToNextLevel = ((userPoints % 100) / 100) * 100;
```

**Exemple avec 450 points:**
- `userLevel = Math.floor(450 / 100) = 4`
- `nextLevelPoints = (4 + 1) * 100 = 500`
- `progressToNextLevel = ((450 % 100) / 100) * 100 = 50%`

### Séparation des Badges
```typescript
const unlockedBadges = allBadges.filter(b => b.unlocked);
const lockedBadges = allBadges.filter(b => !b.unlocked);
```
- Permet un affichage différent pour chaque groupe
- Badges débloqués: en couleur
- Badges verrouillés: en gris (grayscale)

### Affichage Conditionnel
```typescript
{badge.date && (
  <p className="text-xs text-gray-500">
    <Calendar className="w-3 h-3" />
    {badge.date}
  </p>
)}
```
- `&&`: Opérateur logique ET
- N'affiche la date que si elle existe
- Évite les erreurs si `badge.date` est null

---

## 🎨 Composants UI Réutilisables

### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```
- Structure standard pour les cartes
- Réutilisable partout dans l'app

### Button
```typescript
<Button 
  onClick={handleClick}
  disabled={isDisabled}
  className="w-full bg-green-600"
>
  Texte du bouton
</Button>
```
- Gère automatiquement les états (hover, disabled)
- Styles cohérents dans toute l'app

### Progress
```typescript
<Progress value={75} className="h-2" />
```
- Barre de progression
- `value`: pourcentage (0-100)

### Badge
```typescript
<Badge variant="outline" className="border-green-300">
  Facile
</Badge>
```
- Petite étiquette pour catégories, difficultés, etc.

---

## 🔄 Patterns React Communs

### 1. Lift State Up (Remonter l'État)
```
App.tsx (état: userPoints)
    ↓ props
Dashboard.tsx (affiche userPoints)
Quizzes.tsx (modifie via onComplete)
    ↓ callback
App.tsx (met à jour userPoints)
```

**Pourquoi?**
- Partager l'état entre plusieurs composants
- Source unique de vérité

### 2. Controlled Components (Composants Contrôlés)
```typescript
<input 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```
- React contrôle la valeur de l'input
- Permet de valider, formater, etc.

### 3. Conditional Rendering (Rendu Conditionnel)
```typescript
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage />}
{items.length > 0 && <List items={items} />}
```
- Affiche différents composants selon les conditions
- `?:` pour if/else
- `&&` pour if simple

### 4. List Rendering (Rendu de Listes)
```typescript
{items.map((item) => (
  <div key={item.id}>
    {item.name}
  </div>
))}
```
- `map()` pour transformer un tableau en composants
- `key` obligatoire pour identifier chaque élément

---

## 🎯 Bonnes Pratiques Utilisées

### 1. Immutabilité
```typescript
// ❌ Mauvais: Modifie directement
missions[0].progress = 5;

// ✅ Bon: Crée un nouveau tableau
setMissions(missions.map(m => 
  m.id === 1 ? { ...m, progress: 5 } : m
));
```

### 2. Nommage Clair
```typescript
// ❌ Mauvais
const [x, setX] = useState(0);

// ✅ Bon
const [currentQuestion, setCurrentQuestion] = useState(0);
```

### 3. Séparation des Responsabilités
- Chaque composant a un rôle précis
- Logique métier séparée de l'affichage
- Composants UI réutilisables

### 4. TypeScript
```typescript
interface QuizzesProps {
  onComplete: (points: number, co2: number) => void;
}
```
- Types explicites
- Autocomplétion dans l'IDE
- Détection d'erreurs avant l'exécution

---

## 💡 Concepts Avancés

### 1. Spread Operator (...)
```typescript
const newMission = { ...mission, progress: 5 };
```
- Copie toutes les propriétés
- Remplace celles spécifiées
- Crée un nouvel objet

### 2. Array Methods
```typescript
// filter: garde les éléments qui correspondent
const active = missions.filter(m => m.progress > 0);

// map: transforme chaque élément
const names = missions.map(m => m.title);

// find: trouve le premier élément qui correspond
const mission = missions.find(m => m.id === 1);
```

### 3. Optional Chaining (?.)
```typescript
const date = badge?.date;  // undefined si badge est null
```

### 4. Nullish Coalescing (??)
```typescript
const value = userInput ?? 'default';  // 'default' si userInput est null/undefined
```

---

## 🚀 Pour Aller Plus Loin

### Optimisations Possibles
1. **useMemo**: Mémoriser les calculs coûteux
2. **useCallback**: Mémoriser les fonctions
3. **React.memo**: Éviter les re-rendus inutiles
4. **Lazy Loading**: Charger les composants à la demande

### Tests
1. **Jest**: Tests unitaires
2. **React Testing Library**: Tests de composants
3. **Cypress**: Tests end-to-end

### État Global
1. **Context API**: Partager l'état sans props drilling
2. **Redux**: Gestion d'état complexe
3. **Zustand**: Alternative légère à Redux

---

## 📚 Ressources

- **React Docs**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com
- **Recharts**: https://recharts.org/en-US
