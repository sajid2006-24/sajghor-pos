import { useEffect, useRef, useState } from 'react'
import { Camera, X, Zap } from 'lucide-react'
import { useI18n } from '../lib/i18n'

// Lightweight mobile camera scanner using native BarcodeDetector if available, fallback to prompt
export default function MobileScanner({ onScan, onClose }){
  const videoRef=useRef(null)
  const [err,setErr]=useState('')
  const [torch,setTorch]=useState(false)
  const { lang } = useI18n()
  const streamRef=useRef(null)

  useEffect(()=>{
    let detector=null
    let raf=null
    let running=true
    async function start(){
      try{
        const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment', width:{ideal:1280}, height:{ideal:720}}})
        streamRef.current=stream
        if(videoRef.current){ videoRef.current.srcObject=stream; await videoRef.current.play() }
        if('BarcodeDetector' in window){
          detector = new window.BarcodeDetector({formats:['ean_13','ean_8','code_128','code_39','upc_a','upc_e','qr_code']})
          const scanLoop=async()=>{
            if(!running) return
            try{
              const barcodes = await detector.detect(videoRef.current)
              if(barcodes.length){
                onScan(barcodes[0].rawValue)
                running=false
                return
              }
            }catch{}
            raf=requestAnimationFrame(scanLoop)
          }
          raf=requestAnimationFrame(scanLoop)
        } else {
          setErr(lang==='bn'?'এই ব্রাউজারে সরাসরি ক্যামেরা স্ক্যান সাপোর্ট নেই। বারকোড টাইপ করুন বা USB স্ক্যানার ব্যবহার করুন।':'Live scan not supported in this browser. Type barcode or use USB scanner.')
        }
      }catch(e){
        setErr(e.message)
      }
    }
    start()
    return ()=>{
      running=false
      if(raf) cancelAnimationFrame(raf)
      if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
    }
  },[])

  const toggleTorch=async()=>{
    try{
      const track=streamRef.current?.getVideoTracks()[0]
      if(track && 'applyConstraints' in track){
        await track.applyConstraints({advanced:[{torch:!torch}]})
        setTorch(!torch)
      }
    }catch{}
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-3 text-white">
        <div className="flex items-center gap-2 font-bold"><Camera size={18}/>{lang==='bn'?'মোবাইল স্ক্যানার':'Mobile Scanner'}</div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/15"><X size={18}/></button>
      </div>
      <div className="relative flex-1 bg-black grid place-items-center overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[85%] max-w-[360px] aspect-[1.6/1] border-2 border-white rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"/>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"/>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"/>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl"/>
            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500/80 animate-pulse"/>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <button onClick={toggleTorch} className="px-4 py-2 rounded-full bg-white/15 backdrop-blur text-white text-sm font-medium flex items-center gap-2 border border-white/20"><Zap size={16}/>{torch?'Torch off':'Torch'}</button>
        </div>
      </div>
      <div className="p-3 bg-white text-center">
        {err ? <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">{err}</div> : <div className="text-sm text-slate-600">{lang==='bn'?'বারকোডটি ফ্রেমের ভিতরে রাখুন — স্বয়ংক্রিয়ভাবে স্ক্যান হবে':'Place barcode inside frame — auto scans'}</div>}
        <div className="text-xs text-slate-400 mt-1">{lang==='bn'?'ক্যামেরা অনুমতি দিন। USB স্ক্যানারও যেকোনো সময় কাজ করবে।':'Allow camera permission. USB scanner also works anytime.'}</div>
      </div>
    </div>
  )
}
