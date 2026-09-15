import { useState, useMemo } from 'react'
import { useDB } from '../lib/db'
import { formatTaka } from '../lib/utils'
import { Search, Plus, Minus, Trash2, Printer, X } from 'lucide-react'

export default function POS(){
  const db = useDB(s=>s.db)
  const addSale = useDB(s=>s.addSale)
  const variants = db.variants
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('সব')
  const [cart,setCart]=useState([])
  const [discount,setDiscount]=useState(0)
  const [payment,setPayment]=useState('cash')
  const [received,setReceived]=useState('')
  const [customer,setCustomer]=useState('Walk-in Customer')
  const [customerPhone,setCustomerPhone]=useState('')
  const [showInvoice,setShowInvoice]=useState(null)

  const cats = ['সব', ...Array.from(new Set([...db.categories.map(c=>c.name), 'কসমেটিক্স','জুতা','ভ্যারাইটিজ','ফটো','ফটোকপি','প্রিন্ট','অন্যান্য']))]
  const filteredProducts = useMemo(()=>{
    return db.products.filter(p=>{
      if(cat!=='সব' && p.category!==cat) return false
      if(!q) return true
      const hay=`${p.name} ${p.sku} ${p.barcode} ${p.category}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  },[db.products,q,cat])
  const filteredServices = useMemo(()=>{
    if(!q) return db.services
    return db.services.filter(s=> `${s.name} ${s.category}`.toLowerCase().includes(q.toLowerCase()))
  },[db.services,q])

  const addToCart=(item)=>{
    setCart(c=>{
      const idx=c.findIndex(x=> x.key===item.key)
      if(idx>=0){ const n=[...c]; n[idx].qty+=1; return n }
      return [...c, {...item, qty:1, discount:0}]
    })
  }
  const updateQty=(key,delta)=>{
    setCart(c=> c.map(x=> x.key===key? {...x, qty: Math.max(1, x.qty+delta)}:x))
  }
  const changeQty=(key, v)=>{
    const n=Number(v)||1
    setCart(c=> c.map(x=> x.key===key? {...x, qty: Math.max(1,n)}:x))
  }
  const removeItem=(key)=> setCart(c=> c.filter(x=>x.key!==key))
  const lineTotal=(it)=> (Number(it.price)*it.qty) - Number(it.discount||0)
  const subtotal = cart.reduce((a,it)=> a+ Number(it.price)*it.qty,0)
  const itemDiscount = cart.reduce((a,it)=> a+ Number(it.discount||0),0)
  const total = subtotal - itemDiscount - Number(discount||0)
  const change = Number(received||0) - total

  const canPay = cart.length>0 && total>=0 && (payment!=='cash' || received==='' || Number(received)>= total || true)

  const checkout=()=>{
    if(cart.length===0) return
    if(payment==='cash' && received!=='' && Number(received) < total) return alert('প্রাপ্ত টাকা কম!')
    const sale={
      invoiceNo:'',
      items: cart.map(it=> ({
        type: it.type, productId: it.productId, variantId: it.variantId||null,
        name: it.name, variantName: it.variantName||'', price: Number(it.price), qty:Number(it.qty), discount:Number(it.discount||0), purchasePrice: Number(it.purchasePrice||0), cost: Number(it.cost||0)
      })),
      subtotal, discount: Number(discount||0)+itemDiscount, total, paymentMethod: payment, received: Number(received||0), change: payment==='cash'? Math.max(0,change):0,
      customerName: customer||'Walk-in Customer', customerPhone, status:'completed'
    }
    const saved = addSale(sale)
    setShowInvoice(saved)
    setCart([]); setDiscount(0); setReceived(''); setCustomer('Walk-in Customer'); setCustomerPhone('')
  }

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      {/* left: search & products */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="পণ্য / SKU / বারকোড / সার্ভিস খুঁজুন..." className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-[15px]"/>
          </div>
          <div className="mt-3 flex gap-2 overflow-auto pb-1">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border ${cat===c?'bg-teal-700 text-white border-teal-700':'bg-white hover:bg-slate-50'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold text-sm">পণ্য</h3>
          {filteredProducts.length===0 ? (
            <div className="text-center py-8 text-sm text-slate-500">কোনো পণ্য পাওয়া যায়নি।</div>
          ):(
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-auto pr-1">
              {filteredProducts.map(p=>{
                const vars = variants.filter(v=>v.productId===p.id)
                if(vars.length){
                  return vars.map(v=>(
                    <button key={v.id} onClick={()=>addToCart({key:v.id, type:'product', productId:p.id, variantId:v.id, name:p.name, variantName:v.name, price: Number(v.sellingPrice||p.sellingPrice), purchasePrice: Number(v.purchasePrice||p.purchasePrice), stock: v.stock})} className="text-left p-3 rounded-xl border hover:border-teal-500 hover:bg-teal-50/50 transition">
                      <div className="text-sm font-medium leading-tight">{p.name}</div>
                      <div className="text-xs text-teal-700 font-medium">{v.name}</div>
                      <div className="text-xs text-slate-500 mt-1">স্টক: {v.stock} {p.unit}</div>
                      <div className="text-sm font-bold mt-1">{formatTaka(v.sellingPrice||p.sellingPrice)}</div>
                    </button>
                  ))
                }
                return (
                  <button key={p.id} onClick={()=>addToCart({key:p.id, type:'product', productId:p.id, name:p.name, price:Number(p.sellingPrice), purchasePrice:Number(p.purchasePrice), stock:p.stock })} className="text-left p-3 rounded-xl border hover:border-teal-500 hover:bg-teal-50/50 transition">
                    <div className="text-sm font-medium leading-tight">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.category||''} {p.sku? `• ${p.sku}`:''}</div>
                    <div className="text-xs text-slate-500 mt-1">স্টক: {p.stock} {p.unit}</div>
                    <div className="text-sm font-bold mt-1">{formatTaka(p.sellingPrice)}</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold text-sm">সার্ভিস</h3>
          {filteredServices.length===0 ? <div className="text-center py-6 text-sm text-slate-500">কোনো সার্ভিস নেই। সেটিংস থেকে যোগ করুন।</div> : (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredServices.map(s=>(
                <button key={s.id} onClick={()=>addToCart({key:'svc-'+s.id, type:'service', serviceId:s.id, name:s.name, price:Number(s.price), cost:Number(s.cost||0)})} className="text-left p-3 rounded-xl border hover:border-amber-400 hover:bg-amber-50 transition">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.unit||'per item'}</div>
                  <div className="text-sm font-bold mt-1">{formatTaka(s.price)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* right: cart */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-fit lg:sticky top-[72px]">
        <div className="p-4 border-b">
          <h2 className="font-bold">কার্ট — {cart.length} আইটেম</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <label>কাস্টমার <input value={customer} onChange={e=>setCustomer(e.target.value)} className="mt-1 w-full h-9 px-2 rounded-lg border" placeholder="Walk-in Customer"/></label>
            <label>মোবাইল <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} className="mt-1 w-full h-9 px-2 rounded-lg border" placeholder="01..."/></label>
          </div>
        </div>

        <div className="flex-1 overflow-auto max-h-[360px]">
          {cart.length===0 ? (
            <div className="py-10 text-center text-sm text-slate-500">কার্ট খালি — বাম থেকে পণ্য যোগ করুন</div>
          ): cart.map(it=>(
            <div key={it.key} className="flex gap-3 p-3 border-b hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{it.name} {it.variantName? `(${it.variantName})`:''}</div>
                <div className="text-xs text-slate-500">{it.type==='product'?'পণ্য':'সার্ভিস'} • {formatTaka(it.price)} </div>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={()=>updateQty(it.key,-1)} className="w-7 h-7 grid place-items-center border rounded-lg hover:bg-white"><Minus size={14}/></button>
                  <input type="number" value={it.qty} onChange={e=>changeQty(it.key, e.target.value)} className="w-12 h-7 text-center border rounded-lg text-sm"/>
                  <button onClick={()=>updateQty(it.key,1)} className="w-7 h-7 grid place-items-center border rounded-lg hover:bg-white"><Plus size={14}/></button>
                  <span className="ml-2 text-sm font-semibold">{formatTaka(lineTotal(it))}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={()=>removeItem(it.key)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                <input type="number" value={it.discount} onChange={e=> setCart(c=> c.map(x=> x.key===it.key? {...x, discount:Number(e.target.value)||0}:x))} placeholder="ছাড়" className="w-20 h-7 px-2 border rounded-lg text-xs" title="লাইন ছাড়"/>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-3 bg-slate-50 rounded-b-2xl">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">সাবটোটাল</span><span className="font-medium">{formatTaka(subtotal)}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-600">অতিরিক্ত ছাড়</span><input type="number" value={discount} onChange={e=>setDiscount(e.target.value)} className="w-24 h-8 px-2 border rounded-lg text-right"/></div>
            <div className="flex justify-between text-[16px] font-bold border-t pt-2"><span>মোট</span><span>{formatTaka(total)}</span></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              ['cash','ক্যাশ'],
              ['bkash','bKash'],
              ['nagad','Nagad'],
              ['other','অন্যান্য'],
            ].map(([v,l])=>(
              <button key={v} onClick={()=>setPayment(v)} className={`h-9 rounded-xl border text-sm font-medium ${payment===v?'bg-teal-700 text-white border-teal-700':'bg-white hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          {payment==='cash' && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs">প্রাপ্ত টাকা <input type="number" value={received} onChange={e=>setReceived(e.target.value)} className="mt-1 w-full h-9 px-2 rounded-xl border" placeholder={String(total)}/></label>
              <div className="text-xs">ফেরত <div className="mt-1 h-9 grid place-items-center rounded-xl bg-white border font-bold">{formatTaka(Math.max(0,change))}</div></div>
            </div>
          )}
          <button onClick={checkout} disabled={cart.length===0} className="w-full h-11 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl font-bold">বিক্রয় সম্পন্ন করুন — {formatTaka(total)}</button>
          <div className="text-[11px] text-slate-500 text-center">bKash/Nagad শুধু রেকর্ড হিসেবে সংরক্ষিত হবে (API ইন্টিগ্রেশন নেই)</div>
        </div>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShowInvoice(null)} />
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden">
            <div id="invoice-print" className="p-6">
              <div className="text-center border-b pb-4">
                <div className="font-bold text-[16px]">{db.store.name}</div>
                <div className="text-xs text-slate-600">{db.store.proprietor} • {db.store.phone}</div>
                <div className="text-xs text-slate-600">{db.store.address}</div>
              </div>
              <div className="flex justify-between text-xs mt-3">
                <div>ইনভয়েস: <span className="font-mono font-bold">{showInvoice.invoiceNo}</span></div>
                <div>{new Date(showInvoice.createdAt).toLocaleString('bn-BD')}</div>
              </div>
              {showInvoice.customerName!=='Walk-in Customer' && <div className="text-xs mt-1">কাস্টমার: {showInvoice.customerName} {showInvoice.customerPhone? `• ${showInvoice.customerPhone}`:''}</div>}
              <table className="w-full text-xs mt-3">
                <thead><tr className="border-y"><th className="text-left py-1">আইটেম</th><th className="text-right">পরিমাণ</th><th className="text-right">মোট</th></tr></thead>
                <tbody>
                  {showInvoice.items.map((it,i)=>(
                    <tr key={i} className="border-b"><td className="py-1">{it.name}{it.variantName?` (${it.variantName})`:''}<br/><span className="text-slate-500">{formatTaka(it.price)} × {it.qty}{it.discount? ` - ${formatTaka(it.discount)}`:''}</span></td><td className="text-right">{it.qty}</td><td className="text-right font-medium">{formatTaka(it.price*it.qty - (it.discount||0))}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs space-y-1 mt-3">
                <div className="flex justify-between"><span>সাবটোটাল</span><span>{formatTaka(showInvoice.subtotal)}</span></div>
                <div className="flex justify-between"><span>ছাড়</span><span>-{formatTaka(showInvoice.discount)}</span></div>
                <div className="flex justify-between font-bold text-sm border-t pt-2"><span>মোট</span><span>{formatTaka(showInvoice.total)}</span></div>
                <div className="flex justify-between"><span>পেমেন্ট</span><span>{showInvoice.paymentMethod}</span></div>
                {showInvoice.paymentMethod==='cash' && <><div className="flex justify-between"><span>প্রাপ্ত</span><span>{formatTaka(showInvoice.received)}</span></div><div className="flex justify-between"><span>ফেরত</span><span>{formatTaka(showInvoice.change)}</span></div></>}
              </div>
              <div className="text-center text-sm mt-4 pt-3 border-t">ধন্যবাদ, আবার আসবেন।</div>
            </div>
            <div className="p-4 flex gap-2 bg-slate-50 border-t">
              <button onClick={()=>window.print()} className="flex-1 h-10 bg-teal-700 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"><Printer size={16}/> প্রিন্ট</button>
              <button onClick={()=>setShowInvoice(null)} className="px-4 h-10 border rounded-xl bg-white inline-flex items-center gap-2"><X size={16}/> বন্ধ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
