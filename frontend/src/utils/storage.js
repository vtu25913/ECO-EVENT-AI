// ─── Event Templates (local convenience feature) ────────────────────────────
// All analysis data is stored in Supabase via the backend API.
// Event Templates are kept in localStorage as a convenience for quick form filling.

export function saveTemplate(template) {
  const templates = getTemplates()
  templates.unshift({
    ...template,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    savedAt: new Date().toISOString(),
  })
  localStorage.setItem('eco-event-templates', JSON.stringify(templates.slice(0, 20)))
  return templates[0]
}

export function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem('eco-event-templates') || '[]')
  } catch {
    return []
  }
}

export function deleteTemplate(id) {
  const templates = getTemplates().filter((t) => t.id !== id)
  localStorage.setItem('eco-event-templates', JSON.stringify(templates))
  return templates
}

export function getSimilarAnalyses(eventName) {
  if (!eventName) return []
  const analyses = getAnalyses()
  const name = eventName.toLowerCase()
  return analyses.filter(a => a.formData?.eventName?.toLowerCase().includes(name) || name.includes(a.formData?.eventName?.toLowerCase() || ''))
}

// ─── User Preferences ────────────────────────────────────────────────────────

export function getPreferences() {
  try {
    return JSON.parse(localStorage.getItem('eco-event-preferences') || '{}')
  } catch {
    return {}
  }
}

export function savePreferences(prefs) {
  localStorage.setItem('eco-event-preferences', JSON.stringify(prefs))
}
