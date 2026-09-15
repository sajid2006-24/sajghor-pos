import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Plus } from 'lucide-react'

export default function Purchases(){
  const db=useDB(s=>s.db)
  const addPurchase=useDB(s=>s.addPurchase)
  const addSupplier=useDB(s=>s.addSupplier)
  const [show,setShow]=useState(false)
  const [supplier,setSupplier]=useState('')
  const [date,setDate]=useState(new Date().toISOString().slice(0,10))
  const [note,setNote]=useState('')
  const [items,setItems]=useState([{productId:'', variantId:'', qty:1, price:''}])

  const save=()=>{
    if(!supplier.trim()) return alert('সাপ্লায়ার নাম দিন')
    if(items.some(i=> !i.productId || !i.qty || !i.price)) return alert('প্রতিটি আইটেমে পণ্য, পরিমাণ, দাম দিন')
    // ensure supplier exists
    let sup = db.suppliers.find(s=> s.name.toLowerCase()===supplier.toLowerCase())
    if(!sup) sup = addSupplier(supplier)
    const purchase={ id: Date.now().toString(36), supplier: supplier.trim(), supplierId: sup?.id||null, date, note, items: items.map(i=> ({productId:i.productId, variantId:i.variantId||null, qty:Number(i.qty), price:Number(i.price)})), total: items.reduce((a,i)=> a+ Number(i.qty)*Number(i.price),0), createdAt:new Date().toISOString()}
    addPurchase(purchase)
    setShow(false); setItems([{productId:'', variantId:'', qty:1, price:''}]); setSupplier(''); setNote('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ক্রয়</h1>
        <button onClick={()=>setShow(true)} className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> নতুন ক্রয়</button>
      </div>

      {db.purchases.length===0 ? (
        <EmptyState title="এখনো কোনো ক্রয় রেকর্ড নেই।" desc="সাপ্লায়ার থেকে পণ্য কিনলে এখানে যোগ করুন — স্টক স্বয়ংক্রিয়ভাবে বাড়বে।" icon="🧾" action={<button onClick={()=>setShow(true)} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold">প্রথম ক্রয় যোগ করুন</button>} />
      ):(
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="text-left px-4 py-3">তারিখ</th><th className="text-left py-3">সাপ্লায়ার</th><th className="text-left py-3">আইটেম</th><th className="text-right py-3">মোট</th><th className="text-left px-4 py-3">নোট</th></tr></thead>
              <tbody>
                {db.purchases.map(p=>(
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 text-xs">{p.date} <div className="text-slate-500">{new Date(p.createdAt).toLocaleTimeString('bn-BD')}</div></td>
                    <td className="py-3 font-medium">{p.supplier}</td>
                    <td className="py-3">
                      {p.items.map((it,i)=>{
                        const prod=db.products.find(x=>x.id===it.productId)
                        const v=db.variants.find(x=>x.id===it.variantId)
                        return <div key={i} className="text-xs">{prod?.name||'—'}{v? ` (${v.name})`:''} × {it.qty} • {formatTaka(it.price)}</div>
                      })}
                    </td>
                    <td className="py-3 text-right font-bold">{formatTaka(p.total)}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{p.note||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShow(false)}/>
          <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 font-semibold">নতুন ক্রয়</div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid md:grid-cols-3 gap-3">
                <label>সাপ্লায়ার* <input value={supplier} onChange={e=>setSupplier(e.target.value)} list="sups" className="mt-1 w-full h-10 px-3 rounded-xl border"/><datalist id="sups">{db.suppliers.map(s=> <option key={s.id} value={s.name}/>)}</datalist></label>
                <label>তারিখ <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
                <label>নোট <input value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="ঐচ্ছিক"/></label>
              </div>
              <div className="space-y-3">
                {items.map((it,idx)=>(
                  <div key={idx} className="grid md:grid-cols-[1fr_140px_120px_120px_40px] gap-2 items-end p-3 rounded-xl border bg-slate-50">
                    <label>পণ্য
                      <select value={it.productId} onChange={e=>{
                        const pid=e.target.value
                        const prod=db.products.find(x=>x.id===pid)
                        setItems(arr=> arr.map((x,i)=> i===idx? {...x, productId:pid, variantId:'', price: prod? String(prod.purchasePrice||''):x.price}:x))
                      }} className="mt-1 w-full h-9 px-2 rounded-lg border bg-white">
                        <option value="">পণ্য বেছে নিন</option>
                        {db.products.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </label>
                    <label>ভ্যারিয়েন্ট
                      <select value={it.variantId} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, variantId:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border bg-white">
                        <option value="">—</option>
                        {db.variants.filter(v=>v.productId===it.productId).map(v=> <option key={v.id} value={v.id}>{v.name} (স্টক {v.stock})</option>)}
                      </select>
                    </label>
                    <label>পরিমাণ <input type="number" value={it.qty} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, qty:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border"/></label>
                    <label>ক্রয় দাম <input type="number" value={it.price} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, price:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border"/></label>
                    <button onClick={()=> setItems(a=> a.filter((_,i)=> i!==idx))} className="h-9 px-2 rounded-lg border bg-white hover:bg-red-50 text-red-600">✕</button>
                  </div>
                ))}
                <button onClick={()=> setItems(a=> [...a, {productId:'', variantId:'', qty:1, price:''}])} className="px-3 py-2 rounded-xl border text-sm">+ আইটেম যোগ করুন</button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-2"><button onClick={()=>setShow(false)} className="px-4 py-2 rounded-xl border">বাতিল</button><button onClick={save} className="px-6 py-2 rounded-xl bg-teal-700 text-white font-semibold">সংরক্ষণ করুন</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
