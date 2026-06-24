/**
 * apiService.js
 *
 * Unified API client — all backend calls go through here.
 * The Vite dev proxy forwards /api/* → http://localhost:3001
 * In production, set VITE_API_URL to your deployed backend URL.
 *
 * Architecture:
 *   Frontend → /api/* (proxied) → Express backend → Supabase (service role)
 *   Frontend → Supabase directly → Auth + direct DB reads (anon key)
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// ─── Helper ──────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }

  // Attach Supabase JWT for auth-protected routes
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
    delete options.token
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  return res.json()
}

// ─── Health ──────────────────────────────────────────────────────────────────

export async function checkBackendHealth() {
  try {
    const data = await apiFetch('/health')
    return { online: true, ...data }
  } catch {
    return { online: false }
  }
}

// ─── Analyses (auth-protected) ───────────────────────────────────────────────

export async function fetchUserAnalyses(token) {
  return apiFetch('/analyses', { token })
}

export async function createAnalysis(analysisPayload, token) {
  return apiFetch('/analyses', {
    method: 'POST',
    body: JSON.stringify(analysisPayload),
    token,
  })
}

export async function removeAnalysis(id, token) {
  return apiFetch(`/analyses/${id}`, { method: 'DELETE', token })
}

// ─── Leaderboard (public) ────────────────────────────────────────────────────

export async function fetchLeaderboard() {
  return apiFetch('/leaderboard')
}

export async function fetchGlobalStats() {
  return apiFetch('/leaderboard/stats')
}

// ─── AI Advisor Chat (public) ───────────────────────────────────────────────────

export async function sendChatMessage(message, context = null, useExpertMode = false) {
  return apiFetch('/ai-advisor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context, useExpertMode }),
  })
}

// ─── Seed Data (authenticated users) ────────────────────────────────────────

export async function seedSampleDataToCloud(userId, token) {
  return apiFetch('/ai-advisor/seed-data', {
    method: 'POST',
    body: JSON.stringify({ userId }),
    token,
  })
}

// ─── AI Advisor Capabilities ────────────────────────────────────────────────────

export async function fetchAICapabilities() {
  return apiFetch('/ai-advisor/capabilities')
}
