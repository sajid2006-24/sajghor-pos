import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Printer, RotateCcw, Search, X } from 'lucide-react'

export default function SalesHistory(){
  const db=useDB(s=>s.db)
  const ret=useDB(s=>s.returnSale)
  const [q,setQ]=useState('')
  const [view,setView]=useState(null)
  const filtered = db.sales.filter(s=>{
    if(!q) return true
    const hay=`${s.invoiceNo} ${s.customerName} ${s.customerPhone} ${s.paymentMethod}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">বিক্রয় ইতিহাস</h1>
      <div className="bg-white rounded-2xl border p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ইনভয়েস / কাস্টমার / পেমেন্ট খুঁজুন..." className="w-full h-10 pl-9 pr-3 rounded-xl border"/>
        </div>
        <div className="text-sm text-slate-600">{filtered.length} টি রেকর্ড</div>
      </div>

      {filtered.length===0 ? (
        <EmptyState title="কোনো বিক্রয় রেকর্ড নেই।" desc="বিক্রয় করলে এখানে ইনভয়েস তালিকা দেখা যাবে।" icon="🧾" />
      ):(
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="text-left px-4 py-3">ইনভয়েস</th><th className="text-left py-3">তারিখ</th><th className="text-left py-3">কাস্টমার</th><th className="text-right py-3">আইটেম</th><th className="text-right py-3">মোট</th><th className="text-left py-3">পেমেন্ট</th><th className="text-right px-4 py-3">অ্যাকশন</th></tr></thead>
              <tbody>
                {filtered.map(s=>(
                  <tr key={s.id} className={`border-t ${s.status==='returned'?'bg-red-50/50':''}`}>
                    <td className="px-4 py-3 font-mono text-xs font-bold">{s.invoiceNo} {s.status==='returned' && <span className="ml-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px]">RETURNED</span>}</td>
                    <td className="py-3 text-xs">{new Date(s.createdAt).toLocaleString('bn-BD')}</td>
                    <td className="py-3"><div className="font-medium">{s.customerName}</div><div className="text-xs text-slate-500">{s.customerPhone||''}</div></td>
                    <td className="py-3 text-right">{s.items.length}</td>
                    <td className="py-3 text-right font-bold">{formatTaka(s.total)}</td>
                    <td className="py-3"><span className="px-2 py-1 rounded-full bg-slate-100 text-xs">{s.paymentMethod}</span></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-1">
                      <button onClick={()=>setView(s)} className="px-3 py-1.5 rounded-lg border hover:bg-slate-50 text-xs">দেখুন</button>
                      <button onClick={()=>setView(s)} className="p-1.5 hover:bg-slate-50 rounded-lg"><Printer size={16}/></button>
                      {s.status!=='returned' && <button onClick={()=>{ if(confirm('এই বিক্রয় রিটার্ন করবেন? স্টক ফেরত আসবে।')) ret(s.id)}} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"><RotateCcw size={16}/></button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setView(null)}/>
          <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-xl overflow-hidden">
            <div id="invoice-print" className="p-6">
              <div className="text-center border-b pb-4">
                <div className="font-bold">{db.store.name}</div>
                <div className="text-xs text-slate-600">{db.store.proprietor} • {db.store.phone}</div>
                <div className="text-xs text-slate-600">{db.store.address}</div>
              </div>
              <div className="flex justify-between text-xs mt-3"><span>ইনভয়েস: <b className="font-mono">{view.invoiceNo}</b></span><span>{new Date(view.createdAt).toLocaleString('bn-BD')}</span></div>
              <div className="text-xs mt-1">কাস্টমার: {view.customerName} {view.customerPhone? `• ${view.customerPhone}`:''} • পেমেন্ট: {view.paymentMethod}</div>
              {view.status==='returned' && <div className="mt-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded">এই বিক্রয় রিটার্ন করা হয়েছে</div>}
              <table className="w-full text-xs mt-3">
                <thead><tr className="border-y"><th className="text-left py-1">আইটেম</th><th className="text-right">পরিমাণ</th><th className="text-right">মোট</th></tr></thead>
                <tbody>{view.items.map((it,i)=> <tr key={i} className="border-b"><td className="py-1">{it.name}{it.variantName?` (${it.variantName})`:''}<div className="text-slate-500">{formatTaka(it.price)} × {it.qty}</div></td><td className="text-right">{it.qty}</td><td className="text-right font-medium">{formatTaka(it.price*it.qty - (it.discount||0))}</td></tr>)}</tbody>
              </table>
              <div className="text-xs space-y-1 mt-3"><div className="flex justify-between"><span>সাবটোটাল</span><span>{formatTaka(view.subtotal)}</span></div><div className="flex justify-between"><span>ছাড়</span><span>{formatTaka(view.discount)}</span></div><div className="flex justify-between font-bold text-sm border-t pt-2"><span>মোট</span><span>{formatTaka(view.total)}</span></div></div>
              <div className="text-center text-sm mt-4 pt-3 border-t">ধন্যবাদ, আবার আসবেন।</div>
            </div>
            <div className="p-4 flex gap-2 bg-slate-50 border-t">
              <button onClick={()=>window.print()} className="flex-1 h-10 bg-teal-700 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"><Printer size={16}/> প্রিন্ট</button>
              <button onClick={()=>setView(null)} className="px-4 h-10 border rounded-xl bg-white inline-flex items-center gap-2"><X size={16}/> বন্ধ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
