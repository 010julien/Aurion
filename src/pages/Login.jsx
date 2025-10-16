import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import logo from '../images/logo.png'
import Arriere from '../images/arriere.jpeg'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Erreur de connexion')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" style={{
        backgroundImage: `url(${Arriere})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="max-w-md w-full" >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          
          <div className='flex flex-col items-center justify-center w-auto h-auto '>
          
            <img src={logo} alt="" className='w-[180px] h-[180px]'/>
          

            <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue sur Aurion
            </h1>
          </div>

          <p className="text-white">
            Connectez-vous pour gérer votre maison intelligente
          </p>
        </div>

        {/* Login Form */}
        <div className=" rounded-2xl shadow-xl p-8 border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.81)',
          border: '1px solid rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(10px)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Adresse e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              icon={Mail}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-aurion border-gray-300 rounded focus:ring-aurion"
                />
                <span className="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-aurion hover:text-aurion-dark font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Vous n'avez pas de compte ? </span>
            <Link
              to="/register"
              className="text-aurion hover:text-aurion-dark font-medium"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center mb-6">
          <p className="text-sm text-white">
            Mode démo : Utilisez n'importe quel email et mot de passe
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
