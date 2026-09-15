import { useState } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import { Plus } from 'lucide-react'
import { useI18n } from '../lib/i18n'

export default function Purchases(){
  const { t, lang } = useI18n()
  const db=useDB(s=>s.db)
  const addPurchase=useDB(s=>s.addPurchase)
  const addSupplier=useDB(s=>s.addSupplier)
  const [show,setShow]=useState(false)
  const [supplier,setSupplier]=useState('')
  const [date,setDate]=useState(new Date().toISOString().slice(0,10))
  const [note,setNote]=useState('')
  const [items,setItems]=useState([{productId:'', variantId:'', qty:1, price:''}])

  const save=()=>{
    if(!supplier.trim()) return alert(t('pur.alertSupplier'))
    if(items.some(i=> !i.productId || !i.qty || !i.price)) return alert(t('pur.alertItems'))
    let sup = db.suppliers.find(s=> s.name.toLowerCase()===supplier.toLowerCase())
    if(!sup) sup = addSupplier(supplier)
    const purchase={ id: Date.now().toString(36), supplier: supplier.trim(), supplierId: sup?.id||null, date, note, items: items.map(i=> ({productId:i.productId, variantId:i.variantId||null, qty:Number(i.qty), price:Number(i.price)})), total: items.reduce((a,i)=> a+ Number(i.qty)*Number(i.price),0), createdAt:new Date().toISOString()}
    addPurchase(purchase)
    setShow(false); setItems([{productId:'', variantId:'', qty:1, price:''}]); setSupplier(''); setNote('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('pur.title')}</h1>
        <button onClick={()=>setShow(true)} className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"><Plus size={16}/> {t('pur.new')}</button>
      </div>

      {db.purchases.length===0 ? (
        <EmptyState title={t('pur.noTitle')} desc={t('pur.noDesc')} icon="🧾" action={<button onClick={()=>setShow(true)} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold">{t('pur.first')}</button>} />
      ):(
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="text-left px-4 py-3">{t('pur.tableDate')}</th><th className="text-left py-3">{t('pur.tableSupplier')}</th><th className="text-left py-3">{t('pur.tableItems')}</th><th className="text-right py-3">{t('pur.tableTotal')}</th><th className="text-left px-4 py-3">{t('pur.tableNote')}</th></tr></thead>
              <tbody>
                {db.purchases.map(p=>(
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 text-xs">{p.date} <div className="text-slate-500">{new Date(p.createdAt).toLocaleTimeString(lang==='bn' ? 'bn-BD' : 'en-US')}</div></td>
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
            <div className="sticky top-0 bg-white border-b px-6 py-4 font-semibold">{t('purnewTitle')}</div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid md:grid-cols-3 gap-3">
                <label>{t('pur.supplierLabel')} <input value={supplier} onChange={e=>setSupplier(e.target.value)} list="sups" placeholder={t('pur.supplierPlaceholder')} className="mt-1 w-full h-10 px-3 rounded-xl border"/><datalist id="sups">{db.suppliers.map(s=> <option key={s.id} value={s.name}/>)}</datalist></label>
                <label>{t('pur.dateLabel')} <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
                <label>{t('pur.noteLabel')} <input value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder={t('pur.notePlaceholder')}/></label>
              </div>
              <div className="space-y-3">
                {items.map((it,idx)=>(
                  <div key={idx} className="grid md:grid-cols-[1fr_140px_120px_120px_40px] gap-2 items-end p-3 rounded-xl border bg-slate-50">
                    <label>{t('pur.productLabel')}
                      <select value={it.productId} onChange={e=>{
                        const pid=e.target.value
                        const prod=db.products.find(x=>x.id===pid)
                        setItems(arr=> arr.map((x,i)=> i===idx? {...x, productId:pid, variantId:'', price: prod? String(prod.purchasePrice||''):x.price}:x))
                      }} className="mt-1 w-full h-9 px-2 rounded-lg border bg-white">
                        <option value="">{t('pur.selectProduct')}</option>
                        {db.products.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </label>
                    <label>{t('pur.variantLabel')}
                      <select value={it.variantId} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, variantId:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border bg-white">
                        <option value="">—</option>
                        {db.variants.filter(v=>v.productId===it.productId).map(v=> <option key={v.id} value={v.id}>{v.name} ({t('common.stock')} {v.stock})</option>)}
                      </select>
                    </label>
                    <label>{t('pur.qtyLabel')} <input type="number" value={it.qty} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, qty:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border"/></label>
                    <label>{t('pur.priceLabel')} <input type="number" value={it.price} onChange={e=> setItems(a=> a.map((x,i)=> i===idx? {...x, price:e.target.value}:x))} className="mt-1 w-full h-9 px-2 rounded-lg border"/></label>
                    <button onClick={()=> setItems(a=> a.filter((_,i)=> i!==idx))} className="h-9 px-2 rounded-lg border bg-white hover:bg-red-50 text-red-600">✕</button>
                  </div>
                ))}
                <button onClick={()=> setItems(a=> [...a, {productId:'', variantId:'', qty:1, price:''}])} className="px-3 py-2 rounded-xl border text-sm">{t('pur.addItem')}</button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-2"><button onClick={()=>setShow(false)} className="px-4 py-2 rounded-xl border">{t('common.cancel')}</button><button onClick={save} className="px-6 py-2 rounded-xl bg-teal-700 text-white font-semibold">{t('common.save')}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
