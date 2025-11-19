// ============================================================================
// App.tsx - Composant Principal de l'Application GreenMind
// ============================================================================
// Ce fichier contient le composant racine qui gère:
// - La navigation entre les différentes sections
// - L'état global (points utilisateur, CO2 réduit)
// - La structure générale de l'application
// ============================================================================

import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Quizzes } from './components/Quizzes';
import { Missions } from './components/Missions';
import { EcoTips } from './components/EcoTips';
import { UserProfile } from './components/UserProfile';
import { Leaf, BookOpen, Target, User } from 'lucide-react';

export default function App() {
  // ========== ÉTAT DE L'APPLICATION ==========
  
  // Gestion de l'onglet actif (dashboard, quizzes, missions, etc.)
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Points de l'utilisateur (utilisés pour calculer le niveau)
  const [userPoints, setUserPoints] = useState(450);
  
  // CO2 total réduit par tous les utilisateurs (compteur collectif)
  const [globalCO2Reduced, setGlobalCO2Reduced] = useState(12547);

  // ========== FONCTIONS DE MISE À JOUR ==========
  
  /**
   * Ajoute des points à l'utilisateur
   * @param points - Nombre de points à ajouter
   */
  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
  };

  /**
   * Ajoute une réduction de CO2 au compteur global
   * @param kg - Kilogrammes de CO2 réduits
   */
  const addCO2Reduction = (kg: number) => {
    setGlobalCO2Reduced(prev => prev + kg);
  };

  // ========== CONFIGURATION DES ONGLETS ==========
  
  // Définition des onglets de navigation avec leurs icônes
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Leaf },
    { id: 'quizzes', label: 'Quiz', icon: BookOpen },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'tips', label: 'Astuces', icon: Leaf },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  // ========== RENDU DE L'APPLICATION ==========
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      
      {/* ========== EN-TÊTE ========== */}
      {/* Affiche le logo, le nom de l'app, les points et le CO2 collectif */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-green-900">GreenMind</h1>
                <p className="text-sm text-green-600">Agissons ensemble pour la planète</p>
              </div>
            </div>
            
            {/* Statistiques utilisateur */}
            <div className="flex items-center gap-6">
              {/* Points de l'utilisateur */}
              <div className="text-right">
                <p className="text-sm text-green-600">Vos points verts</p>
                <p className="text-green-900">{userPoints} pts</p>
              </div>
              
              {/* Compteur CO2 collectif */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-2 rounded-lg">
                <p className="text-xs text-green-100">CO₂ collectif réduit</p>
                <p className="text-white">{globalCO2Reduced.toLocaleString()} kg</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== BARRE DE NAVIGATION ========== */}
      {/* Onglets pour naviguer entre les différentes sections */}
      <nav className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-700 bg-green-50'  // Style actif
                      : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-green-50'  // Style inactif
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ========== CONTENU PRINCIPAL ========== */}
      {/* Affiche le composant correspondant à l'onglet actif */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard - Vue d'ensemble */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            userPoints={userPoints} 
            globalCO2Reduced={globalCO2Reduced}
          />
        )}
        
        {/* Quiz - Questions écologiques */}
        {activeTab === 'quizzes' && (
          <Quizzes 
            onComplete={(points, co2) => {
              addPoints(points);           // Ajoute les points gagnés
              addCO2Reduction(co2);        // Ajoute le CO2 réduit
            }}
          />
        )}
        
        {/* Missions - Défis quotidiens */}
        {activeTab === 'missions' && (
          <Missions 
            onComplete={(points, co2) => {
              addPoints(points);           // Ajoute les points gagnés
              addCO2Reduction(co2);        // Ajoute le CO2 réduit
            }}
          />
        )}
        
        {/* Astuces - Conseils écologiques */}
        {activeTab === 'tips' && <EcoTips />}
        
        {/* Profil - Informations utilisateur */}
        {activeTab === 'profile' && <UserProfile userPoints={userPoints} />}
      </main>
    </div>
  );
}
