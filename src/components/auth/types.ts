// Form data interfaces
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  surname: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupData {
  name: string;
  surname?: string;
  address?: string;
  email: string;
  password: string;
}

export interface VerificationFormData {
  code: string;
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Component prop interfaces
export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  isLoading?: boolean;
  error?: string;
}

export interface SignupFormProps {
  onSignup: (userData: SignupData) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export interface AuthToggleProps {
  currentPage: 'login' | 'signup';
  onSwitchToLogin: () => void;
  onSwitchToSignup: () => void;
}

export interface VerificationFormProps {
  email: string;
  onVerify: (code: string) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}
