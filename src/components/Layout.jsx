import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Boxes, ShoppingBag, Wrench, History, BarChart3, Wallet, Settings, LogOut, Menu, X, Store } from 'lucide-react'
import { useState } from 'react'
import { useDB } from '../lib/db'
import { clearAuth, getAuth } from '../lib/db'

const nav = [
  {to:'/', label:'ড্যাশবোর্ড', icon:LayoutDashboard},
  {to:'/pos', label:'নতুন বিক্রয়', icon:ShoppingCart},
  {to:'/products', label:'পণ্য', icon:Package},
  {to:'/stock', label:'স্টক', icon:Boxes},
  {to:'/purchases', label:'ক্রয়', icon:ShoppingBag},
  {to:'/services', label:'সার্ভিস', icon:Wrench},
  {to:'/sales', label:'বিক্রয় ইতিহাস', icon:History},
  {to:'/reports', label:'রিপোর্ট', icon:BarChart3},
  {to:'/expenses', label:'খরচ', icon:Wallet},
  {to:'/settings', label:'সেটিংস', icon:Settings},
]

export default function Layout({children}){
  const [open,setOpen]=useState(false)
  const db = useDB(s=>s.db)
  const navigate = useNavigate()
  const location = useLocation()
  const auth = getAuth()

  return (
    <div className="min-h-screen flex">
      {/* mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={()=>setOpen(false)} />}
      {/* sidebar */}
      <aside className={`fixed lg:sticky top-0 h-[100dvh] z-50 bg-white border-r border-slate-200 flex flex-col w-[280px] shrink-0 transition ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="h-[64px] flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white"><Store size={18}/></div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold leading-none text-slate-900 truncate">{db.store.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{db.store.proprietor} • {db.store.phone}</div>
          </div>
          <button className="lg:hidden p-2" onClick={()=>setOpen(false)}><X size={18}/></button>
        </div>
        <nav className="flex-1 overflow-auto p-3 space-y-1">
          {nav.map(n=>{
            const Icon=n.icon
            return (
              <NavLink key={n.to} to={n.to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition ${isActive?'bg-teal-700 text-white shadow-sm':'text-slate-700 hover:bg-slate-50'}`}>
                <Icon size={18}/>{n.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 mb-2">
            <div className="text-xs text-slate-500">লগইন:</div>
            <div className="text-sm font-medium truncate">{auth?.username||'অ্যাডমিন'}</div>
          </div>
          <button onClick={()=>{clearAuth(); navigate('/login')}} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"><LogOut size={16}/> লগআউট</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[64px] sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100" onClick={()=>setOpen(true)}><Menu size={20}/></button>
          <div className="flex-1">
            <div className="text-sm text-slate-500 hidden md:block">স্বাগতম, দৈনিক কার্যক্রম দ্রুত সম্পন্ন করুন</div>
          </div>
          <NavLink to="/pos" className="hidden sm:inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow"> <ShoppingCart size={16}/> নতুন বিক্রয়</NavLink>
          <div className="text-xs text-slate-600 hidden lg:block max-w-[260px] truncate text-right leading-tight">{db.store.address}</div>
        </header>
        <main className="p-4 md:p-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
