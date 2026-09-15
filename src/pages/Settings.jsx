import { useState } from 'react'
import { useDB } from '../lib/db'

export default function Settings(){
  const db=useDB(s=>s.db)
  const updateStore=useDB(s=>s.updateStore)
  const resetAll=useDB(s=>s.resetAll)
  const exportJSON=useDB(s=>s.exportJSON)
  const importJSON=useDB(s=>s.importJSON)
  const [form,setForm]=useState(db.store)
  const save=()=>{ updateStore(form); alert('সংরক্ষিত হয়েছে') }
  const doExport=()=>{
    const blob=new Blob([exportJSON()],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a'); a.href=url; a.download=`sajghor-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const doImport=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader(); r.onload=()=>{ const ok=importJSON(r.result); alert(ok?'ইমপোর্ট সফল':'ফাইল সঠিক নয়')}; r.readAsText(file)
  }
  return (
    <div className="space-y-6 max-w-[900px]">
      <h1 className="text-xl font-bold">সেটিংস</h1>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">দোকানের তথ্য</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <label>দোকানের নাম <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>মালিক <input value={form.proprietor} onChange={e=>setForm({...form,proprietor:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>ফোন <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>লোগো URL (ঐচ্ছিক) <input value={form.logo} onChange={e=>setForm({...form,logo:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="https://..."/></label>
          <label className="md:col-span-2">ঠিকানা <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">POS সেটিংস</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <label>মুদ্রা <input value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>ট্যাক্স % <input type="number" value={form.taxRate} onChange={e=>setForm({...form,taxRate:Number(e.target.value)})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>কম স্টক সীমা <input type="number" value={form.lowStockThreshold} onChange={e=>setForm({...form,lowStockThreshold:Number(e.target.value)})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.allowNegativeStock} onChange={e=>setForm({...form,allowNegativeStock:e.target.checked})}/> নেগেটিভ স্টক অনুমতি দিন</label>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <h2 className="font-semibold">পেমেন্ট মেথড</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {Object.entries({cash:'ক্যাশ', bkash:'bKash', nagad:'Nagad', other:'অন্যান্য'}).map(([k,l])=>(
            <label key={k} className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${form.paymentMethods[k]?'bg-teal-50 border-teal-200':'bg-white'}`}>
              <input type="checkbox" checked={!!form.paymentMethods[k]} onChange={e=>setForm({...form, paymentMethods:{...form.paymentMethods, [k]:e.target.checked}})} />{l}
            </label>
          ))}
        </div>
        <div className="text-xs text-slate-500">bKash/Nagad শুধু রেকর্ড হিসেবে কাজ করবে — কোনো API ইন্টিগ্রেশন নেই।</div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <h2 className="font-semibold">ডেটা</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={save} className="px-6 py-2.5 bg-teal-700 text-white rounded-xl font-semibold">সংরক্ষণ করুন</button>
          <button onClick={doExport} className="px-4 py-2.5 border rounded-xl text-sm font-medium">ব্যাকআপ ডাউনলোড (JSON)</button>
          <label className="px-4 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">ব্যাকআপ ইমপোর্ট <input type="file" accept=".json" onChange={doImport} className="hidden"/></label>
          <button onClick={()=>{ if(confirm('সব ডেটা মুছে ফেলবেন? এই কাজ ফেরানো যাবে না।')) resetAll()}} className="px-4 py-2.5 border rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">সব ডেটা রিসেট</button>
        </div>
        <div className="text-xs text-slate-500">ডেটা ব্রাউজারে সংরক্ষিত থাকে — রিফ্রেশ বা রিস্টার্টেও মুছবে না। ব্যাকআপ নিয়মিত ডাউনলোড করুন।</div>
      </div>

      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 text-xs leading-relaxed">
        <div className="font-semibold text-white">অ্যাকাউন্ট</div>
        <div className="mt-1 opacity-80">এই সিস্টেমটি সাজঘর কসমেটিক্স এন্ড ভ্যারাইটিজ সেন্টার-কে ১ মাস বিনামূল্যে প্রদান করা হচ্ছে। এটি ট্রায়াল/ডেমো হিসেবে দেখানো হয় না। সার্ভিস স্ট্যাটাস অ্যাডমিন দ্বারা পরিচালিত।</div>
      </div>
    </div>
  )
}
