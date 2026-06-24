export function calculateCarbonImpact(formData) {
  const participants = parseInt(formData.participants) || 100
  const duration = parseFloat(formData.duration) || 1

  const transportEmissions = {
    private: participants * duration * 2.5,
    public: participants * duration * 0.8,
    carpool: participants * duration * 0.6,
    hybrid: participants * duration * 1.2,
  }

  const energyEmissions = {
    low: participants * duration * 0.5,
    medium: participants * duration * 1.5,
    high: participants * duration * 3.0,
  }

  const transportCO2 = transportEmissions[formData.transport] || 100
  const energyCO2 = energyEmissions[formData.energy] || 150

  const paperConsumption = formData.registration === 'paper' ? participants * 0.5 : participants * 0.05
  const certificatePaper = formData.certificates === 'printed' ? participants * 0.2 : 0
  const totalPaper = paperConsumption + certificatePaper

  const plasticConsumption = formData.water === 'plastic-bottles' ? participants * duration * 2 : 0
  const foodWaste = formData.food === 'disposable' ? participants * 0.3 : formData.food === 'biodegradable' ? participants * 0.1 : 0
  const totalWaste = foodWaste + (formData.wasteSegregation === 'not-available' ? participants * 0.2 : 0)

  const waterUsage = formData.water === 'refill-stations' ? participants * 2 : formData.water === 'reusable-bottles' ? participants * 1 : participants * 5
  const totalEnergy = energyCO2

  const totalCO2 = transportCO2 + energyCO2 + totalPaper * 0.5 + plasticConsumption * 0.3

  const riskScore = Math.min(Math.round((totalCO2 / (participants * duration * 5)) * 100), 100)

  const initiatives = formData.initiatives || []
  let reduction = 0
  if (initiatives.includes('solar-power')) reduction += 15
  if (initiatives.includes('carbon-offset')) reduction += 20
  if (initiatives.includes('tree-plantation')) reduction += 10
  if (initiatives.includes('digital-invitations')) reduction += 5
  if (initiatives.includes('waste-recycling')) reduction += 10

  return {
    carbonEmissions: Math.round(totalCO2 * 10) / 10,
    paperConsumption: Math.round(totalPaper * 10) / 10,
    plasticConsumption: Math.round(plasticConsumption),
    waterUsage: Math.round(waterUsage),
    energyUsage: Math.round(totalEnergy * 10) / 10,
    wasteGenerated: Math.round(totalWaste * 10) / 10,
    riskScore: Math.max(0, riskScore - reduction),
    reduction,
    unit: 'kg CO₂e',
  }
}

export function simulateImprovedImpact(original, formData, changes) {
  const modified = { ...formData, ...changes }
  return calculateCarbonImpact(modified)
}
