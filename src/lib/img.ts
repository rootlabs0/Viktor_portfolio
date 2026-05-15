const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
export const img = (path: string) => `${BASE}${path}`
