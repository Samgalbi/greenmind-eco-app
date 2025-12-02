import { ValidationResult, FieldValidationResult, LoginFormData, SignupFormData } from './types';

// Email validation utility
export const validateEmail = (email: string): FieldValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
};

// Password validation utility
export const validatePassword = (password: string): FieldValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must contain at least one letter and one number'
    };
  }

  return { isValid: true };
};

// Full name validation utility
export const validateFullName = (fullName: string): FieldValidationResult => {
  if (!fullName.trim()) {
    return {
      isValid: false,
      error: 'Full name is required'
    };
  }

  if (fullName.trim().length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters long'
    };
  }

  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(fullName.trim())) {
    return {
      isValid: false,
      error: 'Full name can only contain letters and spaces'
    };
  }

  return { isValid: true };
};

// Optional surname validation utility
export const validateSurname = (surname: string): FieldValidationResult => {
  if (!surname.trim()) {
    return { isValid: true };
  }

  if (surname.trim().length < 2) {
    return {
      isValid: false,
      error: 'Surname must be at least 2 characters long'
    };
  }

  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(surname.trim())) {
    return {
      isValid: false,
      error: 'Surname can only contain letters and spaces'
    };
  }

  return { isValid: true };
};

// Optional address validation utility
export const validateAddress = (address: string): FieldValidationResult => {
  if (!address.trim()) {
    return { isValid: true };
  }

  if (address.trim().length < 5) {
    return {
      isValid: false,
      error: 'Address must be at least 5 characters long'
    };
  }

  return { isValid: true };
};

// Confirm password validation utility
export const validateConfirmPassword = (password: string, confirmPassword: string): FieldValidationResult => {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return { isValid: true };
};

// Complete login form validation
export const validateLoginForm = (formData: LoginFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Complete signup form validation
export const validateSignupForm = (formData: SignupFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameValidation = validateFullName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  const surnameValidation = validateSurname(formData.surname);
  if (!surnameValidation.isValid) {
    errors.surname = surnameValidation.error!;
  }

  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.error!;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }

  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
