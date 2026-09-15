export const formatTaka = (n) => `৳${Number(n||0).toLocaleString('bn-BD')}`
export const formatNum = (n) => Number(n||0).toLocaleString('bn-BD')
export const todayISO = () => new Date().toISOString().slice(0,10)
export const genId = () => Date.now().toString(36)+Math.random().toString(36).slice(2,6)
export const genInvoice = (count) => `INV-${String(count+1).padStart(6,'0')}`
export const clamp = (v,min,max)=>Math.max(min,Math.min(max,v))
export const searchMatch = (hay, q) => {
  if(!q) return true
  q=q.toLowerCase()
  return hay.toLowerCase().includes(q)
}
