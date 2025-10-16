import { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Mail,
  Lock,
  Globe,
  Save,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Toggle from '../components/common/Toggle'
import Badge from '../components/common/Badge'

const Settings = () => {
  const { user, logout, updateProfile } = useAuth()
  const { settings, updateSettings } = useApp()

  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'preferences', name: 'Préférences', icon: Globe },
  ]

  const handleSaveProfile = async () => {
    setSaving(true)
    await updateProfile(profileData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-aurion text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
            <hr className="my-4" />
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-aurion to-aurion-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <Badge variant="success" className="mt-1">Compte actif</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <Input label="Nom complet" value={profileData.name} 
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} icon={User} />
                <Input label="Adresse e-mail" type="email" value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} icon={Mail} />
                <Input label="Téléphone" type="tel" value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} icon={Smartphone} />
                <Button onClick={handleSaveProfile} loading={saving} icon={Save}>Enregistrer</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications e-mail</h3>
                    <p className="text-sm text-gray-600">Recevoir des alertes par e-mail</p>
                  </div>
                  <Toggle enabled={settings.notifications.email}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, email: v }})} />
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications push</h3>
                    <p className="text-sm text-gray-600">Recevoir des notifications dans le navigateur</p>
                  </div>
                  <Toggle enabled={settings.notifications.push}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, push: v }})} />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sécurité</h2>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">Compte sécurisé</h3>
                      <p className="text-sm text-green-700">Votre compte est protégé</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" fullWidth>Changer le mot de passe</Button>
                <Button variant="danger" fullWidth>Déconnecter tous les appareils</Button>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {settings.theme === 'dark' ? (
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gray-300" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-yellow-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">Mode {settings.theme === 'dark' ? 'Sombre' : 'Clair'}</h3>
                      <p className="text-sm text-gray-600">
                        {settings.theme === 'dark' ? 'Thème sombre activé' : 'Thème clair activé'}
                      </p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.theme === 'dark'} 
                    onChange={(v) => updateSettings({ theme: v ? 'dark' : 'light' })} 
                  />
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode automatique</h3>
                    <p className="text-sm text-gray-600">Automatiser les appareils</p>
                  </div>
                  <Toggle enabled={settings.autoMode} onChange={(v) => updateSettings({ autoMode: v })} />
                </div>
                <hr />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Langue</h3>
                  <select value={settings.language} onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
