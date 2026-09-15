import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../lib/db'
import { useDB } from '../lib/db'
import { Store } from 'lucide-react'

export default function Login(){
  const [user,setUser]=useState('admin')
  const [pass,setPass]=useState('admin123')
  const [err,setErr]=useState('')
  const nav=useNavigate()
  const db=useDB(s=>s.db)
  const submit=(e)=>{
    e.preventDefault()
    if(!user || !pass){ setErr('ব্যবহারকারী ও পাসওয়ার্ড দিন'); return}
    // simple local auth — accept any but store; default admin/admin123
    // if user changes password later stored in localStorage auth
    setAuth({username:user})
    nav('/')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50 p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-teal-700 px-8 py-7 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><Store/></div>
            <div>
              <div className="font-bold leading-none">{db.store.name}</div>
              <div className="text-xs opacity-80 mt-1">{db.store.proprietor} • {db.store.phone}</div>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-6">POS এ লগইন করুন</h1>
          <p className="text-sm opacity-80 mt-1">দোকানের ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন</p>
        </div>
        <form onSubmit={submit} className="p-7 space-y-4">
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl">{err}</div>}
          <div>
            <label className="text-sm font-medium text-slate-700">ব্যবহারকারীর নাম</label>
            <input value={user} onChange={e=>setUser(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="admin" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">পাসওয়ার্ড</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••" />
            <div className="text-xs text-slate-500 mt-1">ডিফল্ট: admin / admin123</div>
          </div>
          <button type="submit" className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold">প্রবেশ করুন</button>
          <div className="text-center text-xs text-slate-500">{db.store.address}</div>
        </form>
      </div>
    </div>
  )
}
