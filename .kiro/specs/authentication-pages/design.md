# Authentication Pages Design Document

## Overview

This design document outlines the implementation of login and signup pages for the GreenMind application. The authentication pages will maintain visual consistency with the existing application while providing a seamless user experience for account creation and login processes. The design leverages the existing UI component library and follows established patterns from the current dashboard and profile components.

## Architecture

### Component Structure

The authentication system will be implemented as a set of React components that integrate with the existing application structure:

```
src/components/auth/
├── AuthLayout.tsx          # Shared layout for auth pages
├── LoginForm.tsx           # Login form component
├── SignupForm.tsx          # Signup form component
└── AuthToggle.tsx          # Component to switch between login/signup
```

### State Management

The authentication pages will use React's built-in state management (useState) for form handling and validation. No external state management library is required for this initial implementation.

### Integration Points

- **App.tsx**: Modified to conditionally render authentication pages or main application
- **Navigation**: Simple state-based navigation between auth pages and main app
- **Form Validation**: Client-side validation using React state and validation functions

## Components and Interfaces

### AuthLayout Component

**Purpose**: Provides the shared visual structure for all authentication pages

**Key Features**:
- Centered card layout with GreenMind branding
- Responsive design that works on mobile and desktop
- Green gradient background matching the main application
- Logo and tagline display

**Props Interface**:
```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
```

### LoginForm Component

**Purpose**: Handles user login functionality

**Form Fields**:
- Email address (required, email validation)
- Password (required, minimum length validation)

**Features**:
- Real-time form validation
- Error message display
- Submit button with loading state
- Link to switch to signup page

**Props Interface**:
```typescript
interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  isLoading?: boolean;
  error?: string;
}
```

### SignupForm Component

**Purpose**: Handles new user registration

**Form Fields**:
- Full name (required, minimum 2 characters)
- Email address (required, email validation)
- Password (required, minimum 8 characters)
- Confirm password (required, must match password)

**Features**:
- Real-time form validation with visual feedback
- Password strength indicator
- Error message display for each field
- Submit button with loading state
- Link to switch to login page

**Props Interface**:
```typescript
interface SignupFormProps {
  onSignup: (userData: SignupData) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}
```

### AuthToggle Component

**Purpose**: Provides navigation between login and signup pages

**Features**:
- Clear visual indication of current page
- Smooth transition between forms
- Consistent styling with application theme

## Data Models

### Form Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### Validation Rules

**Email Validation**:
- Must be a valid email format
- Required field

**Password Validation**:
- Minimum 8 characters
- Must contain at least one letter and one number
- Required field

**Full Name Validation**:
- Minimum 2 characters
- Only letters and spaces allowed
- Required field

**Confirm Password Validation**:
- Must match the password field exactly
- Required field

## Visual Design Specifications

### Color Scheme

Following the existing GreenMind design system:
- Primary: Green-500 to Emerald-600 gradient
- Background: Green-50 to Emerald-50 to Teal-50 gradient
- Cards: White background with subtle shadows
- Text: Green-900 for headings, Gray-600 for body text
- Error states: Red-500 for error messages and borders

### Layout Structure

**Desktop Layout**:
- Centered card (max-width: 400px)
- Full-height gradient background
- Logo positioned above the form card
- Form card with rounded corners and shadow

**Mobile Layout**:
- Full-width card with padding
- Responsive typography scaling
- Touch-friendly button sizes
- Optimized spacing for mobile screens

### Typography

Consistent with existing application:
- Headings: Text-2xl, font-medium, text-green-900
- Body text: Text-base, text-gray-600
- Labels: Text-sm, font-medium, text-gray-700
- Error messages: Text-sm, text-red-500

### Component Styling

**Form Cards**:
- Background: White
- Border radius: 1rem (rounded-xl)
- Padding: 2rem (p-8)
- Shadow: Standard card shadow
- Border: Subtle gray border

**Input Fields**:
- Height: 2.25rem (h-9)
- Border radius: 0.375rem (rounded-md)
- Border: Gray-300, focus state with green accent
- Padding: 0.75rem horizontal (px-3)

**Buttons**:
- Primary: Green gradient background
- Height: 2.5rem (h-10)
- Border radius: 0.375rem (rounded-md)
- Full width on forms
- Hover and focus states with darker green

## Error Handling

### Client-Side Validation

**Real-time Validation**:
- Validate fields on blur and input change
- Display error messages below each field
- Visual indicators (red borders) for invalid fields
- Prevent form submission if validation fails

**Error Message Display**:
- Clear, user-friendly error messages
- Positioned below each form field
- Red text color for visibility
- Icon indicators for error states

### Form Submission Errors

**Network Errors**:
- Display general error message at top of form
- Retry mechanism for failed requests
- Loading states during submission

**Authentication Errors**:
- Generic error messages for security
- Clear indication of failed login attempts
- Guidance for password reset (future feature)

## Testing Strategy

### Component Testing

**Unit Tests**:
- Form validation logic
- Component rendering with different props
- User interaction handling (form submission, navigation)
- Error state display

**Integration Tests**:
- Form submission flow
- Navigation between login and signup
- Responsive design behavior
- Accessibility compliance

### User Experience Testing

**Usability Tests**:
- Form completion time
- Error recovery scenarios
- Mobile device compatibility
- Keyboard navigation support

**Visual Regression Tests**:
- Component appearance across different screen sizes
- Color scheme consistency
- Typography and spacing accuracy

## Accessibility Considerations

### Form Accessibility

- Proper label associations with form fields
- ARIA attributes for error states
- Keyboard navigation support
- Screen reader compatibility
- Focus management and visual indicators

### Color and Contrast

- Sufficient color contrast ratios
- Error states not relying solely on color
- High contrast mode compatibility
- Text readability across all states

## Implementation Notes

### Existing Component Reuse

The design leverages existing UI components:
- `Card`, `CardHeader`, `CardContent` for layout structure
- `Input` component for form fields
- `Button` component for actions
- `Label` component for form labels

### Responsive Design

- Mobile-first approach using Tailwind CSS
- Breakpoint-specific styling adjustments
- Touch-friendly interface elements
- Optimized for various screen sizes

### Performance Considerations

- Minimal bundle size impact
- Efficient form validation
- Optimized re-rendering
- Lazy loading considerations for future routing implementation