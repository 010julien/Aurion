# 🚀 Guide d'Installation - Aurion

Ce guide vous accompagne pas à pas pour installer et lancer l'application Aurion sur votre machine.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **npm** ou **yarn** (généralement inclus avec Node.js)
- Un éditeur de code (VS Code recommandé)

Pour vérifier si Node.js est installé :
```bash
node --version
npm --version
```

## 📥 Installation

### Étape 1 : Installer les dépendances

Ouvrez un terminal dans le dossier AURION et exécutez :

```bash
npm install
```

Cette commande va installer toutes les dépendances nécessaires (React, TailwindCSS, Recharts, etc.).

⏳ L'installation peut prendre quelques minutes selon votre connexion internet.

### Étape 2 : Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Ou créez manuellement un fichier .env
```

Contenu du fichier `.env` :
```env
VITE_API_URL=http://localhost:5000/api
VITE_MQTT_URL=ws://localhost:9001
VITE_WEATHER_API_KEY=votre_cle_api
VITE_ENV=development
```

**Note :** En mode développement, l'application utilise des données mockées. Vous n'avez pas besoin de backend pour tester l'interface.

## ▶️ Lancement de l'application

### Mode Développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

Le serveur de développement se lance avec le rechargement automatique (Hot Reload).

### Build Production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualiser le Build

Pour tester le build de production localement :

```bash
npm run preview
```

## 🎯 Utilisation de l'Application

### Connexion

L'application démarre sur la page de connexion.

**En mode démo :** Vous pouvez utiliser n'importe quel email et mot de passe pour vous connecter.

Exemple :
- Email : `demo@aurion.tg`
- Mot de passe : `password123`

### Navigation

Une fois connecté, vous avez accès à 5 pages principales :

1. **📊 Dashboard** - Vue d'ensemble de votre maison
2. **🛡️ Sécurité** - Gestion des capteurs et alertes
3. **💡 Appareils** - Contrôle des appareils connectés
4. **⚡ Énergie** - Suivi de la consommation énergétique
5. **⚙️ Paramètres** - Configuration du compte

## 🔧 Configuration Backend (Optionnel)

L'application fonctionne en mode standalone avec des données mockées. Pour connecter un vrai backend :

### Structure API Requise

Votre backend doit exposer les endpoints suivants :

#### Authentification
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

#### Appareils
- `GET /api/devices`
- `POST /api/devices/:id/toggle`
- `POST /api/devices/:id/schedule`

#### Sécurité
- `GET /api/security/sensors`
- `GET /api/security/alerts`
- `POST /api/security/alerts/:id/acknowledge`

#### Énergie
- `GET /api/energy/consumption`
- `GET /api/energy/history`
- `GET /api/energy/stats`

### Exemple de Backend (Node.js/Express)

```javascript
// server.js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Exemple d'endpoint
app.get('/api/devices', (req, res) => {
  res.json([
    { id: 1, name: 'Lumière Salon', status: true, power: 60 }
  ])
})

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000')
})
```

Modifiez ensuite votre `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Résolution de Problèmes

### Erreur : "npm command not found"
**Solution :** Installez Node.js depuis [nodejs.org](https://nodejs.org/)

### Erreur : "Port 3000 already in use"
**Solution :** Changez le port dans `vite.config.js` :
```javascript
server: {
  port: 3001
}
```

### L'application ne charge pas
**Solution :** 
1. Vérifiez que toutes les dépendances sont installées : `npm install`
2. Supprimez `node_modules` et réinstallez : 
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

### Erreurs de build
**Solution :** Nettoyez le cache :
```bash
npm run build -- --force
```

## 📱 Test sur Mobile

Pour tester sur votre smartphone (même réseau WiFi) :

1. Trouvez votre IP locale :
   ```bash
   # Windows
   ipconfig
   ```

2. Lancez l'app :
   ```bash
   npm run dev -- --host
   ```

3. Accédez depuis votre mobile : `http://VOTRE_IP:3000`

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `tailwind.config.js` :
```javascript
colors: {
  aurion: {
    light: '#60a5fa',    // Bleu clair
    DEFAULT: '#3b82f6',  // Bleu principal
    dark: '#1e40af',     // Bleu foncé
  }
}
```

### Modifier le Logo

Remplacez le composant Zap dans `src/components/Layout.jsx` par votre logo.

## 📚 Ressources

- **Documentation React** : https://react.dev
- **Documentation TailwindCSS** : https://tailwindcss.com
- **Documentation Recharts** : https://recharts.org
- **Lucide Icons** : https://lucide.dev

## 🆘 Support

Pour toute question ou problème :
- Consultez la documentation dans le dossier `/docs`
- Vérifiez les issues GitHub
- Contactez l'équipe de support

## ✅ Checklist de Démarrage

- [ ] Node.js installé (v18+)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé
- [ ] Application lancée (`npm run dev`)
- [ ] Connexion réussie sur http://localhost:3000
- [ ] Test de toutes les pages
- [ ] Application responsive testée

---

**Bonne utilisation d'Aurion ! 🎉**
