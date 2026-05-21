# Hospital Management System - Frontend

React-based frontend application for the Hospital Management System.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update API URL in `.env` (if needed)
```
VITE_API_URL=http://localhost:3000/api/v1
```

5. Start development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Patients.jsx
│   │   └── NotFound.jsx
│   ├── store/               # Zustand stores
│   │   └── authStore.js
│   ├── utils/               # Utility functions
│   │   └── api.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies
```

## 🏗️ Architecture

- **React 18** - UI library
- **Vite** - Fast build tool
- **React Router v6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## 🔐 Authentication

The app uses JWT token-based authentication:
- Tokens are stored in localStorage
- Automatically added to API requests
- Auto-logout on 401 responses
- Protected routes require authentication

## 📚 Key Features Implemented

- ✅ User Authentication (Login/Register)
- ✅ Protected Routes with Role-based Access
- ✅ Patient Management Dashboard
- ✅ Patient Search and Filtering
- ✅ Add New Patient Form
- ✅ Responsive Design
- ✅ Toast Notifications
- ✅ System Status Display

## 🔄 API Integration

All API calls are handled through the axios instance in `src/utils/api.js`:

```javascript
import api from './utils/api';

// Example usage
const response = await api.get('/patients');
const result = await api.post('/patients', data);
```

## 🎨 Styling

Using Tailwind CSS with custom configuration:
- Custom color scheme (primary, secondary, success, danger, warning)
- Responsive breakpoints
- Custom components via @apply

## 📦 Building for Production

```bash
npm run build
```

Creates an optimized build in the `dist/` directory.

## 🧪 Development

```bash
npm run dev      # Start dev server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🚀 Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Docker container

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:3000/api/v1 | Backend API URL |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Format with `npm run format`
4. Lint with `npm run lint`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
