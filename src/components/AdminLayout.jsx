import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Package, Boxes, ShoppingBag, Wrench, History, BarChart3, Wallet, Settings, LogOut, Menu, X, Store, Printer, ScanLine, ShoppingCart, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useDB, clearAuth, getAuth } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { getHW } from '../lib/hardware'

export default function AdminLayout({children}){
  const [open,setOpen]=useState(false)
  const db = useDB(s=>s.db)
  const navigate = useNavigate()
  const auth = getAuth()
  const { lang, setLang, t } = useI18n()
  const hw = getHW()
  const nav = [
    {to:'/admin', label:t('nav.dashboard'), icon:LayoutDashboard, exact:true},
    {to:'/admin/products', label:t('nav.products'), icon:Package},
    {to:'/admin/stock', label:t('nav.stock'), icon:Boxes},
    {to:'/admin/purchases', label:t('nav.purchases'), icon:ShoppingBag},
    {to:'/admin/services', label:t('nav.services'), icon:Wrench},
    {to:'/admin/sales', label:t('nav.sales'), icon:History},
    {to:'/admin/reports', label:t('nav.reports'), icon:BarChart3},
    {to:'/admin/expenses', label:t('nav.expenses'), icon:Wallet},
    {to:'/admin/hardware', label: lang==='bn'?'হার্ডওয়্যার গাইড':'Hardware Guide', icon:HelpCircle},
    {to:'/admin/settings', label:t('nav.settings'), icon:Settings},
  ]
  const storeName = lang==='bn' ? (db.store.name_bn||db.store.name) : db.store.name
  const proprietor = lang==='bn' ? (db.store.proprietor_bn||db.store.proprietor) : db.store.proprietor
  const address = lang==='bn' ? (db.store.address_bn||db.store.address) : db.store.address

  return (
    <div className="min-h-screen flex">
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={()=>setOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-[100dvh] z-50 bg-white border-r border-slate-200 flex flex-col w-[280px] shrink-0 transition ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="h-[64px] flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white"><Store size={18}/></div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-widest text-teal-700 uppercase">Admin</div>
            <div className="text-[13px] font-bold leading-none text-slate-900 truncate">{storeName}</div>
            <div className="text-[11px] text-slate-500 truncate">{proprietor} • {db.store.phone}</div>
          </div>
          <button className="lg:hidden p-2" onClick={()=>setOpen(false)}><X size={18}/></button>
        </div>
        <div className="p-3">
          <Link to="/pos" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow">
            <ShoppingCart size={16}/> {lang==='bn'?'POS টার্মিনাল খুলুন':'Open POS Terminal'} →
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-3 pt-0 space-y-1">
          {nav.map(n=>{
            const Icon=n.icon
            return (
              <NavLink key={n.to} to={n.to} end={n.exact} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition ${isActive?'bg-slate-900 text-white shadow':'text-slate-700 hover:bg-slate-50'}`}>
                <Icon size={18}/>{n.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-2">
            <ScanLine size={12} className="text-emerald-600"/>
            <span className="font-medium">{lang==='bn'?'হার্ডওয়্যার রেডি':'Hardware Ready'}</span>
            <span className="ml-auto flex items-center gap-1.5"><Printer size={12}/>{hw.printerWidth}mm • {hw.printerType}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">{t('nav.login')}</div>
            <div className="text-sm font-medium truncate">{auth?.username||'admin'}</div>
          </div>
          <button onClick={()=>{clearAuth(); navigate('/login')}} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"><LogOut size={16}/> {t('nav.logout')}</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[64px] sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center gap-2 px-3 md:px-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100" onClick={()=>setOpen(true)}><Menu size={20}/></button>
          <div className="hidden md:block flex-1">
            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Admin Dashboard</div>
            <div className="text-sm text-slate-600 -mt-0.5">{t('nav.welcome')}</div>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 rounded-full p-1 shadow-inner">
            <button onClick={()=>setLang('en')} className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${lang==='en'?'bg-white text-slate-900 shadow':'text-white/70 hover:text-white'}`}>EN</button>
            <button onClick={()=>setLang('bn')} className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${lang==='bn'?'bg-white text-slate-900 shadow':'text-white/70 hover:text-white'}`}>BN</button>
          </div>
          <div className="text-xs text-slate-600 hidden xl:block max-w-[260px] truncate text-right leading-tight">{address}</div>
        </header>
        <main className="p-4 md:p-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
