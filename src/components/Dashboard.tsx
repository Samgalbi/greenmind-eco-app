// ============================================================================
// Dashboard.tsx - Composant Tableau de Bord
// ============================================================================
// Ce composant affiche la vue d'ensemble de l'application avec:
// - Compteur CO₂ collectif (tous les utilisateurs)
// - Progression de l'utilisateur (niveau, points)
// - Statistiques personnelles
// - Graphiques de la semaine
// - Badges récents
// ============================================================================

import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Leaf, Award, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// ========== INTERFACE DES PROPS ==========
// Définit les données que le composant reçoit du parent (App.tsx)
interface DashboardProps {
  userPoints: number;        // Points totaux de l'utilisateur
  globalCO2Reduced: number;  // CO₂ total réduit par tous les utilisateurs
}

export function Dashboard({ userPoints, globalCO2Reduced }: DashboardProps) {
  
  // ========== DONNÉES DE LA SEMAINE ==========
  // Données fictives pour les graphiques (à remplacer par des vraies données de l'API)
  const weeklyData = [
    { day: 'Lun', points: 45, co2: 12 },   // Lundi
    { day: 'Mar', points: 60, co2: 18 },   // Mardi
    { day: 'Mer', points: 35, co2: 8 },    // Mercredi
    { day: 'Jeu', points: 80, co2: 25 },   // Jeudi
    { day: 'Ven', points: 70, co2: 20 },   // Vendredi
    { day: 'Sam', points: 90, co2: 30 },   // Samedi
    { day: 'Dim', points: 70, co2: 22 },   // Dimanche
  ];

  // ========== CALCULS DE PROGRESSION ==========
  
  // Calcul du niveau actuel (1 niveau = 100 points)
  const userLevel = Math.floor(userPoints / 100);
  
  // Points nécessaires pour atteindre le niveau suivant
  const nextLevelPoints = (userLevel + 1) * 100;
  
  // Pourcentage de progression vers le niveau suivant
  // Exemple: Si userPoints = 450, alors 450 % 100 = 50 points sur 100 = 50%
  const progressToNextLevel = ((userPoints % 100) / 100) * 100;

  // ========== BADGES RÉCENTS ==========
  // Liste des derniers badges débloqués par l'utilisateur
  const recentBadges = [
    { id: 1, name: 'Éco-Débutant', icon: '🌱', color: 'bg-green-100 text-green-700' },
    { id: 2, name: 'Économiseur d\'Eau', icon: '💧', color: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'Recycleur Pro', icon: '♻️', color: 'bg-emerald-100 text-emerald-700' },
  ];

  // ========== STATISTIQUES UTILISATEUR ==========
  // Résumé des activités de l'utilisateur
  const stats = [
    { label: 'Missions complétées', value: '12', icon: Target, color: 'text-green-600' },
    { label: 'Quiz réussis', value: '8', icon: Award, color: 'text-blue-600' },
    { label: 'Série actuelle', value: '5 jours', icon: Zap, color: 'text-yellow-600' },
    { label: 'Rang mondial', value: '#247', icon: TrendingUp, color: 'text-purple-600' },
  ];

  // ========== RENDU DU COMPOSANT ==========
  return (
    <div className="space-y-6">
      
      {/* ========== SECTION HERO - COMPTEUR CO₂ COLLECTIF ========== */}
      {/* Grande bannière verte affichant l'impact collectif de tous les utilisateurs */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* Partie gauche: Texte et compteur CO₂ */}
          <div>
            <h2 className="text-white mb-2">Compteur Collectif CO₂</h2>
            <p className="text-green-100 mb-4">
              Ensemble, nous avons réduit notre empreinte carbone
            </p>
            
            {/* Affichage du nombre total de kg de CO₂ réduits */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl text-white">{globalCO2Reduced.toLocaleString()}</span>
              <span className="text-2xl text-green-100">kg CO₂</span>
            </div>
            
            {/* Nombre d'utilisateurs actifs */}
            <div className="mt-4 flex items-center gap-2 text-green-100">
              <Users className="w-4 h-4" />
              <span className="text-sm">1,234 éco-citoyens actifs</span>
            </div>
          </div>
          
          {/* Partie droite: Objectif mensuel */}
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <Leaf className="w-16 h-16 text-white mb-2" />
              <p className="text-sm text-green-100">Objectif mensuel</p>
              {/* Barre de progression vers l'objectif */}
              <Progress value={62} className="mt-2 bg-white/30" />
              <p className="text-xs text-green-100 mt-1">15,000 kg - 62%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROGRESSION UTILISATEUR ========== */}
      {/* Carte affichant le niveau et les points de l'utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-900">Votre Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Barre de progression vers le niveau suivant */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green-700">Niveau {userLevel} - Éco-Citoyen</span>
                <span className="text-green-600">{userPoints} / {nextLevelPoints} pts</span>
              </div>
              {/* Barre de progression visuelle */}
              <Progress value={progressToNextLevel} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                Plus que {nextLevelPoints - userPoints} points pour atteindre le niveau {userLevel + 1}
              </p>
            </div>
            
            {/* ========== GRILLE DE STATISTIQUES ========== */}
            {/* 4 cartes affichant les stats principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat) => {
                const Icon = stat.icon;  // Récupère l'icône correspondante
                return (
                  <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
                    <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                    <p className="text-2xl text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== GRAPHIQUES ========== */}
      {/* Deux graphiques côte à côte: points et CO₂ */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* GRAPHIQUE 1: Points de la semaine (Barres) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-900">Points de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ResponsiveContainer: s'adapte à la taille de l'écran */}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                {/* Grille en arrière-plan */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                {/* Axe X: jours de la semaine */}
                <XAxis dataKey="day" stroke="#6b7280" />
                {/* Axe Y: nombre de points */}
                <YAxis stroke="#6b7280" />
                {/* Tooltip: info au survol */}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                {/* Barres vertes représentant les points */}
                <Bar dataKey="points" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRAPHIQUE 2: Impact CO₂ hebdomadaire (Ligne) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-900">Impact CO₂ hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                {/* Ligne verte représentant le CO₂ réduit */}
                <Line 
                  type="monotone"           // Ligne courbe
                  dataKey="co2"             // Données à afficher
                  stroke="#059669"          // Couleur de la ligne
                  strokeWidth={3}           // Épaisseur
                  dot={{ fill: '#10b981', r: 5 }}  // Points sur la ligne
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ========== BADGES RÉCENTS ========== */}
      {/* Affiche les 3 derniers badges débloqués */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-900">Badges récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="flex-1">
                {/* Carte colorée pour chaque badge */}
                <div className={`${badge.color} rounded-xl p-6 text-center`}>
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-sm">{badge.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
