import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (err) {
        console.error('Erreur de vérification auth:', err)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Connexion
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authService.login(email, password)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('demo_user', JSON.stringify(response.user))
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur de connexion'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Inscription
  const register = async (userData) => {
    try {
      setError(null)
      const response = await authService.register(userData)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('demo_user', JSON.stringify(response.user))
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'inscription'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Déconnexion
  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('demo_user')
  }

  // Mettre à jour le profil utilisateur
  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates)
      setUser(updatedUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
