import mqtt from 'mqtt'

class MQTTService {
  constructor() {
    this.client = null
    this.connected = false
    this.subscribers = new Map()
  }

  // Connexion au broker MQTT
  connect(url = import.meta.env.VITE_MQTT_URL) {
    if (this.connected) {
      console.log('Déjà connecté au broker MQTT')
      return
    }

    try {
      this.client = mqtt.connect(url, {
        keepalive: 60,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      })

      this.client.on('connect', () => {
        console.log('✅ Connecté au broker MQTT')
        this.connected = true
        // S'abonner aux topics par défaut
        this.subscribeToDefaultTopics()
      })

      this.client.on('error', (error) => {
        console.error('❌ Erreur MQTT:', error)
        this.connected = false
      })

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message)
      })

      this.client.on('close', () => {
        console.log('Connexion MQTT fermée')
        this.connected = false
      })

      this.client.on('offline', () => {
        console.log('Client MQTT hors ligne')
        this.connected = false
      })

      this.client.on('reconnect', () => {
        console.log('Reconnexion au broker MQTT...')
      })

    } catch (error) {
      console.error('Erreur lors de la connexion MQTT:', error)
    }
  }

  // S'abonner aux topics par défaut
  subscribeToDefaultTopics() {
    const defaultTopics = [
      'aurion/devices/+/status',
      'aurion/sensors/+/data',
      'aurion/alerts/+',
      'aurion/energy/consumption',
    ]

    defaultTopics.forEach(topic => {
      this.subscribe(topic)
    })
  }

  // S'abonner à un topic
  subscribe(topic, callback) {
    if (!this.client || !this.connected) {
      console.warn('Client MQTT non connecté')
      return
    }

    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error(`Erreur d'abonnement au topic ${topic}:`, error)
      } else {
        console.log(`✅ Abonné au topic: ${topic}`)
        
        if (callback) {
          if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, [])
          }
          this.subscribers.get(topic).push(callback)
        }
      }
    })
  }

  // Se désabonner d'un topic
  unsubscribe(topic) {
    if (!this.client) return

    this.client.unsubscribe(topic, (error) => {
      if (error) {
        console.error(`Erreur de désabonnement du topic ${topic}:`, error)
      } else {
        console.log(`Désabonné du topic: ${topic}`)
        this.subscribers.delete(topic)
      }
    })
  }

  // Publier un message
  publish(topic, message, options = {}) {
    if (!this.client || !this.connected) {
      console.warn('Client MQTT non connecté')
      return
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message)

    this.client.publish(topic, payload, options, (error) => {
      if (error) {
        console.error(`Erreur de publication sur ${topic}:`, error)
      } else {
        console.log(`📤 Message publié sur ${topic}`)
      }
    })
  }

  // Gérer les messages reçus
  handleMessage(topic, message) {
    try {
      const payload = JSON.parse(message.toString())
      console.log(`📨 Message reçu sur ${topic}:`, payload)

      // Appeler les callbacks enregistrés pour ce topic
      this.subscribers.forEach((callbacks, subscribedTopic) => {
        if (this.topicMatch(topic, subscribedTopic)) {
          callbacks.forEach(callback => callback(topic, payload))
        }
      })
    } catch (error) {
      console.error('Erreur lors du traitement du message:', error)
    }
  }

  // Vérifier si un topic correspond au pattern
  topicMatch(topic, pattern) {
    const topicParts = topic.split('/')
    const patternParts = pattern.split('/')

    if (patternParts.length > topicParts.length) return false

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true
      if (patternParts[i] !== '+' && patternParts[i] !== topicParts[i]) {
        return false
      }
    }

    return patternParts.length === topicParts.length
  }

  // Déconnexion
  disconnect() {
    if (this.client) {
      this.client.end()
      this.connected = false
      this.subscribers.clear()
      console.log('Déconnecté du broker MQTT')
    }
  }

  // Vérifier l'état de connexion
  isConnected() {
    return this.connected
  }
}

// Instance singleton
const mqttService = new MQTTService()

export default mqttService
