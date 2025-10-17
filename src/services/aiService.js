// Local AI-like analysis service (front-only, no backend)
// Generates actionable recommendations based on current state

export const aiService = {
  generateRecommendations: ({ devices = [], energyData = {}, sensors = [], alerts = [], settings = {} }) => {
    const recs = []

    // Helper
    const now = new Date()
    const hour = now.getHours()
    const isNight = hour >= 22 || hour < 6

    // 1) Energy usage high
    if (energyData.current && energyData.current > 2.5) {
      recs.push({
        id: 'energy-high',
        title: 'Réduisez la consommation actuelle',
        details: `La consommation instantanée est de ${energyData.current} kW. Éteignez les appareils non essentiels pour réduire la facture.`,
        severity: 'warning',
        actions: suggestDeviceSwitches(devices),
      })
    }

    // 2) Idle lights at night
    const activeLights = devices.filter(d => d.type === 'light' && d.status)
    if (isNight && activeLights.length > 0) {
      recs.push({
        id: 'lights-night',
        title: 'Lumières allumées la nuit',
        details: `${activeLights.length} lumière(s) sont allumées alors qu'il est tard. Pensez à les éteindre.`,
        severity: 'info',
        actions: activeLights.slice(0, 3).map(d => ({ type: 'toggle', deviceId: d.id, label: `Éteindre ${d.name}` })),
      })
    }

    // 3) Security alerts
    const unack = alerts.filter(a => !a.acknowledged)
    if (unack.length > 0) {
      recs.push({
        id: 'security-alerts',
        title: 'Alertes de sécurité non acquittées',
        details: `Vous avez ${unack.length} alerte(s) en attente.`,
        severity: 'critical',
        actions: [{ type: 'navigate', to: '/security', label: 'Voir les alertes' }],
      })
    }

    // 4) Away mode suggestion
    const anyOn = devices.some(d => d.status)
    if (!settings.awayMode && isWorkHours(hour) && anyOn) {
      recs.push({
        id: 'away-mode',
        title: 'Activer le Mode Absence',
        details: 'Vous semblez absent(e). Activez le Mode Absence pour économiser de l’énergie et sécuriser votre maison.',
        severity: 'info',
        actions: [{ type: 'away', enabled: true, label: 'Activer le Mode Absence' }],
      })
    }

    // 5) Sensor maintenance
    const lowBattery = sensors.filter(s => typeof s.battery === 'number' && s.battery <= 50)
    if (lowBattery.length > 0) {
      recs.push({
        id: 'sensor-battery',
        title: 'Capteurs à batterie faible',
        details: `${lowBattery.length} capteur(s) ont une batterie ≤ 50%.`,
        severity: 'warning',
        actions: lowBattery.slice(0, 3).map(s => ({ type: 'note', label: `Remplacer pile: ${s.name}` })),
      })
    }

    // 6) Peak hours suggestion (mock rule)
    if (isPeakHour(hour)) {
      recs.push({
        id: 'peak-hour',
        title: 'Heure de pointe',
        details: 'Évitez d’utiliser des appareils énergivores pendant les heures de pointe pour réduire les coûts.',
        severity: 'info',
        actions: suggestDeviceSwitches(devices, { highPowerOnly: true }),
      })
    }

    return recs
  },
}

function suggestDeviceSwitches(devices, opts = {}) {
  const highPowerOnly = !!opts.highPowerOnly
  const candidates = devices.filter(d => d.status && (!highPowerOnly || (d.power && d.power >= 100)))
  return candidates.slice(0, 3).map(d => ({ type: 'toggle', deviceId: d.id, label: `Éteindre ${d.name}` }))
}

function isWorkHours(hour) {
  return hour >= 8 && hour <= 18
}

function isPeakHour(hour) {
  return (hour >= 18 && hour <= 21) || (hour >= 7 && hour <= 9)
}
