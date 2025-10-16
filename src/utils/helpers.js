// Formater une date
export const formatDate = (date, format = 'full') => {
  const d = new Date(date)
  
  if (format === 'full') {
    return d.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (format === 'short') {
    return d.toLocaleDateString('fr-FR')
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  return d.toLocaleString('fr-FR')
}

// Formater les nombres avec séparateurs
export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number)
}

// Formater la monnaie en FCFA
export const formatCurrency = (amount) => {
  return `${formatNumber(amount, 0)} FCFA`
}

// Calculer le pourcentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Obtenir la couleur en fonction du pourcentage
export const getColorByPercentage = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'yellow'
  if (percentage >= 20) return 'orange'
  return 'red'
}

// Générer un ID unique
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Vérifier si un objet est vide
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

// Grouper un tableau par clé
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

// Trier un tableau d'objets
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

// Obtenir le statut de la batterie avec couleur
export const getBatteryStatus = (level) => {
  if (level >= 80) return { status: 'Excellente', color: 'green' }
  if (level >= 50) return { status: 'Bonne', color: 'yellow' }
  if (level >= 20) return { status: 'Faible', color: 'orange' }
  return { status: 'Critique', color: 'red' }
}

// Convertir les watts en kilowatts
export const wattsToKilowatts = (watts) => {
  return (watts / 1000).toFixed(2)
}

// Calculer le coût énergétique (200 FCFA par kWh en moyenne au Togo)
export const calculateEnergyCost = (kWh, pricePerKWh = 200) => {
  return Math.round(kWh * pricePerKWh)
}
