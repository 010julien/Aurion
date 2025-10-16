# 🔌 Exemple de Backend pour Aurion

Ce document fournit des exemples de code pour créer un backend compatible avec Aurion.

## 🛠️ Technologies Recommandées

- **Node.js + Express** (le plus simple)
- **Python + Flask/FastAPI** (alternative)
- **PHP + Laravel** (alternative)

## 📦 Backend Node.js/Express

### Installation

```bash
mkdir aurion-backend
cd aurion-backend
npm init -y
npm install express cors jsonwebtoken bcrypt mqtt
```

### Structure du Projet

```
aurion-backend/
├── server.js
├── routes/
│   ├── auth.js
│   ├── devices.js
│   ├── security.js
│   └── energy.js
├── models/
│   ├── User.js
│   ├── Device.js
│   └── Sensor.js
└── middleware/
    └── auth.js
```

### Code Exemple - server.js

```javascript
const express = require('express')
const cors = require('cors')
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/devices', require('./routes/devices'))
app.use('/api/security', require('./routes/security'))
app.use('/api/energy', require('./routes/energy'))

// Démarrer le serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
})
```

### routes/auth.js

```javascript
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Base de données simulée
const users = []
const JWT_SECRET = 'votre_secret_jwt_super_securise'

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Vérifier si l'utilisateur existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    }
    users.push(user)

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Trouver l'utilisateur
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Générer le token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.userId)
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  })
})

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' })
    }
    req.userId = decoded.userId
    next()
  })
}

module.exports = router
```

### routes/devices.js

```javascript
const express = require('express')
const router = express.Router()

// Base de données simulée
let devices = [
  { id: 1, name: 'Lumière Salon', type: 'light', room: 'Salon', status: true, power: 60 },
  { id: 2, name: 'Climatiseur Chambre', type: 'climate', room: 'Chambre', status: false, power: 1200 },
  { id: 3, name: 'TV Salon', type: 'entertainment', room: 'Salon', status: true, power: 150 }
]

// GET /api/devices - Obtenir tous les appareils
router.get('/', (req, res) => {
  res.json(devices)
})

// POST /api/devices/:id/toggle - Allumer/éteindre un appareil
router.post('/:id/toggle', (req, res) => {
  const device = devices.find(d => d.id === parseInt(req.params.id))
  
  if (!device) {
    return res.status(404).json({ message: 'Appareil non trouvé' })
  }

  device.status = !device.status
  
  // Ici, vous enverriez une commande MQTT à l'appareil physique
  // mqttClient.publish(`aurion/devices/${device.id}/command`, JSON.stringify({ status: device.status }))

  res.json(device)
})

// POST /api/devices/:id/schedule - Programmer un appareil
router.post('/:id/schedule', (req, res) => {
  const { type, time, action, days } = req.body
  const device = devices.find(d => d.id === parseInt(req.params.id))
  
  if (!device) {
    return res.status(404).json({ message: 'Appareil non trouvé' })
  }

  // Sauvegarder la programmation dans la base de données
  const schedule = {
    deviceId: device.id,
    type,
    time,
    action,
    days,
    createdAt: new Date()
  }

  res.json({ message: 'Programmation enregistrée', schedule })
})

module.exports = router
```

### routes/security.js

```javascript
const express = require('express')
const router = express.Router()

// Base de données simulée
const sensors = [
  { id: 1, name: 'Détecteur de Mouvement - Entrée', type: 'motion', location: 'Entrée', 
    status: 'active', battery: 85 },
  { id: 2, name: 'Détecteur de Fumée - Cuisine', type: 'smoke', location: 'Cuisine', 
    status: 'active', battery: 92 }
]

const alerts = []

// GET /api/security/sensors
router.get('/sensors', (req, res) => {
  res.json(sensors)
})

// GET /api/security/alerts
router.get('/alerts', (req, res) => {
  const limit = parseInt(req.query.limit) || 50
  res.json(alerts.slice(0, limit))
})

// POST /api/security/alerts/:id/acknowledge
router.post('/alerts/:id/acknowledge', (req, res) => {
  const alert = alerts.find(a => a.id === parseInt(req.params.id))
  
  if (!alert) {
    return res.status(404).json({ message: 'Alerte non trouvée' })
  }

  alert.acknowledged = true
  alert.acknowledgedAt = new Date()

  res.json(alert)
})

// GET /api/security/stats
router.get('/stats', (req, res) => {
  res.json({
    totalSensors: sensors.length,
    activeSensors: sensors.filter(s => s.status === 'active').length,
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length
  })
})

module.exports = router
```

### routes/energy.js

```javascript
const express = require('express')
const router = express.Router()

// GET /api/energy/consumption
router.get('/consumption', (req, res) => {
  res.json({
    current: 2.4,
    today: 18.5,
    cost: 3700,
    trend: 'up',
    trendPercentage: 12
  })
})

// GET /api/energy/history
router.get('/history', (req, res) => {
  const period = req.query.period || '7d'
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      timestamp: date,
      consumption: 15 + Math.random() * 10,
      cost: Math.round((15 + Math.random() * 10) * 200)
    })
  }

  res.json(data)
})

// GET /api/energy/stats
router.get('/stats', (req, res) => {
  res.json({
    totalConsumption: 425.8,
    totalCost: 85160,
    averageDaily: 14.2,
    comparedToLastMonth: -8,
    peakHour: '19:00',
    peakConsumption: 3.2,
    efficiency: 78
  })
})

module.exports = router
```

## 🔌 Intégration MQTT

Pour communiquer avec des appareils IoT réels :

```javascript
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  console.log('✅ Connecté au broker MQTT')
  client.subscribe('aurion/devices/+/status')
  client.subscribe('aurion/sensors/+/data')
})

client.on('message', (topic, message) => {
  console.log(`Message reçu sur ${topic}:`, message.toString())
  
  // Traiter les messages des capteurs
  if (topic.includes('sensors')) {
    const sensorData = JSON.parse(message.toString())
    // Sauvegarder dans la base de données
    // Envoyer une notification si nécessaire
  }
})

// Envoyer une commande à un appareil
function controlDevice(deviceId, status) {
  client.publish(`aurion/devices/${deviceId}/command`, JSON.stringify({ status }))
}
```

## 💾 Base de Données

Pour une application en production, utilisez une vraie base de données :

### MongoDB avec Mongoose

```javascript
const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  name: String,
  type: String,
  room: String,
  status: Boolean,
  power: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Device = mongoose.model('Device', DeviceSchema)

// Connexion
mongoose.connect('mongodb://localhost/aurion', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

### PostgreSQL avec Sequelize

```javascript
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('aurion', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres'
})

const Device = sequelize.define('Device', {
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  room: DataTypes.STRING,
  status: DataTypes.BOOLEAN,
  power: DataTypes.INTEGER
})
```

## 🚀 Lancement

```bash
node server.js
```

Le backend sera accessible sur http://localhost:5000

## 📡 WebSocket pour les notifications en temps réel

```javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Client connecté')

  // Envoyer une notification
  function sendNotification(message) {
    ws.send(JSON.stringify({
      type: 'notification',
      message: message,
      timestamp: new Date()
    }))
  }

  // Exemple: alerte de mouvement
  setTimeout(() => {
    sendNotification('Mouvement détecté dans l\'entrée')
  }, 5000)
})
```

---

**Ce code est un exemple de base. Pour une application en production, ajoutez :**
- Validation des données
- Gestion d'erreurs robuste
- Tests unitaires
- Documentation API (Swagger)
- Rate limiting
- Logging
- Sécurité renforcée
