import React from 'react';
import { Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AuthLayoutProps } from './types';

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 sm:p-3 rounded-xl">
              <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-green-900">GreenMind</h1>
            <p className="text-xs sm:text-sm text-green-600">Agissons ensemble pour la planète</p>
          </div>
        </div>

        {/* Authentication Card */}
        <Card className="bg-white shadow-lg border border-green-100">
          <CardHeader className="text-center space-y-1 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl font-medium text-green-900">
              {title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              {subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;