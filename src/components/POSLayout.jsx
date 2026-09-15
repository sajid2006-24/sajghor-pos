import { Link } from 'react-router-dom'
import { Store, ScanLine, Printer, ArrowLeft, Clock, Smartphone } from 'lucide-react'
import { useDB } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { getHW } from '../lib/hardware'
import { useEffect, useState } from 'react'

export default function POSLayout({children}){
  const db=useDB(s=>s.db)
  const { lang, setLang, t } = useI18n()
  const hw=getHW()
  const [now,setNow]=useState(new Date())
  useEffect(()=>{ const i=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(i)},[])
  const storeName = lang==='bn' ? (db.store.name_bn||db.store.name) : db.store.name

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <header className="h-[56px] sticky top-0 z-40 bg-slate-900 text-white flex items-center gap-2 px-3 md:px-4 shadow">
        <div className="w-8 h-8 rounded-lg bg-teal-600 grid place-items-center"><Store size={16}/></div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold tracking-widest text-teal-300 uppercase leading-none">POS TERMINAL</div>
          <div className="text-[13px] font-bold truncate leading-none mt-0.5">{storeName} • {db.store.phone}</div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
          <ScanLine size={12} className={hw.scannerEnabled?'text-emerald-400':'text-white/40'}/><span>{hw.scannerEnabled?'Scanner':'Scanner off'}</span>
          <span className="opacity-30">|</span><Printer size={12}/><span>{hw.printerWidth}mm {hw.printerType}</span>
          <span className="opacity-30">|</span><Smartphone size={12}/><span>Mobile scan</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
          <Clock size={12}/>{now.toLocaleTimeString(lang==='bn'?'bn-BD':'en-GB', {hour:'2-digit', minute:'2-digit'})}
        </div>
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
          <button onClick={()=>setLang('en')} className={`px-2.5 py-1 rounded-full text-xs font-bold ${lang==='en'?'bg-white text-slate-900':'text-white/70'}`}>EN</button>
          <button onClick={()=>setLang('bn')} className={`px-2.5 py-1 rounded-full text-xs font-bold ${lang==='bn'?'bg-white text-slate-900':'text-white/70'}`}>BN</button>
        </div>
        <Link to="/admin" className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100"><ArrowLeft size={14}/>{lang==='bn'?'অ্যাডমিন':'Admin'}</Link>
        <Link to="/admin" className="md:hidden p-2 rounded-full bg-white text-slate-900"><ArrowLeft size={16}/></Link>
      </header>
      <div className="flex-1 p-3 md:p-4 max-w-[1600px] w-full mx-auto">
        {children}
      </div>
      <div className="sticky bottom-0 bg-white border-t px-3 py-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> {lang==='bn'?'হার্ডওয়্যার রেডি — বারকোড/প্রিন্টার/ড্রয়ার':'Hardware Ready — Barcode / Printer / Drawer'}</span>
        <Link to="/admin/hardware" className="text-teal-700 font-medium hover:underline">{lang==='bn'?'কানেকশন গাইড →':'Connection Guide →'}</Link>
      </div>
    </div>
  )
}
