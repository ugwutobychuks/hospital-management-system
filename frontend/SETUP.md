# Frontend Setup Guide

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx          # Login form component
│   │   ├── LoginForm.css
│   │   ├── RegisterForm.jsx       # Registration form component
│   │   ├── RegisterForm.css
│   │   ├── FormInput.jsx          # Reusable form input component
│   │   ├── FormInput.css
│   │   ├── Alert.jsx              # Alert notification component
│   │   ├── Alert.css
│   │   └── ProtectedRoute.jsx     # Route protection component
│   ├── pages/
│   │   ├── AuthPage.jsx           # Auth page (login/register)
│   │   ├── AuthPage.css
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   └── Dashboard.css
│   ├── services/
│   │   └── authApi.js             # API service with axios
│   ├── store/
│   │   └── authStore.js           # Zustand auth state management
│   ├── hooks/
│   │   └── useProtectedRoute.js   # Custom hook for protected routes
│   ├── App.jsx                    # Main app component
│   ├── App.css
│   └── main.jsx                   # Entry point
├── .env.example                   # Environment variables template
├── vite.config.js                 # Vite configuration
├── package.json
└── index.html                     # HTML template
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the API URL in `.env` if needed:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### Authentication
- **Login Form** - Email and password validation
- **Register Form** - Create new user accounts with role selection
- **Form Validation** - Real-time client-side validation
- **Error Handling** - Comprehensive error messages

### State Management
- **Zustand Store** - Global auth state management
- **Persistent Storage** - Auth data persisted to localStorage
- **Token Management** - Automatic token handling in API requests

### API Integration
- **Axios Configuration** - Pre-configured with interceptors
- **Token Authentication** - Automatic token attachment to requests
- **Error Handling** - 401 redirect on token expiration
- **Base URL Configuration** - Environment-based API endpoint

### Components
- **FormInput** - Reusable input component with validation
- **Alert** - Notification component for messages
- **ProtectedRoute** - Route guard for authenticated pages
- **LoginForm** - Login interface
- **RegisterForm** - Registration interface

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Backend API Requirements

The backend should implement the following endpoints:

### Authentication Endpoints

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**POST /api/auth/register**
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**POST /api/auth/logout**
```json
Response:
{
  "message": "Logged out successfully"
}
```

**GET /api/auth/verify**
```json
Response:
{
  "valid": true,
  "user": { ... }
}
```

## Usage

### Login
1. Navigate to the app (it redirects to `/login` by default)
2. Enter email and password
3. Click "Sign In"
4. On success, redirected to `/dashboard`

### Register
1. Click "Create Account" on the login page
2. Fill in the registration form
3. Select a role
4. Click "Create Account"
5. On success, redirected to `/dashboard`

### Protected Routes
- Any route can be protected by wrapping with `<ProtectedRoute>`
- Redirects to login if not authenticated

### Using Auth Store

```javascript
import { useAuthStore } from './store/authStore';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <div>
      {user && <p>Welcome, {user.firstName}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Validation Rules

### Login Form
- Email: Valid email format required
- Password: Minimum 6 characters

### Register Form
- First Name: Required, non-empty
- Last Name: Required, non-empty
- Email: Valid email format required
- Password: Minimum 8 characters, must contain uppercase, lowercase, and numbers
- Confirm Password: Must match password field

## Error Handling

Errors are displayed using the Alert component with different types:
- `success` - Green alert
- `error` - Red alert
- `warning` - Yellow alert
- `info` - Blue alert

## CORS Configuration

If the backend is on a different domain, ensure CORS is configured:

Backend should allow:
- Origin: `http://localhost:5173` (or your frontend URL)
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization