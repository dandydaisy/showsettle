// Simple user ID generator (fingerprint-style)
// Uses browser fingerprint until we add real auth

export function getUserId(): string {
  if (typeof window === 'undefined') return 'server'
  
  const key = 'showsettle_user_id'
  let userId = localStorage.getItem(key)
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(key, userId)
  }
  
  return userId
}
