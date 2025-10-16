# ⚡ Démarrage Rapide - Aurion

## 🎉 Félicitations !

Votre application de domotique **Aurion** est prête ! Voici comment la lancer en 3 étapes simples.

## 🚀 Étapes de Démarrage

### 1️⃣ Installer les dépendances

Ouvrez PowerShell dans le dossier AURION et exécutez :

```powershell
npm install
```

⏳ Patientez pendant l'installation (2-5 minutes)

### 2️⃣ Lancer l'application

```powershell
npm run dev
```

✅ L'application s'ouvrira automatiquement dans votre navigateur sur **http://localhost:3000**

### 3️⃣ Se connecter

Sur la page de connexion, utilisez **n'importe quel** email et mot de passe :

- **Email** : `demo@aurion.tg`
- **Mot de passe** : `password`

🎯 **C'est tout !** Vous pouvez maintenant explorer l'application.

## 📱 Pages Disponibles

### 📊 Dashboard
Vue d'ensemble de votre maison avec :
- Statistiques en temps réel
- État des appareils par pièce
- Activité récente
- Mode absence

### 🛡️ Sécurité
- Liste des capteurs (mouvement, fumée, incendie)
- Historique des alertes
- Filtres et export
- État des batteries

### 💡 Appareils
- Contrôle de tous les appareils
- Allumer/éteindre en un clic
- Programmation horaire
- Organisation par pièce

### ⚡ Énergie
- Consommation en temps réel
- Graphiques interactifs
- Répartition par appareil
- Recommandations d'économie

### ⚙️ Paramètres
- Profil utilisateur
- Notifications
- Sécurité du compte
- Préférences

## 🎨 Fonctionnalités Clés

✅ **Design Moderne** - Interface élégante avec TailwindCSS
✅ **Responsive** - Fonctionne sur mobile, tablette et desktop
✅ **Temps Réel** - Données mockées pour simulation réaliste
✅ **Interactif** - Graphiques avec Recharts
✅ **Notifications** - Système d'alertes intégré
✅ **Mode Absence** - Simulation de présence
✅ **Programmation** - Automatisation des appareils

## 🛠️ Commandes Utiles

```powershell
# Lancer en développement
npm run dev

# Créer un build de production
npm run build

# Prévisualiser le build
npm run preview

# Vérifier le code
npm run lint
```

## 📂 Structure du Projet

```
AURION/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── common/       # Boutons, Cards, etc.
│   │   ├── Layout.jsx    # Navigation principale
│   │   └── ...
│   ├── pages/           # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Security.jsx
│   │   ├── Devices.jsx
│   │   ├── Energy.jsx
│   │   └── Settings.jsx
│   ├── services/        # Communication API
│   ├── contexts/        # État global (Auth, App)
│   └── utils/           # Fonctions utilitaires
├── public/              # Fichiers statiques
├── README.md            # Documentation complète
├── GUIDE_INSTALLATION.md  # Guide détaillé
└── BACKEND_EXEMPLE.md   # Exemples backend
```

## 🔧 Personnalisation

### Changer les couleurs

Éditez `tailwind.config.js` :

```javascript
colors: {
  aurion: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  }
}
```

### Modifier les données mockées

Les données de démonstration sont dans :
- `src/services/deviceService.js`
- `src/services/securityService.js`
- `src/services/energyService.js`

## 🌐 Connexion à un Backend

L'application fonctionne en standalone avec des données mockées.

Pour connecter un vrai backend :

1. Créez un fichier `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

2. Consultez `BACKEND_EXEMPLE.md` pour des exemples de code

3. L'application basculera automatiquement sur l'API réelle

## 📱 Test sur Mobile

Pour tester sur votre smartphone :

```powershell
# Trouvez votre IP
ipconfig

# Lancez avec --host
npm run dev -- --host
```

Puis accédez à `http://VOTRE_IP:3000` depuis votre mobile.

## 🎯 Prochaines Étapes

### Pour le développement :
1. ✅ Testez toutes les fonctionnalités
2. ✅ Adaptez les couleurs à vos besoins
3. ✅ Ajoutez vos propres pièces/appareils
4. ✅ Connectez un backend réel

### Pour la production :
1. Créez un build : `npm run build`
2. Déployez sur Vercel, Netlify ou autre
3. Configurez un backend sécurisé
4. Ajoutez un vrai système MQTT pour l'IoT

## 📚 Documentation

- 📖 **README.md** - Documentation complète du projet
- 🚀 **GUIDE_INSTALLATION.md** - Installation détaillée
- 🔌 **BACKEND_EXEMPLE.md** - Exemples de backend

## 💡 Conseils

### Performance
- L'application est optimisée avec Vite
- Le rechargement à chaud (HMR) est activé
- Les images sont optimisées automatiquement

### Développement
- Utilisez React DevTools pour le debugging
- Les erreurs s'affichent dans la console
- Le code est formaté avec des standards modernes

### Production
- Minification automatique avec `npm run build`
- Optimisation des assets
- Support des navigateurs modernes

## 🆘 Besoin d'Aide ?

### Problèmes courants :

**L'application ne démarre pas**
```powershell
# Supprimez node_modules et réinstallez
Remove-Item -Recurse -Force node_modules
npm install
```

**Port 3000 déjà utilisé**
```powershell
# Changez le port dans vite.config.js
server: { port: 3001 }
```

**Erreurs TypeScript**
```powershell
# C'est normal, le projet utilise JavaScript
# Les erreurs n'empêchent pas l'exécution
```

## ✨ Fonctionnalités Avancées

### Mode Absence
Active automatiquement :
- Simulation de présence (lumières aléatoires)
- Désactivation des appareils non essentiels
- Alertes renforcées

### Notifications
Système de notifications pour :
- Alertes de sécurité
- Surconsommation énergétique
- Rappels de maintenance
- Changements d'état

### Graphiques
- Consommation en temps réel
- Historiques configurables (24h, 7j, 30j)
- Répartition par appareil
- Export des données

## 🎓 Technologies Utilisées

- **React 18.2** - Framework UI
- **TailwindCSS 3.4** - Styling
- **Vite 5** - Build tool ultra-rapide
- **Recharts** - Graphiques
- **Lucide React** - Icônes modernes
- **Axios** - Requêtes HTTP
- **React Router** - Navigation
- **date-fns** - Gestion des dates

## 🌟 Points Forts

✨ **Interface Intuitive** - Design pensé pour les utilisateurs togolais
✨ **Performance** - Chargement ultra-rapide avec Vite
✨ **Modulaire** - Composants réutilisables
✨ **Sécurisé** - Authentification JWT ready
✨ **Évolutif** - Architecture scalable
✨ **Professionnel** - Code propre et commenté

## 📞 Support

Pour toute question :
1. Consultez la documentation dans le dossier
2. Vérifiez les fichiers d'aide (.md)
3. Examinez les exemples de code

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé
- [ ] `npm install` exécuté
- [ ] `npm run dev` lancé
- [ ] Application accessible sur http://localhost:3000
- [ ] Connexion réussie
- [ ] Pages explorées
- [ ] Fonctionnalités testées

---

**🎉 Profitez d'Aurion - Votre maison intelligente ! 🏠⚡**

*Développé avec ❤️ pour le marché togolais*
