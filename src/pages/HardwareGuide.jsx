import { useI18n } from '../lib/i18n'
import { Printer, ScanLine, Cpu, Smartphone, Cable, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HardwareGuide(){
  const { lang } = useI18n()
  const en = lang!=='bn'
  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Cpu className="text-teal-700"/>{en?'Hardware Connection Guide':'হার্ডওয়্যার কানেকশন গাইড'}</h1>
        <p className="text-sm text-slate-600 mt-1">{en?'Connect barcode scanner, thermal printer, cash drawer and mobile scanner in minutes. No drivers needed for basic setup.':'বারকোড স্ক্যানার, থার্মাল প্রিন্টার, ক্যাশ ড্রয়ার ও মোবাইল স্ক্যানার কয়েক মিনিটে কানেক্ট করুন। বেসিক সেটআপে কোনো ড্রাইভার লাগে না।'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <ScanLine className="mx-auto text-emerald-600" size={28}/>
          <div className="font-bold mt-2 text-sm">{en?'Scanner':'স্ক্যানার'}</div>
          <div className="text-xs text-slate-600">USB HID • Plug & Play</div>
          <div className="text-[11px] mt-1 bg-white rounded-full px-2 py-1 border inline-block">✓ {en?'Ready':'রেডি'}</div>
        </div>
        <div className="bg-slate-50 border rounded-2xl p-4 text-center">
          <Printer className="mx-auto text-slate-700" size={28}/>
          <div className="font-bold mt-2 text-sm">{en?'Printer':'প্রিন্টার'}</div>
          <div className="text-xs text-slate-600">80/58mm • Browser / ESC/POS</div>
          <div className="text-[11px] mt-1 bg-white rounded-full px-2 py-1 border inline-block">✓ {en?'Ready':'রেডি'}</div>
        </div>
        <div className="bg-white border rounded-2xl p-4 text-center">
          <Smartphone className="mx-auto text-teal-700" size={28}/>
          <div className="font-bold mt-2 text-sm">{en?'Mobile Scan':'মোবাইল স্ক্যান'}</div>
          <div className="text-xs text-slate-600">{en?'Camera • Chrome/Edge':'ক্যামেরা • Chrome/Edge'}</div>
          <div className="text-[11px] mt-1 bg-slate-900 text-white rounded-full px-2 py-1 inline-block">✓ {en?'Ready':'রেডি'}</div>
        </div>
      </div>

      {/* Scanner */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold flex items-center gap-2"><ScanLine size={18} className="text-emerald-600"/>1. {en?'Barcode Scanner (USB)':'বারকোড স্ক্যানার (USB)'}</h2>
        <div className="mt-3 grid md:grid-cols-[1fr_220px] gap-4">
          <ol className="list-decimal ml-5 space-y-2 text-sm leading-relaxed">
            <li>{en?'Plug scanner into PC/laptop USB port. It appears as keyboard (HID) — no driver.':'স্ক্যানারটি PC/ল্যাপটপের USB পোর্টে লাগান। এটি কীবোর্ড (HID) হিসেবে কাজ করবে — কোনো ড্রাইভার লাগবে না।'}</li>
            <li>{en?'Open POS Terminal (/pos). Focus is on search box.':'POS টার্মিনাল (/pos) খুলুন। সার্চ বক্সে ফোকাস থাকবে।'}</li>
            <li>{en?'Scan any product barcode — it auto-adds to cart (Enter suffix required, default on most scanners).':'যেকোনো পণ্যের বারকোড স্ক্যান করুন — স্বয়ংক্রিয়ভাবে কার্টে যোগ হবে (Enter suffix লাগে, অধিকাংশ স্ক্যানারে ডিফল্ট)।'}</li>
            <li>{en?'If not adding, scan a barcode, check Settings → Hardware → Scanner enabled is ON.':'যোগ না হলে একটি বারকোড স্ক্যান করে দেখুন, Settings → Hardware → Scanner enabled ON আছে কিনা।'}</li>
          </ol>
          <div className="bg-slate-50 border rounded-xl p-3 text-xs">
            <div className="font-bold flex items-center gap-1"><Cable size={12}/>{en?'Recommended':'প্রস্তাবিত'}</div>
            <div className="mt-1">Netum, Inateck, Tera 1D/2D scanners. Set to USB-HID mode (hold scan mode button 5s). Enable CR suffix (scan manual's "Add Enter").</div>
          </div>
        </div>
      </div>

      {/* Printer */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold flex items-center gap-2"><Printer size={18}/>2. {en?'Thermal Receipt Printer (80mm / 58mm)':'থার্মাল রসিদ প্রিন্টার (80mm / 58mm)'}</h2>
        <div className="mt-3 space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <div className="font-bold text-teal-700">A. {en?'Browser Print (Easiest)':'ব্রাউজার প্রিন্ট (সবচেয়ে সহজ)'}</div>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>{en?'Connect printer via USB. Install driver from printer CD / website (e.g., Xprinter, Epson TM, Bixolon).':'প্রিন্টার USB দিয়ে কানেক্ট করুন। CD/ওয়েবসাইট থেকে ড্রাইভার ইনস্টল করুন (যেমন Xprinter, Epson TM)।'}</li>
                <li>{en?'In Windows: Devices & Printers → set as Default.':'Windows: Devices & Printers → Default হিসেবে সেট করুন।'}</li>
                <li>{en?'POS → Sell → invoice auto prints (or click Print). Set paper width 80/58 in Settings → Hardware.':'POS → বিক্রয় → ইনভয়েস স্বয়ংক্রিয়ভাবে প্রিন্ট হবে (বা Print ক্লিক)। Settings → Hardware এ 80/58 সেট করুন।'}</li>
              </ol>
            </div>
            <div className="border rounded-xl p-4">
              <div className="font-bold">B. ESC/POS (Auto-cut & Drawer kick)</div>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>{en?'Chrome/Edge on desktop. Settings → Hardware → Printer Type = Serial or USB → Pair Serial/USB → allow permission.':'Chrome/Edge ডেস্কটপ। Settings → Hardware → Printer Type = Serial/USB → Pair → অনুমতি দিন।'}</li>
                <li>{en?'Connect printer via USB-Serial adapter or direct USB. For serial, use 9600 baud.':'প্রিন্টার USB-Serial অ্যাডাপ্টার বা সরাসরি USB দিয়ে কানেক্ট করুন। Serial হলে 9600 baud।'}</li>
                <li>{en?'Test Print → should cut automatically. Drawer kicks on cash sales.':'Test Print → স্বয়ংক্রিয়ভাবে কাটবে। ক্যাশ বিক্রয়ে ড্রয়ার খুলবে।'}</li>
              </ol>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-xl p-3"><AlertTriangle size={14} className="text-amber-600"/>{en?'If print is blank, check paper roll direction (thermal side faces print head).':'প্রিন্ট ফাঁকা এলে কাগজের দিক দেখুন (থার্মাল দিক প্রিন্ট হেডের দিকে)।'}</div>
        </div>
      </div>

      {/* Cash Drawer */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold">3. {en?'Cash Drawer':'ক্যাশ ড্রয়ার'}</h2>
        <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
          <li>{en?'Connect drawer RJ11 cable to printer\'s "Drawer Kick" port (not phone line).':'ড্রয়ার RJ11 কেবল প্রিন্টারের "Drawer Kick" পোর্টে লাগান (ফোন লাইনে নয়)।'}</li>
          <li>{en?'Settings → Hardware → Cash drawer kick = ON.':'Settings → Hardware → Cash drawer kick = ON করুন।'}</li>
          <li>{en?'Sell with Cash payment → drawer opens automatically. Test with "Open Cash Drawer" button.':'ক্যাশ পেমেন্টে বিক্রয় করুন → স্বয়ংক্রিয়ভাবে খুলবে। "Open Cash Drawer" বাটনে টেস্ট করুন।'}</li>
        </ol>
      </div>

      {/* Mobile Scan */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold flex items-center gap-2"><Smartphone size={18}/>4. {en?'Mobile Camera Scan':'মোবাইল ক্যামেরা স্ক্যান'}</h2>
        <ol className="list-decimal ml-5 mt-2 space-y-2 text-sm">
          <li>{en?'On POS page, tap the camera icon (📷) beside search box — or open POS on your phone.':'POS পেজে সার্চ বক্সের পাশে ক্যামেরা আইকন (📷) চাপুন — বা ফোনে POS খুলুন।'}</li>
          <li>{en?'Allow camera permission (Chrome/Edge/Safari). Point barcode inside frame — red line. Auto adds to cart.':'ক্যামেরা অনুমতি দিন। বারকোড ফ্রেমের ভিতরে রাখুন — লাল লাইন। স্বয়ংক্রিয়ভাবে কার্টে যোগ হবে।'}</li>
          <li>{en?'Tip: Enable torch in low light. For iPhone, use Safari and HTTPS (Vercel link already is HTTPS).':'কম আলোতে টর্চ চালু করুন। iPhone হলে Safari ও HTTPS ব্যবহার করুন (Vercel লিংক already HTTPS)।'}</li>
        </ol>
        <div className="mt-3 bg-slate-900 text-white rounded-xl p-3 text-xs flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400"/>{en?'No app needed. Works on Android & iPhone. USB scanner + mobile scan can be used together.':'কোনো অ্যাপ লাগবে না। Android ও iPhone এ কাজ করে। USB স্ক্যানার + মোবাইল একসাথে ব্যবহার করা যায়।'}
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm">
        <div className="font-bold flex items-center gap-2"><FileText size={16} className="text-teal-700"/>{en?'Quick Checklist':'দ্রুত চেকলিস্ট'}</div>
        <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-xl p-2 border">✓ {en?'Scanner beeps on scan':'স্ক্যানে বিপ শব্দ'}</div>
          <div className="bg-white rounded-xl p-2 border">✓ {en?'Printer prints test page':'প্রিন্টারে টেস্ট পেজ'}</div>
          <div className="bg-white rounded-xl p-2 border">✓ {en?'Drawer opens on cash':'ক্যাশে ড্রয়ার খোলে'}</div>
          <div className="bg-white rounded-xl p-2 border">✓ {en?'Mobile camera scans':'মোবাইলে স্ক্যান হয়'}</div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/admin/settings" className="inline-flex px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold">→ {en?'Go to Hardware Settings':'হার্ডওয়্যার সেটিংসে যান'}</Link>
      </div>
    </div>
  )
}
