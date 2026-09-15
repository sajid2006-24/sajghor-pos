import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Plus, Trash2 } from 'lucide-react'

export default function Expenses(){
  const db=useDB(s=>s.db)
  const add=useDB(s=>s.addExpense)
  const del=useDB(s=>s.deleteExpense)
  const [show,setShow]=useState(false)
  const [form,setForm]=useState({title:'', category:'বিদ্যুৎ', amount:'', date:new Date().toISOString().slice(0,10), note:''})
  const total = db.expenses.reduce((a,e)=> a+Number(e.amount||0),0)
  const cats=['বিদ্যুৎ','ইন্টারনেট','ভাড়া','পরিবহন','কর্মচারী','দোকান খরচ','অন্যান্য']
  const save=()=>{
    if(!form.title.trim() || !form.amount) return alert('শিরোনাম ও টাকা দিন')
    add({title:form.title.trim(), category:form.category, amount:Number(form.amount), date:form.date, note:form.note})
    setShow(false); setForm({title:'', category:'বিদ্যুৎ', amount:'', date:new Date().toISOString().slice(0,10), note:''})
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">খরচ</h1>
        <button onClick={()=>setShow(true)} className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> খরচ যোগ করুন</button>
      </div>
      <div className="bg-white rounded-2xl border p-5 flex items-center justify-between">
        <div><div className="text-xs text-slate-500">মোট খরচ</div><div className="text-2xl font-bold">{formatTaka(total)}</div></div>
        <div className="text-xs text-slate-500">{db.expenses.length} টি রেকর্ড</div>
      </div>
      {db.expenses.length===0 ? (
        <EmptyState title="এখনো কোনো খরচ যোগ করা হয়নি।" desc="বিদ্যুৎ, ইন্টারনেট, ভাড়া ইত্যাদি খরচ এখানে যোগ করুন।" icon="💸" action={<button onClick={()=>setShow(true)} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold">প্রথম খরচ যোগ করুন</button>} />
      ):(
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="text-left px-4 py-3">তারিখ</th><th className="text-left py-3">শিরোনাম</th><th className="text-left py-3">ক্যাটাগরি</th><th className="text-right py-3">টাকা</th><th className="text-right px-4 py-3">অ্যাকশন</th></tr></thead>
            <tbody>
              {db.expenses.slice().reverse().map(e=>(
                <tr key={e.id} className="border-t"><td className="px-4 py-3 text-xs">{e.date}</td><td className="py-3 font-medium">{e.title}<div className="text-xs text-slate-500">{e.note||''}</div></td><td className="py-3"><span className="px-2 py-1 rounded-full bg-slate-100 text-xs">{e.category}</span></td><td className="py-3 text-right font-bold">{formatTaka(e.amount)}</td><td className="px-4 py-3 text-right"><button onClick={()=>{if(confirm('মুছবেন?')) del(e.id)}} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShow(false)}/>
          <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-xl">
            <div className="px-6 py-4 border-b font-semibold">নতুন খরচ</div>
            <div className="p-6 space-y-3 text-sm">
              <label>শিরোনাম* <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="যেমন: বিদ্যুৎ বিল"/></label>
              <label>ক্যাটাগরি <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border">{cats.map(c=> <option key={c} value={c}>{c}</option>)}</select></label>
              <label>টাকা* <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>তারিখ <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>নোট <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2"><button onClick={()=>setShow(false)} className="px-4 py-2 rounded-xl border">বাতিল</button><button onClick={save} className="px-6 py-2 rounded-xl bg-teal-700 text-white font-semibold">সংরক্ষণ</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
