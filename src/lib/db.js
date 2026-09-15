import { create } from 'zustand'

const STORAGE_KEY = 'sajghor_db_v1'
const AUTH_KEY = 'sajghor_auth'

const defaultStore = {
  name: 'Sajghor Cosmetics & Varieties Center',
  proprietor: 'Md Rayhan Mia',
  phone: '01799-303374',
  address: 'Char Kashim Nagar, east of Natun More, Belab, Narsingdi',
  name_bn: 'সাজঘর কসমেটিক্স এন্ড ভ্যারাইটিজ সেন্টার',
  proprietor_bn: 'মোঃ রায়হান মিয়া',
  address_bn: 'চর কাশিম নগর-নতুন মোড়ের পূর্ব পার্শ্বে, বেলাব, নরসিংদী',
  logo: '',
  currency: 'BDT',
  invoicePrefix: 'INV-',
  allowNegativeStock: false,
  lowStockThreshold: 5,
  taxRate: 0,
  paymentMethods: { cash:true, bkash:true, nagad:true, other:true },
  hardware: { printerWidth:'80', autoPrint:true, cashDrawer:true, scannerEnabled:true, printerType:'browser' },
}

const defaultDB = {
  store: defaultStore,
  categories: [],
  products: [],
  variants: [],
  suppliers: [],
  purchases: [],
  services: [],
  customers: [],
  sales: [],
  expenses: [],
  returns: [],
  seq: { invoice: 0, product:0 },
}

function loadDB(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return structuredClone(defaultDB)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(defaultDB), ...parsed,
      store: { ...defaultStore, ...(parsed.store||{}) },
      seq: { ...defaultDB.seq, ...(parsed.seq||{}) }
    }
  }catch{ return structuredClone(defaultDB) }
}
function saveDB(db){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) }

export const useDB = create((set,get)=>({
  db: loadDB(),
  _save(mutator){
    const db = get().db
    const next = structuredClone(db)
    mutator(next)
    saveDB(next)
    set({db: next})
  },
  // store
  updateStore(patch){ get()._save(d=> Object.assign(d.store, patch)) },
  // categories
  addCategory(name){
    const cat={id:genId(), name:name.trim(), createdAt:new Date().toISOString()}
    get()._save(d=> d.categories.push(cat))
    return cat
  },
  deleteCategory(id){ get()._save(d=>{ d.categories=d.categories.filter(c=>c.id!==id)})},
  // products
  addProduct(p){
    const id=genId()
    const prod={ id, createdAt:new Date().toISOString(), ...p }
    get()._save(d=>{ d.products.push(prod); if(p.variants) d.variants.push(...p.variants.map(v=>({...v, id:genId(), productId:id}))) })
    return id
  },
  updateProduct(id, patch){
    get()._save(d=>{
      const i=d.products.findIndex(x=>x.id===id)
      if(i>=0) d.products[i]={...d.products[i], ...patch}
      if(patch.variants){
        d.variants=d.variants.filter(v=>v.productId!==id)
        d.variants.push(...patch.variants.map(v=>({...v, id:v.id||genId(), productId:id})))
      }
    })
  },
  deleteProduct(id){ get()._save(d=>{ d.products=d.products.filter(x=>x.id!==id); d.variants=d.variants.filter(v=>v.productId!==id)})},
  adjustStock(productId, variantId, delta){
    get()._save(d=>{
      if(variantId){
        const v=d.variants.find(x=>x.id===variantId)
        if(v) v.stock=(Number(v.stock)||0)+delta
      } else {
        const p=d.products.find(x=>x.id===productId)
        if(p) p.stock=(Number(p.stock)||0)+delta
      }
    })
  },
  // services
  addService(s){ const id=genId(); get()._save(d=> d.services.push({id, createdAt:new Date().toISOString(), ...s})); return id },
  updateService(id,patch){ get()._save(d=>{ const i=d.services.findIndex(x=>x.id===id); if(i>=0) d.services[i]={...d.services[i],...patch}})},
  deleteService(id){ get()._save(d=> d.services=d.services.filter(x=>x.id!==id))},
  // suppliers
  addSupplier(name){ const s={id:genId(), name, createdAt:new Date().toISOString()}; get()._save(d=> d.suppliers.push(s)); return s },
  // purchases
  addPurchase(p){
    get()._save(d=>{
      d.purchases.push(p)
      // update stock
      p.items.forEach(it=>{
        if(it.variantId){
          const v=d.variants.find(x=>x.id===it.variantId)
          if(v) v.stock=(Number(v.stock)||0)+ Number(it.qty)
        } else {
          const prod=d.products.find(x=>x.id===it.productId)
          if(prod) prod.stock=(Number(prod.stock)||0)+ Number(it.qty)
        }
      })
    })
  },
  // sales
  addSale(sale){
    get()._save(d=>{
      d.seq.invoice+=1
      sale.invoiceNo = `INV-${String(d.seq.invoice).padStart(6,'0')}`
      sale.id=genId()
      sale.createdAt=new Date().toISOString()
      d.sales.unshift(sale)
      sale.items.forEach(it=>{
        if(it.type==='product'){
          if(it.variantId){
            const v=d.variants.find(x=>x.id===it.variantId)
            if(v) v.stock=(Number(v.stock)||0)- Number(it.qty)
          } else {
            const p=d.products.find(x=>x.id===it.productId)
            if(p) p.stock=(Number(p.stock)||0)- Number(it.qty)
          }
        }
      })
    })
    return get().db.sales[0]
  },
  returnSale(saleId){
    get()._save(d=>{
      const sale=d.sales.find(s=>s.id===saleId)
      if(!sale || sale.status==='returned') return
      sale.status='returned'
      d.returns.push({id:genId(), saleId, createdAt:new Date().toISOString(), amount:sale.total})
      sale.items.forEach(it=>{
        if(it.type==='product'){
          if(it.variantId){
            const v=d.variants.find(x=>x.id===it.variantId)
            if(v) v.stock=(Number(v.stock)||0)+ Number(it.qty)
          } else {
            const p=d.products.find(x=>x.id===it.productId)
            if(p) p.stock=(Number(p.stock)||0)+ Number(it.qty)
          }
        }
      })
    })
  },
  // customers
  addCustomer(c){ const id=genId(); get()._save(d=> d.customers.push({id, createdAt:new Date().toISOString(), ...c})); return id },
  // expenses
  addExpense(e){ get()._save(d=> d.expenses.push({id:genId(), createdAt:new Date().toISOString(), ...e}))},
  deleteExpense(id){ get()._save(d=> d.expenses=d.expenses.filter(x=>x.id!==id))},

  // helpers
  resetAll(){ localStorage.removeItem(STORAGE_KEY); set({db: structuredClone(defaultDB)}) },
  exportJSON(){ return JSON.stringify(get().db,null,2)},
  importJSON(json){
    try{ const parsed=JSON.parse(json); saveDB(parsed); set({db: parsed}); return true }catch{return false}
  }
}))

