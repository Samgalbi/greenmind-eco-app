# Guide Complet des React Hooks

## 🎣 Qu'est-ce qu'un Hook?

**Définition Simple:**
Un Hook est une fonction spéciale qui permet d'utiliser les fonctionnalités de React (état, cycle de vie, etc.) dans des composants fonctionnels.

**Avant les Hooks (Classes):**
```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}
```

**Avec les Hooks (Fonctions):**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

**Avantages:**
- ✅ Code plus court et lisible
- ✅ Pas besoin de classes
- ✅ Réutilisation de logique facile
- ✅ Pas de problème avec `this`

---

## 1️⃣ useState - Gérer l'État

### Concept
Permet de stocker et modifier des données qui peuvent changer.

### Syntaxe de Base
```typescript
const [valeur, setValeur] = useState(valeurInitiale);
```

### Exemples dans GreenMind

#### Exemple 1: Compteur Simple
```typescript
const [userPoints, setUserPoints] = useState(450);

// Lire la valeur
console.log(userPoints);  // 450

// Modifier la valeur
setUserPoints(500);  // userPoints devient 500
```

#### Exemple 2: Onglet Actif
```typescript
const [activeTab, setActiveTab] = useState('dashboard');

// Changer d'onglet
<button onClick={() => setActiveTab('quizzes')}>
  Quiz
</button>
```

#### Exemple 3: État Complexe (Objet)
```typescript
const [user, setUser] = useState({
  name: 'John',
  points: 450,
  level: 4
});

// Modifier une propriété (IMPORTANT: copier l'objet)
setUser({ ...user, points: 500 });
```

#### Exemple 4: État avec Fonction
```typescript
// ❌ Mauvais: Peut causer des bugs
setUserPoints(userPoints + 50);

// ✅ Bon: Utilise la valeur précédente
setUserPoints(prev => prev + 50);
```

### Dans GreenMind (App.tsx)
```typescript
// État pour les points
const [userPoints, setUserPoints] = useState(450);

// Fonction pour ajouter des points
const addPoints = (points: number) => {
  setUserPoints(prev => prev + points);  // Utilise la valeur précédente
};

// Utilisation
addPoints(50);  // userPoints passe de 450 à 500
```

### Règles Importantes
1. ✅ Toujours utiliser `set...` pour modifier
2. ❌ Ne JAMAIS modifier directement: `userPoints = 500` ❌
3. ✅ Pour les objets/tableaux: créer une copie
4. ✅ Utiliser une fonction si la nouvelle valeur dépend de l'ancienne

---

## 2️⃣ useEffect - Effets de Bord

### Concept
Exécute du code après le rendu (appels API, timers, subscriptions, etc.)

### Syntaxe de Base
```typescript
useEffect(() => {
  // Code à exécuter
  
  return () => {
    // Nettoyage (optionnel)
  };
}, [dépendances]);
```

### Cas d'Usage

#### Cas 1: Exécuter Une Fois (au Montage)
```typescript
useEffect(() => {
  console.log('Composant monté!');
  // Charger des données depuis l'API
  fetchUsers();
}, []);  // ⚠️ Tableau vide = une seule fois
```

#### Cas 2: Exécuter Quand une Valeur Change
```typescript
useEffect(() => {
  console.log('userPoints a changé:', userPoints);
  // Sauvegarder dans localStorage
  localStorage.setItem('points', userPoints.toString());
}, [userPoints]);  // ⚠️ S'exécute quand userPoints change
```

#### Cas 3: Exécuter à Chaque Rendu
```typescript
useEffect(() => {
  console.log('Composant rendu!');
});  // ⚠️ Pas de tableau = à chaque rendu
```

#### Cas 4: Nettoyage (Cleanup)
```typescript
useEffect(() => {
  // Démarrer un timer
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Nettoyer quand le composant est démonté
  return () => {
    clearInterval(timer);
  };
}, []);
```

### Exemple Pratique: Charger des Données
```typescript
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fonction asynchrone pour charger les données
    async function loadUsers() {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, []);  // Charger une seule fois au montage
  
  if (loading) return <div>Chargement...</div>;
  return <div>{users.length} utilisateurs</div>;
}
```

### Règles Importantes
1. ✅ Toujours spécifier les dépendances
2. ⚠️ Tableau vide `[]` = une seule fois
3. ⚠️ Pas de tableau = à chaque rendu (attention!)
4. ✅ Retourner une fonction de nettoyage si nécessaire

---

## 3️⃣ useContext - Partager des Données

### Concept
Permet de partager des données entre composants sans passer par les props.

