import React, { useState } from 'react';
import { LoginFormProps, LoginFormData } from './types';
import { validateEmail, validatePassword, validateLoginForm } from './validation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup, isLoading, error }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for touched fields
    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  const handleInputBlur = (field: keyof LoginFormData) => () => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof LoginFormData, value: string) => {
    let validation;
    
    switch (field) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      default:
        return;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? '' : validation.error || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate entire form before submission
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setTouchedFields({
        email: true,
        password: true
      });
      return;
    }

    // Clear any existing field errors
    setFieldErrors({});
    onLogin(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Authentication Error Display */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="text-red-500 text-base">!</span>
            {error}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleInputBlur('email')}
          placeholder="Enter your email"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.email}
          required
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          onBlur={handleInputBlur('password')}
          placeholder="Enter your password"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.password ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.password}
          required
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-11 sm:h-10 text-base sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white touch-manipulation"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Admin Demo Credentials */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <p className="text-xs text-blue-700 font-medium mb-1">Démo - Identifiants Admin:</p>
        <p className="text-xs text-blue-600">Email: admin@greenmind.com</p>
        <p className="text-xs text-blue-600">Mot de passe: admin123</p>
      </div>

      {/* Switch to Signup Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-green-600 hover:text-green-700 active:text-green-800 font-medium underline touch-manipulation min-h-[44px] inline-flex items-center"
          >
            Sign up here
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
