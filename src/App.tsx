// ============================================================================
// App.tsx - Composant Principal de l'Application GreenMind
// ============================================================================
// Ce fichier contient le composant racine qui gère:
// - La navigation entre les différentes sections
// - L'état global (points utilisateur, CO2 réduit)
// - La structure générale de l'application
// ============================================================================

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Dashboard } from './components/Dashboard';
import { Quizzes } from './components/Quizzes';
import { Missions } from './components/Missions';
import { EcoTips } from './components/EcoTips';
import { UserProfile } from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AuthLayout from './components/auth/AuthLayout';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import VerificationForm from './components/auth/VerificationForm';
import { SignupData } from './components/auth/types';
import { authApi, setAuthToken } from './services/api';
import { Leaf, BookOpen, Target, User, LogOut, Shield } from 'lucide-react';

export default function App() {
  // ========== ÉTAT DE L'APPLICATION ==========
  
  // Authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAuthPage, setCurrentAuthPage] = useState<'login' | 'signup' | 'verify'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  
  // Gestion de l'onglet actif (dashboard, quizzes, missions, etc.)
  const [activeTab, setActiveTab] = useState('dashboard');
  

  
  // Points de l'utilisateur (utilisés pour calculer le niveau)
  const [userPoints, setUserPoints] = useState(450);
  
  // CO2 total réduit par tous les utilisateurs (compteur collectif)
  const [globalCO2Reduced, setGlobalCO2Reduced] = useState(12547);

  // ========== FONCTIONS DE MISE À JOUR ==========
  
  /**
   * Handles successful authentication and transitions to main app
   */
  const handleAuthenticationSuccess = (role: 'user' | 'admin' = 'user') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setAuthError('');
    setAuthLoading(false);
    setPendingEmail(null);
    setCurrentAuthPage('login');
  };

  /**
   * Switches between login and signup pages
   * @param page - The authentication page to switch to
   */
  const switchAuthPage = (page: 'login' | 'signup') => {
    setCurrentAuthPage(page);
    setAuthError(''); // Clear any existing errors when switching pages
    setPendingEmail(null);
  };

  /**
   * Handles login form submission
   * @param email - User's email address
   * @param password - User's password
   */
  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await authApi.login({ email, password });
      if (response.token) {
        setAuthToken(response.token);
      }
      const isAdmin = email === 'admin@greenmind.com';
      const role = isAdmin ? 'admin' : 'user';
      toast.success(response.message || 'Signed in successfully');
      handleAuthenticationSuccess(role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      setAuthError(message);
      toast.error(message);
      setAuthLoading(false);
    }
  };

  /**
   * Handles signup form submission
   * @param userData - New user registration data
   */
  const handleSignup = async (userData: SignupData) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      await authApi.register({
        name: userData.name,
        surname: userData.surname,
        address: userData.address,
        email: userData.email,
        password: userData.password,
      });
      setPendingEmail(userData.email);
      setCurrentAuthPage('verify');
      toast.success('Registration successful. Check your email for the verification code.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Handles email verification submission
   * @param code - The verification code sent via email
   */
  const handleVerifyEmail = async (code: string) => {
    if (!pendingEmail) {
      setAuthError('No registration found. Please sign up again.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const response = await authApi.verifyEmail({ email: pendingEmail, code });
      if (response.token) {
        setAuthToken(response.token);
      }
      toast.success(response.message || 'Email verified successfully');
      handleAuthenticationSuccess('user');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed. Please try again.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setAuthLoading(false);
    }
  };
  
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

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    authApi.clearSession();
    setIsAuthenticated(false);
    setUserRole('user');
    setActiveTab('dashboard');
    setAuthError('');
    toast.success('You have been logged out.');
  };

  // ========== CONFIGURATION DES ONGLETS ==========
  
  // Définition des onglets de navigation avec leurs icônes
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Leaf },
    { id: 'quizzes', label: 'Quiz', icon: BookOpen },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'tips', label: 'Astuces', icon: Leaf },
    { id: 'profile', label: 'Profil', icon: User },
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Administration', icon: Shield }] : []),
  ];

  // ========== RENDU DE L'APPLICATION ==========
  
  // If user is not authenticated, show authentication pages
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {currentAuthPage === 'login' && (
          <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your eco-friendly journey"
          >
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => switchAuthPage('signup')}
              isLoading={authLoading}
              error={authError}
            />
          </AuthLayout>
        )}
        
        {currentAuthPage === 'signup' && (
          <AuthLayout
            title="Join GreenMind"
            subtitle="Create your account and start making a difference"
          >
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => switchAuthPage('login')}
              isLoading={authLoading}
              error={authError}
            />
          </AuthLayout>
        )}

        {currentAuthPage === 'verify' && pendingEmail && (
          <AuthLayout
            title="Verify your email"
            subtitle={`Enter the 6-digit code sent to ${pendingEmail}`}
          >
            <VerificationForm
              email={pendingEmail}
              onVerify={handleVerifyEmail}
              onSwitchToLogin={() => switchAuthPage('login')}
              isLoading={authLoading}
              error={authError}
            />
          </AuthLayout>
        )}
      </>
    );
  }
  
  // If user is authenticated, show main application with sidebar
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex">
        
      {/* ========== ALWAYS VISIBLE SIDEBAR ========== */}
      <aside className="flex flex-col w-64 fixed inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-green-100 shadow-sm">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-green-100">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-medium text-green-900">GreenMind</h1>
              <p className="text-xs sm:text-sm text-green-600">Agissons ensemble pour la planète</p>
              {userRole === 'admin' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Administrateur
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 rounded-lg transition-colors text-left touch-manipulation min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Stats and Logout */}
          <div className="px-2 sm:px-4 py-4 border-t border-green-100 space-y-3">
            <div className="bg-green-50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-green-600 font-medium hidden sm:block">Vos points verts</p>
              <p className="text-sm sm:text-lg font-bold text-green-900 text-center sm:text-left">{userPoints}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-green-100 font-medium hidden sm:block">CO₂ collectif réduit</p>
              <p className="text-sm sm:text-lg font-bold text-white text-center sm:text-left">{globalCO2Reduced.toLocaleString()}</p>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-2 sm:px-4 py-3 rounded-lg transition-colors text-left text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 touch-manipulation min-h-[44px]"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium hidden sm:block">Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT AREA ========== */}
      <div className="flex-1 ml-64">
        {/* Main Header */}
        <header className="bg-white shadow-sm border-b border-green-100">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">
                  {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Bienvenue dans votre espace GreenMind
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-green-600">Vos points verts</p>
                  <p className="text-lg sm:text-xl font-bold text-green-900">{userPoints} pts</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
                  <p className="text-xs text-green-100">CO₂ collectif réduit</p>
                  <p className="text-sm sm:text-lg font-bold text-white">{globalCO2Reduced.toLocaleString()} kg</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ========== MAIN CONTENT ========== */}
        <main className="p-4 lg:p-6">
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
          
          {/* Administration - Tableau de bord admin */}
          {activeTab === 'admin' && userRole === 'admin' && <AdminDashboard />}
        </main>
      </div>
    </div>
    </>
  );
}
