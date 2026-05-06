import type { MDMPOutput, ScenarioListEntry } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(body.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function submitScenario(scenarioData: Record<string, unknown>): Promise<{ run_id: string; status: string; output: MDMPOutput }> {
  return request('/api/scenario', {
    method: 'POST',
    body: JSON.stringify({ scenario: scenarioData }),
  })
}

export async function listScenarios(): Promise<ScenarioListEntry> {
  return request('/api/scenarios')
}

export async function loadScenario(name: string): Promise<Record<string, unknown>> {
  return request(`/api/scenarios/${name}`)
}

export async function getRunCOAs(runId: string) {
  return request(`/api/mdmp/${runId}/coas`)
}

export async function getRecommendation(runId: string) {
  return request(`/api/mdmp/${runId}/recommendation`)
}

export async function getOPORD(runId: string) {
  return request(`/api/mdmp/${runId}/opord`)
}

export async function refineRun(runId: string, sessionId: string, userRequest: string) {
  return request(`/api/mdmp/${runId}/refine`, {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, user_request: userRequest }),
  })
}

export function getPdfUrl(runId: string): string {
  return `${BASE}/api/mdmp/${runId}/report.pdf`
}

export async function nominateTarget(targetData: Record<string, unknown>) {
  return request('/api/fires/targets', {
    method: 'POST',
    body: JSON.stringify({ target_data: targetData }),
  })
}