function genId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6) }

// auth simple
export function getAuth(){ try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch{return null}}
export function setAuth(v){ localStorage.setItem(AUTH_KEY, JSON.stringify(v))}
export function clearAuth(){ localStorage.removeItem(AUTH_KEY)}

export function useComputed(){
  const db = useDB(s=>s.db)
  const today = new Date().toISOString().slice(0,10)
  const todaySales = db.sales.filter(s=> (s.createdAt||'').slice(0,10)===today && s.status!=='returned')
  const todayRevenue = todaySales.reduce((a,s)=>a+Number(s.total||0),0)
  const todayProfit = todaySales.reduce((a,s)=>{
    const cost = s.items.reduce((sum,it)=>{
      if(it.type==='service') return sum + (Number(it.cost||0)*Number(it.qty))
      return sum + (Number(it.purchasePrice||0)*Number(it.qty))
    },0)
    const revenue = s.items.reduce((sum,it)=> sum + (Number(it.price)*Number(it.qty)-Number(it.discount||0)),0)
    // discount already? s.total includes discount; better calc profit = revenue - cost but revenue = s.total? keep simple
    return a + (Number(s.total||0) - cost)
  },0)
  const lowStock = []
  db.products.forEach(p=>{
    const vars = db.variants.filter(v=>v.productId===p.id)
    if(vars.length){
      vars.forEach(v=>{ if((Number(v.stock)||0) <= Number(v.minStock||p.minStock||db.store.lowStockThreshold)) lowStock.push({...v, productName:p.name, type:'variant'}) })
    } else {
      if((Number(p.stock)||0) <= Number(p.minStock||db.store.lowStockThreshold)) lowStock.push({...p, productName:p.name, type:'product'})
    }
  })
  return { db, todaySales, todayRevenue, todayProfit, lowStock }
}
