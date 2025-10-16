import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

// Route-level code splitting (lazy loading)
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Security = lazy(() => import('./pages/Security'))
const Devices = lazy(() => import('./pages/Devices'))
const Energy = lazy(() => import('./pages/Energy'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-aurion mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            </div>
          }>
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Routes privées avec Layout */}
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/security" element={<Security />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/energy" element={<Energy />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Redirection par défaut */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