### Problème Sans Context
```typescript
// Props drilling (passer les props à travers plusieurs niveaux)
<App userPoints={450}>
  <Dashboard userPoints={450}>
    <Stats userPoints={450}>
      <Display userPoints={450} />  // 😫 Trop de niveaux!
    </Stats>
  </Dashboard>
</App>
```

### Solution Avec Context
```typescript
// 1. Créer le Context
const UserContext = createContext();

// 2. Fournir les données (Provider)
function App() {
  const [userPoints, setUserPoints] = useState(450);
  
  return (
    <UserContext.Provider value={{ userPoints, setUserPoints }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// 3. Consommer les données (n'importe où dans l'arbre)
function Display() {
  const { userPoints } = useContext(UserContext);
  return <div>{userPoints}</div>;  // 😊 Accès direct!
}
```

### Exemple Complet
```typescript
// UserContext.tsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userPoints, setUserPoints] = useState(450);
  const [userLevel, setUserLevel] = useState(4);
  
  const addPoints = (points) => {
    setUserPoints(prev => prev + points);
    setUserLevel(Math.floor((userPoints + points) / 100));
  };
  
  return (
    <UserContext.Provider value={{ userPoints, userLevel, addPoints }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personnalisé pour faciliter l'utilisation
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans UserProvider');
  }
  return context;
}

// Utilisation dans n'importe quel composant
function Dashboard() {
  const { userPoints, addPoints } = useUser();
  
  return (
    <div>
      <p>Points: {userPoints}</p>
      <button onClick={() => addPoints(50)}>+50 points</button>
    </div>
  );
}
```

---

## 4️⃣ useRef - Références

### Concept
Permet de stocker une valeur qui persiste entre les rendus SANS déclencher de re-rendu.

### Cas d'Usage

#### Cas 1: Accéder à un Élément DOM
```typescript
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();  // Focus sur l'input
  };
  
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

#### Cas 2: Stocker une Valeur Sans Re-rendu
```typescript
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number>();
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

### useState vs useRef

| useState | useRef |
|----------|--------|
| Déclenche un re-rendu | Ne déclenche PAS de re-rendu |
| Pour les données UI | Pour les valeurs techniques |
| `const [x, setX] = useState(0)` | `const x = useRef(0)` |
| Accès: `x` | Accès: `x.current` |

---

## 5️⃣ useMemo - Mémorisation de Calculs

### Concept
Mémorise le résultat d'un calcul coûteux pour éviter de le recalculer à chaque rendu.

### Sans useMemo (Problème)
```typescript
function Dashboard({ users }) {
  // ❌ Recalculé à CHAQUE rendu (même si users ne change pas)
  const sortedUsers = users.sort((a, b) => b.points - a.points);
  
  return <UserList users={sortedUsers} />;
}
```

### Avec useMemo (Solution)
```typescript
function Dashboard({ users }) {
  // ✅ Recalculé SEULEMENT si users change
  const sortedUsers = useMemo(() => {
    console.log('Tri des utilisateurs...');
    return users.sort((a, b) => b.points - a.points);
  }, [users]);
  
  return <UserList users={sortedUsers} />;
}
```

### Exemple Pratique
```typescript
function QuizResults({ answers, questions }) {
  // Calcul coûteux: analyser toutes les réponses
  const statistics = useMemo(() => {
    console.log('Calcul des statistiques...');
    return {
      correct: answers.filter(a => a.isCorrect).length,
      percentage: (answers.filter(a => a.isCorrect).length / questions.length) * 100,
      timeSpent: answers.reduce((sum, a) => sum + a.time, 0)
    };
  }, [answers, questions]);  // Recalculer si answers ou questions change
  
  return (
    <div>
      <p>Score: {statistics.percentage}%</p>
      <p>Temps: {statistics.timeSpent}s</p>
    </div>
  );
}
```

### Quand Utiliser?
- ✅ Calculs complexes (tri, filtrage de grandes listes)
- ✅ Transformations de données coûteuses
- ❌ Calculs simples (addition, soustraction)
- ❌ Optimisation prématurée

---

## 6️⃣ useCallback - Mémorisation de Fonctions

### Concept
Mémorise une fonction pour éviter de la recréer à chaque rendu.

### Problème Sans useCallback
```typescript
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ Nouvelle fonction créée à CHAQUE rendu
  const handleClick = () => {
    console.log('Clicked!');
  };
  
  return <Child onClick={handleClick} />;  // Child re-rend inutilement
}
```

### Solution Avec useCallback
```typescript
function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ Même fonction réutilisée
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);  // Dépendances vides = fonction stable
  
  return <Child onClick={handleClick} />;  // Child ne re-rend pas
}
```

