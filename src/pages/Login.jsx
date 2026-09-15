import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth, useDB } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { Store, Globe } from 'lucide-react'

export default function Login(){
  const [user,setUser]=useState('admin')
  const [pass,setPass]=useState('admin123')
  const [err,setErr]=useState('')
  const nav=useNavigate()
  const db=useDB(s=>s.db)
  const { t, lang, setLang } = useI18n()
  const storeName = lang==='bn' ? (db.store.name_bn||db.store.name) : db.store.name
  const proprietor = lang==='bn' ? (db.store.proprietor_bn||db.store.proprietor) : db.store.proprietor
  const address = lang==='bn' ? (db.store.address_bn||db.store.address) : db.store.address
  const submit=(e)=>{
    e.preventDefault()
    if(!user || !pass){ setErr(t('login.err')); return}
    setAuth({username:user})
    nav('/')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50 p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-1 bg-white rounded-full p-1 shadow border">
          <button onClick={()=>setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==='en'?'bg-slate-900 text-white':'text-slate-600'}`}>EN</button>
          <button onClick={()=>setLang('bn')} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==='bn'?'bg-slate-900 text-white':'text-slate-600'}`}>BN</button>
        </div>
        <div className="bg-teal-700 px-8 py-7 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><Store/></div>
            <div>
              <div className="font-bold leading-none">{storeName}</div>
              <div className="text-xs opacity-80 mt-1">{proprietor} • {db.store.phone}</div>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-6">{t('login.title')}</h1>
          <p className="text-sm opacity-80 mt-1">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={submit} className="p-7 space-y-4">
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl">{err}</div>}
          <div>
            <label className="text-sm font-medium text-slate-700">{t('login.user')}</label>
            <input value={user} onChange={e=>setUser(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="admin" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">{t('login.pass')}</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••" />
            <div className="text-xs text-slate-500 mt-1">{t('login.default')}</div>
          </div>
          <button type="submit" className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold">{t('login.btn')}</button>
          <div className="text-center text-xs text-slate-500">{address}</div>
        </form>
      </div>
    </div>
  )
}
