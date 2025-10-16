# Aurion - Application de Domotique Intelligente

🏠 **Aurion** est une application web moderne de domotique conçue pour le marché togolais, permettant la surveillance, le contrôle et l'optimisation de votre maison intelligente.

## 🌟 Fonctionnalités

### 1. **Surveillance et Sécurité**
- Affichage en temps réel de l'état des capteurs (mouvement, fumée, incendie)
- Notifications instantanées en cas de détection d'anomalie
- Historique complet des alertes et événements
- Gestion multi-zones (salon, chambre, cuisine, etc.)

### 2. **Contrôle des Appareils**
- Contrôle à distance de tous les appareils connectés
- Programmation d'horaires pour automatiser les actions
- Mode "Absence" pour simuler une présence
- Gestion par pièces et zones

### 3. **Suivi Énergétique**
- Consommation en temps réel des appareils
- Graphiques et historiques de consommation
- Alertes de surconsommation
- Statistiques détaillées et recommandations

### 4. **Interface Moderne**
- Design responsive (mobile, tablette, desktop)
- Interface intuitive et claire
- Thème personnalisable
- Support multilingue (français)

### 5. **Fonctionnalités Avancées**
- Intégration météo locale
- Contrôle multi-utilisateur avec niveaux d'accès
- Gestion flexible des capteurs et appareils
- Mode automatique basé sur des scénarios

## 🚀 Technologies Utilisées

- **Frontend:** React 18.2 avec Hooks
- **Routing:** React Router v6
- **Styling:** TailwindCSS 3.4
- **Graphiques:** Recharts
- **Icônes:** Lucide React
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Communication IoT:** MQTT support

## 📦 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- Backend API configuré (voir section Backend)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   cd AURION
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   
   Créer un fichier `.env` à la racine :
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_MQTT_URL=ws://localhost:9001
   VITE_WEATHER_API_KEY=votre_cle_api_meteo
   ```

4. **Lancer l'application en développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`

5. **Build pour la production**
   ```bash
   npm run build
   ```

## 🏗️ Structure du Projet

```
AURION/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── common/      # Composants génériques (Card, Button, etc.)
│   │   ├── dashboard/   # Composants du tableau de bord
│   │   ├── security/    # Composants de sécurité
│   │   ├── devices/     # Composants des appareils
│   │   ├── energy/      # Composants énergétiques
│   │   ├── Layout.jsx   # Layout principal avec navigation
│   │   └── PrivateRoute.jsx
│   ├── contexts/        # Contextes React (Auth, App)
│   ├── pages/          # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Security.jsx
│   │   ├── Devices.jsx
│   │   ├── Energy.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/       # Services API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── deviceService.js
│   │   ├── securityService.js
│   │   ├── energyService.js
│   │   └── mqttService.js
│   ├── utils/          # Utilitaires et helpers
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔌 Configuration Backend

L'application communique avec un backend via API REST. Voici les endpoints requis :

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur connecté

### Appareils
- `GET /api/devices` - Liste des appareils
- `POST /api/devices/:id/toggle` - Allumer/éteindre un appareil
- `POST /api/devices/:id/schedule` - Programmer un appareil
- `GET /api/devices/:id/status` - État d'un appareil

### Sécurité
- `GET /api/security/sensors` - Liste des capteurs de sécurité
- `GET /api/security/alerts` - Historique des alertes
- `POST /api/security/alerts/:id/acknowledge` - Acquitter une alerte
- `GET /api/security/stats` - Statistiques de sécurité

### Énergie
- `GET /api/energy/consumption` - Consommation actuelle
- `GET /api/energy/history` - Historique de consommation
- `GET /api/energy/stats` - Statistiques énergétiques
- `GET /api/energy/forecast` - Prévisions

### Paramètres
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Modifier les paramètres
- `GET /api/weather` - Données météo locales

### WebSocket / MQTT
Pour les mises à jour en temps réel :
- Connexion MQTT sur le topic `aurion/devices/#`
- WebSocket sur `/ws` pour les notifications instantanées

## 👥 Utilisateurs & Authentification

L'application supporte plusieurs niveaux d'accès :
- **Admin** : Accès complet, gestion des utilisateurs
- **Utilisateur** : Contrôle des appareils et consultation
- **Invité** : Consultation uniquement

Le token JWT est stocké dans localStorage et envoyé dans l'en-tête Authorization.

## 📱 Responsive Design

L'application est optimisée pour :
- **Mobile** : 320px - 767px
- **Tablette** : 768px - 1023px
- **Desktop** : 1024px+

Navigation adaptative avec menu hamburger sur mobile.

## 🎨 Personnalisation

### Couleurs
Modifier les couleurs dans `tailwind.config.js` :
```javascript
colors: {
  aurion: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  }
}
```

### Composants
Tous les composants sont modulaires et réutilisables. Consultez `/src/components/common/` pour les composants de base.

## 🔒 Sécurité

- Authentification JWT
- Validation des entrées
- Protection CSRF
- Communication HTTPS en production
- Gestion sécurisée des tokens

## 📊 Graphiques & Visualisations

Les graphiques utilisent **Recharts** pour afficher :
- Consommation énergétique en temps réel
- Historiques de consommation (jour, semaine, mois)
- Comparaisons et tendances
- Répartition par appareil

## 🌍 Adaptation au Marché Togolais

- Interface en français
- Intégration météo locale (Lomé)
- Gestion des coupures de courant
- Mode économie d'énergie
- Notifications SMS optionnelles
- Support FCFA pour les coûts énergétiques

## 🚧 Développement

### Commandes disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code
```

### Ajouter un nouveau composant
```bash
# Créer le composant dans src/components/
# Importer et utiliser dans les pages
```

## 📞 Support & Contact

Pour toute question ou suggestion concernant Aurion :
- Email: support@aurion.tg
- Documentation: https://docs.aurion.tg

## 📄 Licence

© 2025 Aurion - Tous droits réservés

---

**Développé avec ❤️ pour le marché togolais**