### Exemple Pratique
```typescript
function QuizList() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // Fonction mémorisée
  const handleQuizStart = useCallback((quizId: number) => {
    console.log('Démarrage du quiz:', quizId);
    setSelectedQuiz(quizId);
  }, []);  // Pas de dépendances = fonction stable
  
  return (
    <div>
      {quizzes.map(quiz => (
        <QuizCard 
          key={quiz.id}
          quiz={quiz}
          onStart={handleQuizStart}  // Même fonction pour tous
        />
      ))}
    </div>
  );
}
```

### useMemo vs useCallback

```typescript
// useMemo: mémorise une VALEUR
const value = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback: mémorise une FONCTION
const callback = useCallback(() => doSomething(a, b), [a, b]);

// Équivalent:
const callback = useMemo(() => () => doSomething(a, b), [a, b]);
```

---

## 7️⃣ Hook Personnalisé - Créer Ses Propres Hooks

### Concept
Extraire de la logique réutilisable dans une fonction personnalisée.

### Exemple: useApi (dans GreenMind)
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

export function useApi<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return { data, loading, error };
}

// Utilisation
function UserList() {
  const { data: users, loading, error } = useApi(() => 
    fetch('http://localhost:8080/api/users').then(r => r.json())
  );
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  
  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Exemple: useLocalStorage
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // Lire depuis localStorage au montage
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });
  
  // Sauvegarder dans localStorage quand la valeur change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// Utilisation
function App() {
  const [userPoints, setUserPoints] = useLocalStorage('points', 450);
  
  return (
    <div>
      <p>Points: {userPoints}</p>
      <button onClick={() => setUserPoints(userPoints + 50)}>
        +50 points
      </button>
    </div>
  );
}
```

### Règles pour les Hooks Personnalisés
1. ✅ Nom doit commencer par `use`
2. ✅ Peut utiliser d'autres Hooks
3. ✅ Retourner ce qui est utile
4. ✅ Documenter les paramètres et le retour

---

## 📋 Règles des Hooks

### Règle 1: Appeler au Niveau Supérieur
```typescript
// ❌ MAUVAIS: Dans une condition
function Component() {
  if (condition) {
    const [state, setState] = useState(0);  // ❌ Erreur!
  }
}

// ✅ BON: Au niveau supérieur
function Component() {
  const [state, setState] = useState(0);  // ✅ Correct
  
  if (condition) {
    // Utiliser state ici
  }
}
```

### Règle 2: Appeler Uniquement dans des Composants React
```typescript
// ❌ MAUVAIS: Dans une fonction normale
function calculateTotal() {
  const [total, setTotal] = useState(0);  // ❌ Erreur!
}

// ✅ BON: Dans un composant
function Calculator() {
  const [total, setTotal] = useState(0);  // ✅ Correct
}

// ✅ BON: Dans un Hook personnalisé
function useCalculator() {
  const [total, setTotal] = useState(0);  // ✅ Correct
}
```

---

## 🎯 Résumé des Hooks

| Hook | Usage | Exemple |
|------|-------|---------|
| `useState` | Gérer l'état | `const [count, setCount] = useState(0)` |
| `useEffect` | Effets de bord | `useEffect(() => { fetchData() }, [])` |
| `useContext` | Partager des données | `const user = useContext(UserContext)` |
| `useRef` | Références DOM/valeurs | `const ref = useRef(null)` |
| `useMemo` | Mémoriser calculs | `const sorted = useMemo(() => sort(data), [data])` |
| `useCallback` | Mémoriser fonctions | `const fn = useCallback(() => {}, [])` |

---

## 💡 Conseils pour Votre Présentation

### Points Clés à Expliquer
1. **useState**: "Permet de stocker des données qui changent, comme les points de l'utilisateur"
2. **useEffect**: "Exécute du code après le rendu, par exemple pour charger des données depuis l'API"
3. **Hooks Personnalisés**: "On peut créer nos propres Hooks pour réutiliser de la logique"

### Démonstration Simple
```typescript
// Montrer dans App.tsx
const [userPoints, setUserPoints] = useState(450);

// Expliquer:
// - userPoints: la valeur actuelle (450)
// - setUserPoints: fonction pour modifier
// - useState(450): valeur initiale
```

### Questions Probables
**Q: Pourquoi utiliser des Hooks?**
R: "Plus simple que les classes, code plus court, logique réutilisable"

**Q: Quelle est la différence entre useState et useRef?**
R: "useState déclenche un re-rendu quand on modifie, useRef non"

**Q: Quand utiliser useEffect?**
R: "Pour les appels API, timers, ou tout ce qui doit se passer après le rendu"
