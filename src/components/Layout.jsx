import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Boxes, ShoppingBag, Wrench, History, BarChart3, Wallet, Settings, LogOut, Menu, X, Store, Globe, Printer, ScanLine } from 'lucide-react'
import { useState } from 'react'
import { useDB, clearAuth, getAuth } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { getHW } from '../lib/hardware'

export default function Layout({children}){
  const [open,setOpen]=useState(false)
  const db = useDB(s=>s.db)
  const navigate = useNavigate()
  const auth = getAuth()
  const { lang, setLang, t } = useI18n()
  const hw = getHW()
  const nav = [
    {to:'/', label:t('nav.dashboard'), icon:LayoutDashboard},
    {to:'/pos', label:t('nav.pos'), icon:ShoppingCart},
    {to:'/products', label:t('nav.products'), icon:Package},
    {to:'/stock', label:t('nav.stock'), icon:Boxes},
    {to:'/purchases', label:t('nav.purchases'), icon:ShoppingBag},
    {to:'/services', label:t('nav.services'), icon:Wrench},
    {to:'/sales', label:t('nav.sales'), icon:History},
    {to:'/reports', label:t('nav.reports'), icon:BarChart3},
    {to:'/expenses', label:t('nav.expenses'), icon:Wallet},
    {to:'/settings', label:t('nav.settings'), icon:Settings},
  ]
  const storeName = lang==='bn' ? (db.store.name_bn||db.store.name) : db.store.name
  const proprietor = lang==='bn' ? (db.store.proprietor_bn||db.store.proprietor) : db.store.proprietor
  const address = lang==='bn' ? (db.store.address_bn||db.store.address) : db.store.address

  return (
    <div className="min-h-screen flex">
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={()=>setOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-[100dvh] z-50 bg-white border-r border-slate-200 flex flex-col w-[280px] shrink-0 transition ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="h-[64px] flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white"><Store size={18}/></div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold leading-none text-slate-900 truncate">{storeName}</div>
            <div className="text-[11px] text-slate-500 truncate">{proprietor} • {db.store.phone}</div>
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
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border rounded-xl px-2 py-1.5">
            <Printer size={12} className={hw.printerType==='browser'?'text-slate-400':'text-emerald-600'}/>
            <span className="truncate">{hw.printerType==='browser' ? (lang==='bn'?'ব্রাউজার প্রিন্ট':'Browser print') : hw.printerType}</span>
            <span className="ml-auto flex items-center gap-1"><ScanLine size={12} className={hw.scannerEnabled?'text-emerald-600':'text-slate-400'}/>{hw.printerWidth}mm</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">{t('nav.login')}</div>
            <div className="text-sm font-medium truncate">{auth?.username||'admin'}</div>
          </div>
          <button onClick={()=>{clearAuth(); navigate('/login')}} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"><LogOut size={16}/> {t('nav.logout')}</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[64px] sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center gap-2 px-3 md:px-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100" onClick={()=>setOpen(true)}><Menu size={20}/></button>
          <div className="flex-1 hidden md:block">
            <div className="text-sm text-slate-500">{t('nav.welcome')}</div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-1">
            <button onClick={()=>setLang('en')} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${lang==='en'?'bg-white shadow text-slate-900':'text-slate-600'}`}>EN</button>
            <button onClick={()=>setLang('bn')} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${lang==='bn'?'bg-white shadow text-slate-900':'text-slate-600'}`}>BN</button>
          </div>
          <button onClick={()=>setLang(lang==='en'?'bn':'en')} className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium hover:bg-slate-50" title="Toggle language"><Globe size={14}/>{lang==='en'?'বাংলা':'English'}</button>
          <NavLink to="/pos" className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-semibold shadow"> <ShoppingCart size={16}/><span className="hidden sm:inline">{t('nav.newSaleBtn')}</span><span className="sm:hidden">POS</span></NavLink>
          <div className="text-xs text-slate-600 hidden xl:block max-w-[260px] truncate text-right leading-tight">{address}</div>
        </header>
        <main className="p-4 md:p-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
