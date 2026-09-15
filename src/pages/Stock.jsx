import { useDB, useComputed } from '../lib/db'
import { Search, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import { formatNum } from '../lib/utils'

export default function Stock(){
  const { t, lang } = useI18n()
  const { lowStock } = useComputed()
  const db = useDB(s=>s.db)
  const [q,setQ]=useState('')
  const rows=[]
  db.products.forEach(p=>{
    const vars = db.variants.filter(v=>v.productId===p.id)
    if(vars.length) vars.forEach(v=> rows.push({id:v.id, name:`${p.name} — ${v.name}`, stock:v.stock, min:v.minStock||p.minStock||db.store.lowStockThreshold, category:p.category, type:'variant'}))
    else rows.push({id:p.id, name:p.name, stock:p.stock, min:p.minStock||db.store.lowStockThreshold, category:p.category, type:'product'})
  })
  const filtered = rows.filter(r=> !q || r.name.toLowerCase().includes(q.toLowerCase()))
  const low = filtered.filter(r=> Number(r.stock) <= Number(r.min))
  const ok = filtered.filter(r=> Number(r.stock) > Number(r.min))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t('stock.title')}</h1>
      <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('stock.searchPlaceholder')} className="w-full h-10 pl-9 pr-3 rounded-xl border"/>
        </div>
        <div className="text-sm px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 flex items-center gap-2"><AlertTriangle size={14}/> {t('stock.lowCount')} <span className="num font-black tabular-nums text-[15px] text-amber-800">{formatNum(low.length, lang)}</span></div>
        <div className="text-sm px-3 py-1.5 rounded-full bg-slate-50 border flex items-center gap-1.5">{t('stock.totalItems')} <span className="num font-black tabular-nums text-[15px] text-slate-900">{formatNum(filtered.length, lang)}</span></div>
      </div>

      {filtered.length===0 ? <div className="bg-white rounded-2xl border p-10 text-center text-sm text-slate-500">{t('stock.noData')}</div> : (
        <>
          {low.length>0 && (
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 font-semibold text-sm flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600"/> {t('stock.lowHeader')}</div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-500 bg-slate-50"><tr><th className="text-left px-4 py-2">{t('stock.colProduct')}</th><th className="text-left py-2">{t('stock.colCategory')}</th><th className="text-right py-2">{t('stock.colStock')}</th><th className="text-right py-2">{t('stock.colMin')}</th></tr></thead>
                  <tbody>{low.map(r=> <tr key={r.id} className="border-t"><td className="px-4 py-2 font-medium">{r.name}</td><td className="py-2">{r.category||'—'}</td><td className="py-2 text-right num font-black text-[15px] tabular-nums text-amber-700">{formatNum(r.stock, lang)}</td><td className="py-2 text-right num font-bold tabular-nums">{formatNum(r.min, lang)}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-4 py-3 font-semibold text-sm">{t('stock.allStock')}</div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500 bg-slate-50"><tr><th className="text-left px-4 py-2">{t('stock.colProduct')}</th><th className="text-left py-2">{t('stock.colCategory')}</th><th className="text-right py-2">{t('stock.colStock')}</th><th className="text-right px-4 py-2">{t('stock.colStatus')}</th></tr></thead>
                <tbody>
                  {[...low,...ok].map(r=>{
                    const isLow = Number(r.stock) <= Number(r.min)
                    return <tr key={r.id} className="border-t"><td className="px-4 py-2">{r.name}</td><td className="py-2">{r.category||'—'}</td><td className={`py-2 text-right num font-black tabular-nums text-[15px] ${isLow?'text-amber-700':'text-slate-900'}`}>{formatNum(r.stock, lang)}</td><td className="px-4 py-2 text-right">{isLow? <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">{t('stock.low')}</span>:<span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">{t('stock.ok')}</span>}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
