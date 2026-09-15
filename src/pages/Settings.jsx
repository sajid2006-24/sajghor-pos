import { useState, useEffect } from 'react'
import { useDB } from '../lib/db'
import { useI18n } from '../lib/i18n'
import { loadHW, saveHW, testPrint, openCashDrawer, pairSerialPrinter, pairUsbPrinter } from '../lib/hardware'
import { Globe, Printer, ScanLine, Cpu } from 'lucide-react'

export default function Settings(){
  const db=useDB(s=>s.db)
  const updateStore=useDB(s=>s.updateStore)
  const resetAll=useDB(s=>s.resetAll)
  const exportJSON=useDB(s=>s.exportJSON)
  const importJSON=useDB(s=>s.importJSON)
  const { t, lang, setLang } = useI18n()
  const [form,setForm]=useState(db.store)
  const [hw,setHw]=useState(loadHW())
  useEffect(()=>{ setForm(db.store); setHw(loadHW()) },[db.store])
  const save=()=>{ updateStore(form); saveHW(hw); alert(lang==='bn'?'সংরক্ষিত হয়েছে':'Saved') }
  const doExport=()=>{
    const blob=new Blob([exportJSON()],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a'); a.href=url; a.download=`sajghor-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const doImport=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader(); r.onload=()=>{ const ok=importJSON(r.result); alert(ok?(lang==='bn'?'ইমপোর্ট সফল':'Import successful'): (lang==='bn'?'ফাইল সঠিক নয়':'Invalid file'))}; r.readAsText(file)
  }
  const onHwChange=(patch)=>{ const n=saveHW(patch); setHw(n); updateStore({hardware:n}) }

  return (
    <div className="space-y-6 max-w-[900px]">
      <h1 className="text-xl font-bold">{t('set.title')}</h1>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Globe size={18}/>{t('set.language')}</h2>
        <div className="flex gap-2">
          <button onClick={()=>setLang('en')} className={`flex-1 py-3 rounded-xl border-2 font-semibold ${lang==='en'?'border-teal-700 bg-teal-50 text-teal-800':'border-slate-200'}`}>🇬🇧 English (Default)</button>
          <button onClick={()=>setLang('bn')} className={`flex-1 py-3 rounded-xl border-2 font-semibold ${lang==='bn'?'border-teal-700 bg-teal-50 text-teal-800':'border-slate-200'}`}>🇧🇩 বাংলা</button>
        </div>
        <p className="text-xs text-slate-500">Default is English. Toggle anytime from header or here.</p>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Cpu size={18} className="text-teal-700"/>{t('set.hardware')} <span className="text-xs font-normal bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">Hardware Ready</span></h2>
        <p className="text-sm text-slate-600">{t('set.hardwareDesc')} — USB HID scanners (keyboard wedge), Serial/USB thermal printers (ESC/POS), cash drawer kick (ESC p), weighing scale.</p>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <label>{t('set.printer')} <span className="text-slate-400">({hw.printerType})</span>
            <select value={hw.printerType} onChange={e=>onHwChange({printerType:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border bg-white">
              <option value="browser">Browser Print (recommended — any printer)</option>
              <option value="serial">Serial ESC/POS (Web Serial)</option>
              <option value="usb">USB ESC/POS (WebUSB)</option>
            </select>
          </label>
          <label>{t('set.printerWidth')}
            <select value={hw.printerWidth} onChange={e=>onHwChange({printerWidth:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border bg-white">
              <option value="80">80mm (standard)</option>
              <option value="58">58mm (compact)</option>
            </select>
          </label>
        </div>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 p-3 rounded-xl border hover:bg-slate-50 cursor-pointer"><input type="checkbox" checked={!!hw.autoPrint} onChange={e=>onHwChange({autoPrint:e.target.checked})}/> {t('set.autoPrint')}</label>
          <label className="flex items-center gap-2 p-3 rounded-xl border hover:bg-slate-50 cursor-pointer"><input type="checkbox" checked={!!hw.cashDrawer} onChange={e=>onHwChange({cashDrawer:e.target.checked})}/> {t('set.cashDrawer')}</label>
          <label className="flex items-center gap-2 p-3 rounded-xl border hover:bg-slate-50 cursor-pointer"><input type="checkbox" checked={!!hw.scannerEnabled} onChange={e=>onHwChange({scannerEnabled:e.target.checked})}/> {t('set.scanner')} <span className="ml-auto text-xs text-slate-500 flex items-center gap-1"><ScanLine size={14}/> USB HID • keyboard wedge</span></label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>testPrint(hw.printerWidth)} className="px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2"><Printer size={16}/>{t('set.testPrint')}</button>
          <button onClick={()=>openCashDrawer()} className="px-4 py-2 rounded-xl border text-sm font-medium">💵 {t('set.openDrawer')}</button>
          <button onClick={pairSerialPrinter} className="px-4 py-2 rounded-xl border text-sm font-medium">Pair Serial Printer</button>
          <button onClick={pairUsbPrinter} className="px-4 py-2 rounded-xl border text-sm font-medium">Pair USB Printer</button>
        </div>
        <div className="text-xs bg-slate-50 border rounded-xl p-3 leading-relaxed">
          <b>{t('set.hardwareReady')}</b><br/>
          • <b>Barcode scanner:</b> any USB scanner in HID mode works instantly — just scan on POS search box (Enter suffix). No driver needed.<br/>
          • <b>Thermal printer:</b> Browser print works with all printers. For auto cut & drawer kick, pair Serial/USB and use ESC/POS.<br/>
          • <b>Cash drawer:</b> connected to printer RJ11 — kicks on cash sales if enabled.<br/>
          • <b>Scale:</b> coming — reads weight via Serial (9600 baud).
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">{t('set.storeInfo')}</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <label>{t('set.storeName')} (EN) <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>Name (BN) <input value={form.name_bn||''} onChange={e=>setForm({...form,name_bn:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>{t('set.owner')} (EN) <input value={form.proprietor} onChange={e=>setForm({...form,proprietor:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>Owner (BN) <input value={form.proprietor_bn||''} onChange={e=>setForm({...form,proprietor_bn:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>{t('set.phone')} <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>{t('set.logo')} <input value={form.logo} onChange={e=>setForm({...form,logo:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border" placeholder="https://..."/></label>
          <label>Address (EN) <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>Address (BN) <input value={form.address_bn||''} onChange={e=>setForm({...form,address_bn:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">{t('set.posSettings')}</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <label>{t('set.currency')} <input value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>{t('set.tax')} <input type="number" value={form.taxRate} onChange={e=>setForm({...form,taxRate:Number(e.target.value)})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
          <label>{t('set.lowThresh')} <input type="number" value={form.lowStockThreshold} onChange={e=>setForm({...form,lowStockThreshold:Number(e.target.value)})} className="mt-1 w-full h-10 px-3 rounded-xl border"/></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.allowNegativeStock} onChange={e=>setForm({...form,allowNegativeStock:e.target.checked})}/> {t('set.allowNeg')}</label>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <h2 className="font-semibold">{t('set.paymentMethods')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {Object.entries({cash:'Cash / ক্যাশ', bkash:'bKash', nagad:'Nagad', other:'Other / অন্যান্য'}).map(([k,l])=>(
            <label key={k} className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${form.paymentMethods[k]?'bg-teal-50 border-teal-200':'bg-white'}`}>
              <input type="checkbox" checked={!!form.paymentMethods[k]} onChange={e=>setForm({...form, paymentMethods:{...form.paymentMethods, [k]:e.target.checked}})} />{l}
            </label>
          ))}
        </div>
        <div className="text-xs text-slate-500">{t('set.paymentNote')}</div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <h2 className="font-semibold">{t('set.data')}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={save} className="px-6 py-2.5 bg-teal-700 text-white rounded-xl font-semibold">{t('set.save')}</button>
          <button onClick={doExport} className="px-4 py-2.5 border rounded-xl text-sm font-medium">{t('set.backupDown')}</button>
          <label className="px-4 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">{t('set.backupUp')} <input type="file" accept=".json" onChange={doImport} className="hidden"/></label>
          <button onClick={()=>{ if(confirm(t('set.resetConfirm'))) resetAll()}} className="px-4 py-2.5 border rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">{t('set.reset')}</button>
        </div>
        <div className="text-xs text-slate-500">{t('set.dataNote')}</div>
      </div>

      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 text-xs leading-relaxed">
        <div className="font-semibold text-white">{t('set.account')}</div>
        <div className="mt-1 opacity-80">{t('set.accountNote')}</div>
      </div>
    </div>
  )
}
