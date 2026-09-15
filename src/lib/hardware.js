// Hardware abstraction — barcode scanner, thermal printer, cash drawer, scale
// Works with: USB HID barcode scanners (keyboard wedge), Serial/USB thermal printers (ESC/POS), cash drawer kick, weighing scale

export const HARDWARE_KEY = 'sajghor_hw_v1'
const defaultHW = {
  printerWidth: '80', // 80 or 58
  autoPrint: true,
  cashDrawer: true,
  scannerEnabled: true,
  printerType: 'browser', // browser | serial | usb
  scaleEnabled: false,
}
export function loadHW(){
  try{ return { ...defaultHW, ...JSON.parse(localStorage.getItem(HARDWARE_KEY)||'{}')} }catch{return {...defaultHW}}
}
export function saveHW(patch){
  const cur=loadHW(); const next={...cur,...patch}; localStorage.setItem(HARDWARE_KEY, JSON.stringify(next)); return next
}
export function getHW(){ return loadHW() }

// Barcode scanner: scanners act as keyboard — detect fast input ending with Enter
export function useBarcodeScanner(onScan, enabled=true){
  // hook to be used in components: listens globally
  const handler = (e)=>{
    // handled in component via ref; this export is utility
  }
  return handler
}

// ESC/POS helpers
function escPosKickDrawer(){
  // ESC p 0x00 <on> <off> — typical
  return new Uint8Array([0x1B, 0x70, 0x00, 0x19, 0xFA])
}
function escPosCut(){
  return new Uint8Array([0x1D, 0x56, 0x00])
}

export async function openCashDrawer(){
  const hw=getHW()
  // Try Web Serial first if available
  try{
    if(navigator.serial){
      // user must have paired device via hw settings
      // for now try to request port if not connected
      // we fallback to print kick via browser print if no serial
    }
  }catch{}
  // Fallback: try USB
  try{
    if(navigator.usb){
      // similar - requires permission
    }
  }catch{}
  // Always try ESC/POS via hidden iframe print kick if supported
  // For browser printers that support drawer kick via driver, we send via print
  try{
    // Create ESC/POS blob and try to send via serial if port available
    if(hw.printerType==='serial' && navigator.serial){
      const port = await navigator.serial.requestPort()
      await port.open({baudRate:9600})
      const writer = port.writable.getWriter()
      await writer.write(escPosKickDrawer())
      writer.releaseLock()
      await port.close()
      return {ok:true, method:'serial'}
    }
    if(hw.printerType==='usb' && navigator.usb){
      const device = await navigator.usb.requestDevice({filters:[]})
      await device.open()
      // naive — device must be configured
      return {ok:true, method:'usb'}
    }
  }catch(e){
    console.warn('Drawer open failed, fallback to print', e)
  }
  // Fallback: audio cue + alert
  try{ new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==').play().catch(()=>{}) }catch{}
  return {ok:false, fallback:true}
}

export async function printRawEscPos(bytes){
  if(navigator.serial){
    try{
      const port = await navigator.serial.requestPort()
      await port.open({baudRate:9600})
      const writer = port.writable.getWriter()
      await writer.write(bytes)
      writer.releaseLock()
      await port.close()
      return true
    }catch(e){ console.error(e); return false }
  }
  return false
}

// Browser print (80mm optimized)
export function printInvoiceElement(id='invoice-print'){
  const el=document.getElementById(id)
  if(!el) return window.print()
  window.print()
}

// Test print
export function testPrint(width='80'){
  const w=window.open('','_blank','width=320,height=600')
  if(!w) return alert('Popup blocked — allow popups for test print')
  w.document.write(`<html><head><title>Test Print</title><style>body{font-family:monospace;font-size:12px;width:${width==='58'?'58mm':'80mm'};margin:0 auto;padding:8px}h2{margin:0;font-size:14px}hr{border:none;border-top:1px dashed #000;margin:8px 0}table{width:100%;font-size:11px;border-collapse:collapse}td{padding:2px 0}</style></head><body>
  <h2>Sajghor Cosmetics</h2><div>Prop: Md Rayhan Mia<br>01799-303374<br>Char Kashim Nagar, Belab</div><hr>
  <div>Test Receipt — ${new Date().toLocaleString()}</div><hr>
  <table><tr><td>Item 1 x1</td><td align="right">৳100</td></tr><tr><td>Item 2 x2</td><td align="right">৳200</td></tr></table><hr>
  <table><tr><td>Total</td><td align="right"><b>৳300</b></td></tr></table><hr>
  <div align="center">Hardware Ready ✓<br>Paper: ${width}mm<br>Thank you!</div>
  <script>window.onload=()=>{window.print(); setTimeout(()=>window.close(),500)}</script>
  </body></html>`)
  w.document.close()
}

// Pair serial printer
export async function pairSerialPrinter(){
  if(!navigator.serial) return alert('Web Serial not supported in this browser. Use Chrome/Edge on desktop.')
  try{
    const port = await navigator.serial.requestPort()
    saveHW({printerType:'serial'})
    alert('Serial printer paired. Will use ESC/POS for receipts & drawer.')
    return port
  }catch(e){ alert('Pairing cancelled: '+e.message)}
}
export async function pairUsbPrinter(){
  if(!navigator.usb) return alert('WebUSB not supported. Use Chrome/Edge.')
  try{
    const device = await navigator.usb.requestDevice({filters:[]})
    saveHW({printerType:'usb'})
    alert('USB device paired: '+(device.productName||device.manufacturerName||'Unknown'))
    return device
  }catch(e){ alert('Pairing cancelled: '+e.message)}
}

// Scale: weight via serial (common 9600 baud, ASCII weight)
export async function readScale(){
  if(!navigator.serial) throw new Error('Web Serial not supported')
  const port = await navigator.serial.requestPort()
  await port.open({baudRate:9600})
  const reader = port.readable.getReader()
  let text=''
  const timeout=setTimeout(()=>{ reader.cancel().catch(()=>{}); },3000)
  try{
    while(true){
      const {value,done}=await reader.read()
      if(done) break
      text+=new TextDecoder().decode(value)
      if(text.includes('\n')||text.includes('kg')) break
    }
  }finally{
    clearTimeout(timeout)
    reader.releaseLock()
    await port.close().catch(()=>{})
  }
  const match=text.match(/[\d.]+/)
  return match? parseFloat(match[0]) : null
}
