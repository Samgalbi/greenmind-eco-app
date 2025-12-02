import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { VerificationFormProps } from './types';

const VerificationForm: React.FC<VerificationFormProps> = ({
  email,
  onVerify,
  onSwitchToLogin,
  isLoading,
  error,
}) => {
  const [code, setCode] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setFieldError('Verification code must be 6 digits');
      return;
    }
    setFieldError('');
    onVerify(code.trim());
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

      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>. Enter it below to
          activate your account.
        </p>
      </div>

      {/* Verification Code Field */}
      <div className="space-y-2">
        <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
          Verification Code
        </Label>
        <Input
          id="verificationCode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          className={`w-full h-11 sm:h-10 text-base sm:text-sm ${fieldError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
          aria-invalid={!!fieldError}
          required
        />
        {fieldError && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500 text-base">!</span>
            {fieldError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 sm:h-10 text-base sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white touch-manipulation"
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already verified?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-green-600 hover:text-green-700 active:text-green-800 font-medium underline touch-manipulation min-h-[44px] inline-flex items-center"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default VerificationForm;
