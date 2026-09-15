import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Plus, Trash2, Edit3, Search, Package } from 'lucide-react'

export default function Products(){
  const db = useDB(s=>s.db)
  const addProduct = useDB(s=>s.addProduct)
  const updateProduct = useDB(s=>s.updateProduct)
  const deleteProduct = useDB(s=>s.deleteProduct)
  const addCategory = useDB(s=>s.addCategory)
  const variants = useDB(s=>s.db.variants)
  const [q,setQ]=useState('')
  const [show,setShow]=useState(false)
  const [editing,setEditing]=useState(null)
  const [form,setForm]=useState({ name:'', sku:'', barcode:'', category:'', brand:'', purchasePrice:'', sellingPrice:'', stock:'', minStock:'', unit:'পিস', supplier:'', expiry:'', batch:'', enableVariant:false, variantList:'' })

  const filtered = db.products.filter(p=>{
    if(!q) return true
    const hay = `${p.name} ${p.sku} ${p.barcode} ${p.category} ${p.brand}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  const openNew=()=>{
    setEditing(null); setForm({ name:'', sku:'', barcode:'', category:'', brand:'', purchasePrice:'', sellingPrice:'', stock:'', minStock:'', unit:'পিস', supplier:'', expiry:'', batch:'', enableVariant:false, variantList:''}); setShow(true)
  }
  const openEdit=(p)=>{
    const vars = variants.filter(v=>v.productId===p.id)
    setEditing(p)
    setForm({ name:p.name, sku:p.sku||'', barcode:p.barcode||'', category:p.category||'', brand:p.brand||'', purchasePrice:String(p.purchasePrice||''), sellingPrice:String(p.sellingPrice||''), stock:String(p.stock||''), minStock:String(p.minStock||''), unit:p.unit||'পিস', supplier:p.supplier||'', expiry:p.expiry||'', batch:p.batch||'', enableVariant: vars.length>0, variantList: vars.map(v=> `${v.name}:${v.stock||0}:${v.sellingPrice||p.sellingPrice||''}`).join('\n') })
    setShow(true)
  }
  const save=()=>{
    if(!form.name.trim()) return alert('পণ্যের নাম দিন')
    const base={ name:form.name.trim(), sku:form.sku.trim(), barcode:form.barcode.trim(), category:form.category.trim(), brand:form.brand.trim(), purchasePrice:Number(form.purchasePrice||0), sellingPrice:Number(form.sellingPrice||0), stock:Number(form.stock||0), minStock:Number(form.minStock||db.store.lowStockThreshold), unit:form.unit, supplier:form.supplier, expiry:form.expiry, batch:form.batch }
    let vars=[]
    if(form.enableVariant && form.variantList.trim()){
      vars = form.variantList.split('\n').map(l=>{
        const [name,stock,price]=l.split(':')
        if(!name) return null
        return { name:name.trim(), stock:Number(stock||0), sellingPrice:Number(price||base.sellingPrice), purchasePrice: base.purchasePrice, minStock: base.minStock }
      }).filter(Boolean)
      base.stock=0
    }
    if(editing) updateProduct(editing.id,{...base, variants: vars})
    else addProduct({...base, variants: vars})
    setShow(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2"><Package className="text-teal-700"/> পণ্য</h1>
        <button onClick={openNew} className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> পণ্য যোগ করুন</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="নাম, SKU, বারকোড দিয়ে খুঁজুন..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"/>
          </div>
          <div className="text-sm text-slate-600">মোট: {filtered.length} টি</div>
          {db.categories.length>0 && <div className="flex gap-2 flex-wrap">{db.categories.map(c=> <span key={c.id} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs">{c.name}</span>)}</div>}
          <button onClick={()=>{
            const n=prompt('নতুন ক্যাটাগরি নাম লিখুন')
            if(n) addCategory(n)
          }} className="px-3 py-2 rounded-xl border text-sm">+ ক্যাটাগরি</button>
        </div>
      </div>

      {filtered.length===0 ? (
        <EmptyState title="এখনো কোনো পণ্য যোগ করা হয়নি।" desc="আপনার দোকানের প্রথম পণ্যটি যোগ করুন। নাম, দাম, স্টক দিন এবং সংরক্ষণ করুন।" icon="📦" action={<button onClick={openNew} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold">প্রথম পণ্য যোগ করুন</button>} />
      ):(
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr><th className="text-left px-4 py-3">পণ্য</th><th className="text-left py-3">ক্যাটাগরি</th><th className="text-right py-3">ক্রয়</th><th className="text-right py-3">বিক্রয়</th><th className="text-right py-3">স্টক</th><th className="text-right px-4 py-3">অ্যাকশন</th></tr>
              </thead>
              <tbody>
                {filtered.map(p=>{
                  const vars = variants.filter(v=>v.productId===p.id)
                  return (
                    <tr key={p.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.sku||'—'} {p.barcode? `• ${p.barcode}`:''} {p.brand? `• ${p.brand}`:''}</div>
                        {vars.length>0 && <div className="text-xs text-teal-700 mt-1">{vars.map(v=> `${v.name} (${v.stock})`).join(', ')}</div>}
                      </td>
                      <td className="py-3"><span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{p.category||'—'}</span></td>
                      <td className="py-3 text-right">{formatTaka(p.purchasePrice)}</td>
                      <td className="py-3 text-right font-semibold">{formatTaka(p.sellingPrice)}</td>
                      <td className="py-3 text-right">
                        {vars.length? <span className="font-medium">{vars.reduce((a,v)=>a+Number(v.stock),0)}</span> : <span className={`${Number(p.stock)<= Number(p.minStock||db.store.lowStockThreshold)?'text-amber-700 font-bold':'font-medium'}`}>{p.stock}</span>}
                        <span className="text-xs text-slate-500"> {p.unit}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={()=>openEdit(p)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg"><Edit3 size={16}/></button>
                          <button onClick={()=>{ if(confirm(`"${p.name}" মুছবেন?`)) deleteProduct(p.id)}} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShow(false)}/>
          <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold">{editing? 'পণ্য সম্পাদনা':'নতুন পণ্য যোগ করুন'}</h3>
              <button onClick={()=>setShow(false)} className="p-2 hover:bg-slate-100 rounded-xl">✕</button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4 text-sm">
              <label className="md:col-span-2">পণ্যের নাম* <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300" placeholder="যেমন: Lakme Face Cream"/></label>
              <label>SKU / কোড <input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>বারকোড <input value={form.barcode} onChange={e=>setForm({...form,barcode:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>ক্যাটাগরি <input list="cats" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="কসমেটিক্স / জুতা / ভ্যারাইটিজ"/>
                <datalist id="cats">{db.categories.map(c=> <option key={c.id} value={c.name}/>)}</datalist>
              </label>
              <label>ব্র্যান্ড <input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>ক্রয় মূল্য <input type="number" value={form.purchasePrice} onChange={e=>setForm({...form,purchasePrice:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>বিক্রয় মূল্য* <input type="number" value={form.sellingPrice} onChange={e=>setForm({...form,sellingPrice:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>বর্তমান স্টক <input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>সর্বনিম্ন স্টক <input type="number" value={form.minStock} onChange={e=>setForm({...form,minStock:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>একক <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"><option>পিস</option><option>জোড়া</option><option>বক্স</option><option>কেজি</option><option>লিটার</option><option>মিটার</option></select></label>
              <label>সাপ্লায়ার <input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>ব্যাচ নং <input value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label>মেয়াদ (ঐচ্ছিক) <input type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
              <label className="md:col-span-2 flex items-center gap-2 mt-2"><input type="checkbox" checked={form.enableVariant} onChange={e=>setForm({...form,enableVariant:e.target.checked})}/> ভ্যারিয়েন্ট আছে (যেমন জুতার সাইজ)</label>
              {form.enableVariant && <label className="md:col-span-2">ভ্যারিয়েন্ট (প্রতি লাইনে: নাম:স্টক:দাম) <textarea value={form.variantList} onChange={e=>setForm({...form,variantList:e.target.value})} rows={4} className="mt-1 w-full p-3 rounded-xl border font-mono text-xs" placeholder={`Size 6:10:650\nSize 7:8:650\nSize 8:5:650`}/><span className="text-xs text-slate-500">উদা: Size 6:10:650 — প্রতি ভ্যারিয়েন্ট আলাদা স্টক রাখবে</span></label>}
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-2">
              <button onClick={()=>setShow(false)} className="px-4 py-2 rounded-xl border">বাতিল</button>
              <button onClick={save} className="px-6 py-2 rounded-xl bg-teal-700 text-white font-semibold">সংরক্ষণ করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
