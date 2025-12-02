// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_TOKEN_KEY = 'greenmind_auth_token';

const getAuthToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string | null) => {
  if (typeof localStorage === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    let message = `API Error: ${response.statusText}`;
    try {
      const data = await response.json();
      message = (data && (data.message || data.error)) || message;
    } catch (err) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    // No content
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (payload: RegisterPayload) =>
    apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  verifyEmail: (payload: VerifyEmailPayload) =>
    apiCall<AuthResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  clearSession: () => setAuthToken(null),
};

// User API
export const userApi = {
  // Profil utilisateur courant (existant)
  getProfile: () => apiCall<User>('/users/profile'),
  updatePoints: (points: number) =>
    apiCall<User>('/users/points', {
      method: 'PUT',
      body: JSON.stringify({ points }),
    }),
  getUserStats: () => apiCall<UserStats>('/users/stats'),

  // Administration des utilisateurs (pour le tableau de bord admin)
  getAll: () => apiCall<User[]>('/users'),
  getById: (id: number) => apiCall<User>(`/users/${id}`),
  create: (user: Pick<User, 'name' | 'email'>) =>
    apiCall<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: number, user: Partial<Pick<User, 'name' | 'email'>>) =>
    apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  delete: (id: number) =>
    apiCall<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Quiz API
export const quizApi = {
  getAllQuizzes: () => apiCall<Quiz[]>('/quizzes'),
  getQuizById: (id: number) => apiCall<Quiz>(`/quizzes/${id}`),
  submitQuiz: (quizId: number, answers: number[]) =>
    apiCall<QuizResult>('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers }),
    }),

  // Administration des quiz
  createQuiz: (quiz: Omit<Quiz, 'id'>) =>
    apiCall<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    }),
  updateQuiz: (id: number, quiz: Partial<Omit<Quiz, 'id'>>) =>
    apiCall<Quiz>(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quiz),
    }),
  deleteQuiz: (id: number) =>
    apiCall<void>(`/quizzes/${id}`, {
      method: 'DELETE',
    }),
};

// Mission API
export const missionApi = {
  getAllMissions: () => apiCall<Mission[]>('/missions'),
  updateProgress: (missionId: number, progress: number) =>
    apiCall<Mission>(`/missions/${missionId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    }),
  completeMission: (missionId: number) =>
    apiCall<MissionResult>(`/missions/${missionId}/complete`, {
      method: 'POST',
    }),

  // Administration des missions
  createMission: (mission: Omit<Mission, 'id' | 'progress'>) =>
    apiCall<Mission>('/missions', {
      method: 'POST',
      body: JSON.stringify(mission),
    }),
  updateMission: (id: number, mission: Partial<Omit<Mission, 'id'>>) =>
    apiCall<Mission>(`/missions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mission),
    }),
  deleteMission: (id: number) =>
    apiCall<void>(`/missions/${id}`, {
      method: 'DELETE',
    }),
};

// Tips API
export const tipsApi = {
  getAllTips: () => apiCall<Tip[]>('/tips'),
  likeTip: (tipId: number) =>
    apiCall<void>(`/tips/${tipId}/like`, {
      method: 'POST',
    }),

  // Administration des astuces
  createTip: (tip: Omit<Tip, 'id' | 'likes'>) =>
    apiCall<Tip>('/tips', {
      method: 'POST',
      body: JSON.stringify(tip),
    }),
  updateTip: (id: number, tip: Partial<Omit<Tip, 'id'>>) =>
    apiCall<Tip>(`/tips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tip),
    }),
  deleteTip: (id: number) =>
    apiCall<void>(`/tips/${id}`, {
      method: 'DELETE',
    }),
};

// Global Stats API
export const statsApi = {
  getGlobalCO2: () => apiCall<{ totalCO2Reduced: number }>('/stats/global-co2'),
  getDashboardStats: () => apiCall<DashboardStats>('/stats/dashboard'),
};

// Types
export interface AuthResponse {
  token?: string;
  email: string;
  emailVerified: boolean;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  surname?: string;
  address?: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  level: number;
  co2Reduced: number;
  createdAt: string;
}

export interface UserStats {
  missionsCompleted: number;
  quizzesCompleted: number;
  currentStreak: number;
  badges: Badge[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  co2Impact: number;
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  pointsEarned: number;
  co2Reduced: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  points: number;
  co2Impact: number;
  difficulty: string;
  progress: number;
  total: number;
}

export interface MissionResult {
  success: boolean;
  pointsEarned: number;
  co2Reduced: number;
}

export interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
  impact: string;
  likes: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DashboardStats {
  userPoints: number;
  globalCO2Reduced: number;
  weeklyData: WeeklyData[];
}

export interface WeeklyData {
  day: string;
  points: number;
  co2: number;
}
