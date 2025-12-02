import React, { useState } from 'react';
import { SignupFormProps, SignupFormData } from './types';
import { validateFullName, validateSurname, validateAddress, validateEmail, validatePassword, validateConfirmPassword, validateSignupForm } from './validation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, isLoading, error }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    surname: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof SignupFormData) => (
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

  const handleInputBlur = (field: keyof SignupFormData) => () => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof SignupFormData, value: string) => {
    let validation;

    switch (field) {
      case 'name':
        validation = validateFullName(value);
        break;
      case 'surname':
        validation = validateSurname(value);
        break;
      case 'address':
        validation = validateAddress(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value);
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
    const validation = validateSignupForm(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setTouchedFields({
        name: true,
        surname: true,
        address: true,
        email: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    // Clear any existing field errors
    setFieldErrors({});

    // Call onSignup with the required SignupData format
    onSignup({
      name: formData.name,
      surname: formData.surname || undefined,
      address: formData.address || undefined,
      email: formData.email,
      password: formData.password
    });
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

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          onBlur={handleInputBlur('name')}
          placeholder="Enter your name"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.name ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.name}
          required
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Surname Field (optional) */}
      <div className="space-y-2">
        <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
          Surname (optional)
        </Label>
        <Input
          id="surname"
          type="text"
          value={formData.surname}
          onChange={handleInputChange('surname')}
          onBlur={handleInputBlur('surname')}
          placeholder="Enter your surname"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.surname ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.surname}
        />
        {fieldErrors.surname && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.surname}
          </p>
        )}
      </div>

      {/* Address Field (optional) */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address (optional)
        </Label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange('address')}
          onBlur={handleInputBlur('address')}
          placeholder="Enter your address"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.address ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.address}
        />
        {fieldErrors.address && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.address}
          </p>
        )}
      </div>

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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          onBlur={handleInputBlur('confirmPassword')}
          placeholder="Confirm your password"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldErrors.confirmPassword ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldErrors.confirmPassword}
          required
        />
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-11 sm:h-10 text-base sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white touch-manipulation"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Switch to Login Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-green-600 hover:text-green-700 active:text-green-800 font-medium underline touch-manipulation min-h-[44px] inline-flex items-center"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
