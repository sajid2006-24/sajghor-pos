import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Plus, Trash2, Edit3 } from 'lucide-react'

const suggestions = ['সাদা-কালো ফটোকপি','কালার ফটোকপি','ছবি','পাসপোর্ট ছবি','ফটো প্রিন্ট','ডকুমেন্ট প্রিন্ট','স্ক্যান','ল্যামিনেশন']

export default function Services(){
  const db=useDB(s=>s.db)
  const add=useDB(s=>s.addService)
  const upd=useDB(s=>s.updateService)
  const del=useDB(s=>s.deleteService)
  const [show,setShow]=useState(false)
  const [editing,setEditing]=useState(null)
  const [form,setForm]=useState({name:'', category:'', price:'', cost:'', unit:'per item'})

  const openNew=(name='')=>{ setEditing(null); setForm({name, category:'', price:'', cost:'', unit:'per item'}); setShow(true)}
  const openEdit=(s)=>{ setEditing(s); setForm({name:s.name, category:s.category||'', price:String(s.price), cost:String(s.cost||''), unit:s.unit||'per item'}); setShow(true)}
  const save=()=>{
    if(!form.name.trim() || !form.price) return alert('নাম ও দাম দিন')
    const payload={ name:form.name.trim(), category:form.category.trim(), price:Number(form.price), cost:Number(form.cost||0), unit:form.unit}
    if(editing) upd(editing.id, payload); else add(payload)
    setShow(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">সার্ভিস</h1>
        <button onClick={()=>openNew()} className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> সার্ভিস যোগ করুন</button>
      </div>

      {db.services.length===0 ? (
        <EmptyState title="এখনো কোনো সার্ভিস যোগ করা হয়নি।" desc="আপনার দোকানের সার্ভিস ও দাম এখানে যোগ করুন।" icon="🧰" action={<button onClick={()=>openNew()} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold">প্রথম সার্ভিস যোগ করুন</button>} />
      ):(
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="text-left px-4 py-3">সার্ভিস</th><th className="text-left py-3">একক</th><th className="text-right py-3">মূল্য</th><th className="text-right px-4 py-3">অ্যাকশন</th></tr></thead>
            <tbody>
              {db.services.map(s=>(
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3"><div className="font-medium">{s.name}</div><div className="text-xs text-slate-500">{s.category||'—'}</div></td>
                  <td className="py-3 text-xs">{s.unit}</td>
                  <td className="py-3 text-right font-semibold">{formatTaka(s.price)} {s.cost? <span className="text-xs text-slate-500">• খরচ {formatTaka(s.cost)}</span>:''}</td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1"><button onClick={()=>openEdit(s)} className="p-2 hover:bg-slate-50 rounded-lg"><Edit3 size={16}/></button><button onClick={()=>{if(confirm('মুছবেন?')) del(s.id)}} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white rounded-2xl border p-4">
        <div className="text-sm font-medium">দ্রুত যোগ করুন (পরামর্শ):</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map(n=>(
            <button key={n} onClick={()=>openNew(n)} className="px-3 py-1.5 rounded-full border hover:bg-slate-50 text-sm">{n} +</button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-2">দাম আপনাকেই বসাতে হবে — কোনো দাম স্বয়ংক্রিয়ভাবে দেওয়া হয় না।</div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShow(false)}/>
          <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-xl">
            <div className="px-6 py-4 border-b font-semibold">{editing?'সার্ভিস সম্পাদনা':'নতুন সার্ভিস'}</div>
            <div className="p-6 space-y-3 text-sm">
              <label>সার্ভিস নাম* <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="যেমন: কালার ফটোকপি"/></label>
              <label>ক্যাটাগরি <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="প্রিন্ট / ফটো"/></label>
              <label>মূল্য* <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>খরচ (ঐচ্ছিক) <input type="number" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="কাগজ/কালি খরচ"/></label>
              <label>একক <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"><option value="per page">প্রতি পৃষ্ঠা</option><option value="per copy">প্রতি কপি</option><option value="per item">প্রতি আইটেম</option><option value="fixed">ফিক্সড</option></select></label>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2"><button onClick={()=>setShow(false)} className="px-4 py-2 rounded-xl border">বাতিল</button><button onClick={save} className="px-6 py-2 rounded-xl bg-teal-700 text-white font-semibold">সংরক্ষণ</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
