import { useState, useMemo } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'

export default function Reports(){
  const db=useDB(s=>s.db)
  const [from,setFrom]=useState('')
  const [to,setTo]=useState('')
  const [group,setGroup]=useState('all')

  const sales = useMemo(()=>{
    return db.sales.filter(s=>{
      if(s.status==='returned') return false
      const d=s.createdAt.slice(0,10)
      if(from && d<from) return false
      if(to && d>to) return false
      return true
    })
  },[db.sales,from,to])

  const total = sales.reduce((a,s)=>a+Number(s.total),0)
  const count = sales.length
  const avg = count? total/count:0
  const revenue = total
  const cost = sales.reduce((a,s)=> a+ s.items.reduce((sum,it)=> sum+ (Number(it.purchasePrice||it.cost||0)*Number(it.qty)),0),0)
  const profit = revenue - cost - sales.reduce((a,s)=> a+ Number(s.discount||0),0) // discount already in total, but keep approx

  const byPayment = ['cash','bkash','nagad','other'].map(k=> ({k, sum: sales.filter(s=>s.paymentMethod===k).reduce((a,s)=>a+Number(s.total),0), cnt: sales.filter(s=>s.paymentMethod===k).length }))
  const byProduct = (()=> {
    const m=new Map()
    sales.forEach(s=> s.items.forEach(it=>{
      const key=it.name+(it.variantName? ` (${it.variantName})`:'')
      const cur=m.get(key)||{name:key, qty:0, revenue:0}
      cur.qty+=Number(it.qty)
      cur.revenue+= Number(it.price)*Number(it.qty)-Number(it.discount||0)
      m.set(key,cur)
    }))
    return Array.from(m.values()).sort((a,b)=> b.revenue - a.revenue).slice(0,10)
  })()
  const byCategory = (()=> {
    const m=new Map()
    sales.forEach(s=> s.items.forEach(it=>{
      // find product category
      const prod=db.products.find(p=>p.id===it.productId)
      const cat = prod?.category || (it.type==='service'? 'সার্ভিস':'অন্যান্য')
      const cur=m.get(cat)||{cat, revenue:0, qty:0}
      cur.revenue+= Number(it.price)*Number(it.qty)-Number(it.discount||0)
      cur.qty+= Number(it.qty)
      m.set(cat,cur)
    }))
    return Array.from(m.values()).sort((a,b)=> b.revenue-a.revenue)
  })()

  const hasData = sales.length>0

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">রিপোর্ট</h1>
      <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-3 items-end">
        <label className="text-sm">থেকে <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="ml-2 h-9 px-2 rounded-xl border"/></label>
        <label className="text-sm">পর্যন্ত <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="ml-2 h-9 px-2 rounded-xl border"/></label>
        <button onClick={()=>{setFrom(''); setTo('')}} className="h-9 px-4 rounded-xl border text-sm">রিসেট</button>
        <div className="ml-auto text-xs text-slate-500">{hasData? `${count} টি লেনদেন • ${formatTaka(total)}`:'রিপোর্ট তৈরি করার মতো কোনো তথ্য এখনো নেই।'}</div>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 grid place-items-center text-xl">📊</div>
          <div className="mt-3 font-medium">রিপোর্ট দেখতে প্রথমে কিছু বিক্রয় রেকর্ড করুন।</div>
          <div className="text-sm text-slate-500 mt-1">বিক্রয় সম্পন্ন হলে এখানে স্বয়ংক্রিয় রিপোর্ট তৈরি হবে।</div>
        </div>
      ):(
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border p-5"><div className="text-xs text-slate-500">মোট বিক্রয়</div><div className="text-2xl font-bold mt-1">{formatTaka(total)}</div><div className="text-xs text-slate-500">{count} টি লেনদেন</div></div>
            <div className="bg-white rounded-2xl border p-5"><div className="text-xs text-slate-500">গড় লেনদেন</div><div className="text-2xl font-bold mt-1">{formatTaka(Math.round(avg))}</div></div>
            <div className="bg-white rounded-2xl border p-5"><div className="text-xs text-slate-500">মোট খরচ (ক্রয়)</div><div className="text-2xl font-bold mt-1">{formatTaka(cost)}</div></div>
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5"><div className="text-xs text-emerald-700">মোট লাভ</div><div className="text-2xl font-bold mt-1 text-emerald-700">{formatTaka(profit)}</div><div className="text-xs text-emerald-700/70">রাজস্ব - খরচ</div></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold text-sm">পেমেন্ট অনুযায়ী</h3>
              <div className="mt-3 space-y-2">
                {byPayment.map(p=>(
                  <div key={p.k} className="flex items-center justify-between p-3 rounded-xl border">
                    <div className="text-sm font-medium capitalize">{p.k}</div>
                    <div className="text-right"><div className="font-bold">{formatTaka(p.sum)}</div><div className="text-xs text-slate-500">{p.cnt} টি</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold text-sm">ক্যাটাগরি অনুযায়ী</h3>
              {byCategory.length===0? <div className="text-sm text-slate-500 mt-3">তথ্য নেই</div>:
                <div className="mt-3 space-y-2">
                  {byCategory.map(c=>(
                    <div key={c.cat} className="flex items-center justify-between p-3 rounded-xl border">
                      <div><div className="text-sm font-medium">{c.cat}</div><div className="text-xs text-slate-500">{c.qty} আইটেম</div></div>
                      <div className="font-bold">{formatTaka(c.revenue)}</div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold text-sm">সেরা পণ্য (টপ ১০)</h3>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500"><tr><th className="text-left py-2">#</th><th className="text-left py-2">পণ্য / সার্ভিস</th><th className="text-right py-2">পরিমাণ</th><th className="text-right py-2">আয়</th></tr></thead>
                <tbody>
                  {byProduct.map((p,i)=>(
                    <tr key={i} className="border-t"><td className="py-2">{i+1}</td><td className="py-2 font-medium">{p.name}</td><td className="py-2 text-right">{p.qty}</td><td className="py-2 text-right font-bold">{formatTaka(p.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
