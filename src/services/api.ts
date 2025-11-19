// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// User API
export const userApi = {
  getProfile: () => apiCall<User>('/users/profile'),
  updatePoints: (points: number) => 
    apiCall<User>('/users/points', {
      method: 'PUT',
      body: JSON.stringify({ points }),
    }),
  getUserStats: () => apiCall<UserStats>('/users/stats'),
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
};

// Tips API
export const tipsApi = {
  getAllTips: () => apiCall<Tip[]>('/tips'),
  likeTip: (tipId: number) =>
    apiCall<void>(`/tips/${tipId}/like`, {
      method: 'POST',
    }),
};

// Global Stats API
export const statsApi = {
  getGlobalCO2: () => apiCall<{ totalCO2Reduced: number }>('/stats/global-co2'),
  getDashboardStats: () => apiCall<DashboardStats>('/stats/dashboard'),
};

// Types
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
