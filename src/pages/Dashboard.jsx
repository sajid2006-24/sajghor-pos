import { Link } from 'react-router-dom'
import { useDB, useComputed } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { ShoppingCart, AlertTriangle, TrendingUp, Plus, Wrench } from 'lucide-react'

export default function Dashboard(){
  const { db, todayRevenue, todayProfit, todaySales, lowStock } = useComputed()
  const { t, lang } = useI18n()
  const hasProducts = db.products.length>0
  const hasServices = db.services.length>0
  const hasSales = db.sales.length>0
  const setupDone = hasProducts && hasServices
  const totalProducts = db.products.length
  const totalVariants = db.variants.length

  const last7 = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-i)
    const iso=d.toISOString().slice(0,10)
    const sum=db.sales.filter(s=> s.createdAt.slice(0,10)===iso && s.status!=='returned').reduce((a,s)=>a+Number(s.total),0)
    return {iso, sum, label: d.toLocaleDateString(lang==='bn'?'bn-BD':'en-GB',{weekday:'short'})}
  }).reverse()
  const max = Math.max(1, ...last7.map(x=>x.sum))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900">{t('dash.setupTitle')}</h2>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-500 text-white grid place-items-center text-xs">✓</span> {t('dash.storeInfo')}</div>
          <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-500 text-white grid place-items-center text-xs">✓</span> {t('dash.saleSettings')}</div>
          <div className={`flex items-center gap-2 ${hasProducts?'':'opacity-60'}`}><span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${hasProducts?'bg-emerald-500 text-white':'bg-slate-200'}`}>{hasProducts?'✓':'○'}</span> {t('dash.addFirstProduct')}</div>
          <div className={`flex items-center gap-2 ${hasServices?'':'opacity-60'}`}><span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${hasServices?'bg-emerald-500 text-white':'bg-slate-200'}`}>{hasServices?'✓':'○'}</span> {t('dash.addFirstService')}</div>
          <div className={`flex items-center gap-2 ${hasSales?'':'opacity-60'}`}><span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${hasSales?'bg-emerald-500 text-white':'bg-slate-200'}`}>{hasSales?'✓':'○'}</span> {t('dash.firstSale')}</div>
        </div>
        {!setupDone && (
          <div className="mt-4 flex flex-wrap gap-2">
            {!hasProducts && <Link to="/products" className="px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> {t('dash.addFirstProduct')}</Link>}
            {!hasServices && <Link to="/services" className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold inline-flex items-center gap-2"><Wrench size={16}/> {t('dash.addFirstService')}</Link>}
            <Link to="/pos" className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold inline-flex items-center gap-2"><ShoppingCart size={16}/> {t('dash.startSale')}</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-medium text-slate-500">{t('dash.todaySales')}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatTaka(todayRevenue)}</div>
          <div className="text-xs text-slate-500 mt-1">{todaySales.length} {t('dash.transactions')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-medium text-slate-500">{t('dash.todayProfit')}</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{formatTaka(todayProfit)}</div>
          <div className="text-xs text-slate-500 mt-1">{t('dash.estimatedProfit')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-medium text-slate-500">{t('dash.totalProducts')}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalProducts}</div>
          <div className="text-xs text-slate-500 mt-1">{totalVariants} {t('dash.variants')}</div>
        </div>
        <div className={`rounded-2xl border p-5 ${lowStock.length?'bg-amber-50 border-amber-200':'bg-white border-slate-200'}`}>
          <div className="text-xs font-medium text-slate-500">{t('dash.lowStock')}</div>
          <div className={`text-2xl font-bold mt-1 ${lowStock.length?'text-amber-700':'text-slate-900'}`}>{lowStock.length}</div>
          <div className="text-xs text-slate-500 mt-1">{lowStock.length? t('dash.lowStockAction'):t('dash.lowStockDesc')}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold flex items-center gap-2"><TrendingUp size={18} className="text-teal-700"/> {t('dash.weekSales')}</h3>
          {hasSales ? (
            <div className="mt-6 flex items-end gap-2 h-[160px]">
              {last7.map(d=>(
                <div key={d.iso} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center" style={{height:120}}>
                    <div className="w-full max-w-[48px] bg-teal-700 rounded-t-xl transition" style={{height: `${(d.sum/max)*100}%`, minHeight: d.sum? '8px':'2px', opacity: d.sum?1:0.2}} title={`${d.iso}: ${formatTaka(d.sum)}`} />
                  </div>
                  <div className="text-[11px] text-slate-600">{d.label}</div>
                  <div className="text-[11px] font-medium">{d.sum? formatTaka(d.sum):'—'}</div>
                </div>
              ))}
            </div>
          ):(
            <div className="mt-8 text-center py-8 bg-slate-50 rounded-xl border border-dashed">
              <div className="text-sm text-slate-600">{t('dash.noTrend')}</div>
              <Link to="/pos" className="mt-3 inline-flex px-4 py-2 bg-teal-700 text-white rounded-xl text-sm font-semibold">{t('dash.startSale')}</Link>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold flex items-center gap-2"><AlertTriangle size={18} className="text-amber-600"/> {t('dash.lowStockTitle')}</h3>
          {lowStock.length===0 ? (
            <div className="mt-6 text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed">{t('dash.noLowStock')}</div>
          ):(
            <div className="mt-4 space-y-2 max-h-[220px] overflow-auto pr-1">
              {lowStock.slice(0,8).map((x,i)=>(
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{x.productName}{x.name? ` — ${x.name}`:''}</div>
                    <div className="text-xs text-slate-600">Stock: {x.stock} • Min: {x.minStock||db.store.lowStockThreshold}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">{t('stock.low')}</span>
                </div>
              ))}
              <Link to="/stock" className="block text-center text-sm text-teal-700 font-medium mt-2">{t('dash.viewAllStock')}</Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t('dash.recentSales')}</h3>
          <Link to="/sales" className="text-sm text-teal-700 font-medium">{t('dash.viewAll')}</Link>
        </div>
        {db.sales.length===0 ? (
          <div className="mt-4">
            <EmptyState title={t('dash.noSalesToday')} desc={t('dash.noSalesDesc')} icon="🧾" action={<Link to="/pos" className="px-4 py-2 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><ShoppingCart size={16}/> {t('dash.startSale')}</Link>} />
          </div>
        ):(
          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr><th className="text-left py-2 px-2">Invoice</th><th className="text-left py-2">Date</th><th className="text-left py-2">Items</th><th className="text-right py-2">Total</th><th className="text-right py-2">Payment</th></tr>
              </thead>
              <tbody>
                {db.sales.slice(0,5).map(s=>(
                  <tr key={s.id} className="border-t">
                    <td className="py-2 px-2 font-mono text-xs font-medium">{s.invoiceNo}</td>
                    <td className="py-2 text-xs">{new Date(s.createdAt).toLocaleString(lang==='bn'?'bn-BD':'en-GB')}</td>
                    <td className="py-2">{s.items.length}</td>
                    <td className="py-2 text-right font-semibold">{formatTaka(s.total)}</td>
                    <td className="py-2 text-right"><span className="px-2 py-1 rounded-full bg-slate-100 text-xs">{s.paymentMethod}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
