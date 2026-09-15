# Sajghor POS — Hardware Connection Guide

POS is **Hardware Ready**. Connect in minutes. No app needed.

## URLs
- **POS Terminal (Cashier):** https://sajghor-pos.vercel.app/pos
- **Admin Dashboard:** https://sajghor-pos.vercel.app/admin  (or /admin/hardware for guide)
- Local dev: http://localhost:5173/pos  &  http://localhost:5173/admin

## 1. Barcode Scanner (USB HID — Recommended)
**Any 1D/2D USB scanner works (Netum, Inateck, Tera). Keyboard wedge = no driver.**

1. Plug scanner into PC/laptop USB. It types as keyboard.
2. If not beeping on scan → hold scanner's mode button 5s → scan manual's **USB-HID** barcode.
3. Scan manual's **Add CR / Add Enter** (suffix) — so POS auto-adds to cart.
4. Open **POS Terminal** → tap search box → scan product barcode. Product adds to cart instantly. Works even without focus (global listener).

> Test: open Notepad, scan — you should see barcode + new line.

## 2. Thermal Receipt Printer (80mm / 58mm)

### A. Browser Print (easiest, works with ANY printer)
1. Connect printer USB → install driver from CD / Xprinter.net / Epson site.
2. Windows: *Settings → Bluetooth & devices → Printers* → **Set as default**.
3. Chrome/Edge → POS → make a sale → click **Print** (or auto-print if enabled in Admin → Settings → Hardware).
4. In print dialog, select your thermal printer, Paper size 80mm, Margins Minimum.

### B. ESC/POS Serial/USB (auto-cut + cash drawer kick)
- Requires **Chrome/Edge on desktop** + **HTTPS** (Vercel is HTTPS).
- Admin → Settings → Hardware → **Printer Type = Serial or USB** → **Pair Serial/USB** → allow permission.
- Serial: USB-Serial adapter at 9600 baud. USB: direct.
- **Test Print** → should print and cut. Drawer kicks on **Cash** sales.

## 3. Cash Drawer
1. Plug drawer **RJ11** cable into printer's **Drawer Kick** port (marked 🔌, NOT phone jack).
2. Admin → Settings → Hardware → **Cash drawer kick = ON**.
3. Sell with **Cash** payment → drawer pops. Test via **Open Cash Drawer** button.

## 4. Mobile Camera Scan (Phone/Tablet)
**No app. Works on Android & iPhone.**

1. Open POS Terminal on phone: https://sajghor-pos.vercel.app/pos (add to Home Screen).
2. Tap **📷 Scan** (camera icon) beside search box.
3. Allow **Camera permission** (must be HTTPS — Vercel is).
4. Hold barcode inside white frame (red line) → auto adds to cart.
5. Torch toggle for low light. Works alongside USB scanner simultaneously.

> iPhone: use Safari. Android: Chrome. If "Live scan not supported" → use USB scanner or type barcode.

## Quick Checklist
- [ ] Scanner beeps and types in Notepad
- [ ] POS search → scan → cart increments
- [ ] Test Print → receipt prints (80 or 58mm)
- [ ] Cash sale → drawer opens
- [ ] Phone → Scan button → camera scans

## Troubleshooting
- **Scanner not adding?** Check `Enter` suffix and *Scanner enabled* ON.
- **Blank print?** Flip paper roll (thermal coating toward head).
- **Drawer not opening?** Must be via printer RJ11, printer must be ON.
- **Camera blocked?** Allow permission → reload. Ensure HTTPS.
- **Web Serial/USB not showing?** Use Chrome/Edge desktop, not Firefox.

## Admin vs POS Separation
- **POS Terminal** (`/pos`): Full-screen cashier mode. No sidebar. Large touch targets. Hardware bar. Scanner + mobile scan. Auto-print.
- **Admin Dashboard** (`/admin`): Analytics, inventory, reports, settings, hardware guide. Access via **Open POS Terminal** button.

Keep backup: Admin → Settings → **Download Backup (JSON)** daily.
