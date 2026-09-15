import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import POSLayout from './components/POSLayout'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import Stock from './pages/Stock'
import Purchases from './pages/Purchases'
import Services from './pages/Services'
import SalesHistory from './pages/SalesHistory'
import Reports from './pages/Reports'
import Expenses from './pages/Expenses'
import Settings from './pages/Settings'
import Login from './pages/Login'
import HardwareGuide from './pages/HardwareGuide'
import { getAuth } from './lib/db'

function RequireAuth({children}){
  const auth=getAuth()
  if(!auth) return <Navigate to="/login" replace/>
  return children
}
function AdminRoute({children}){ return <RequireAuth><AdminLayout>{children}</AdminLayout></RequireAuth> }
function POSRoute({children}){ return <RequireAuth><POSLayout>{children}</POSLayout></RequireAuth> }

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        {/* POS Terminal - separate, distraction-free */}
        <Route path="/pos" element={<POSRoute><POS/></POSRoute>} />
        {/* Admin Dashboard - separate */}
        <Route path="/admin" element={<AdminRoute><Dashboard/></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><Products/></AdminRoute>} />
        <Route path="/admin/stock" element={<AdminRoute><Stock/></AdminRoute>} />
        <Route path="/admin/purchases" element={<AdminRoute><Purchases/></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><Services/></AdminRoute>} />
        <Route path="/admin/sales" element={<AdminRoute><SalesHistory/></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><Reports/></AdminRoute>} />
        <Route path="/admin/expenses" element={<AdminRoute><Expenses/></AdminRoute>} />
        <Route path="/admin/hardware" element={<AdminRoute><HardwareGuide/></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><Settings/></AdminRoute>} />

        {/* Legacy redirects */}
        <Route path="/products" element={<Navigate to="/admin/products" replace/>} />
        <Route path="/stock" element={<Navigate to="/admin/stock" replace/>} />
        <Route path="/purchases" element={<Navigate to="/admin/purchases" replace/>} />
        <Route path="/services" element={<Navigate to="/admin/services" replace/>} />
        <Route path="/sales" element={<Navigate to="/admin/sales" replace/>} />
        <Route path="/reports" element={<Navigate to="/admin/reports" replace/>} />
        <Route path="/expenses" element={<Navigate to="/admin/expenses" replace/>} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace/>} />
        <Route path="/" element={<Navigate to="/admin" replace/>} />
        <Route path="*" element={<Navigate to="/admin" replace/>} />
      </Routes>
    </BrowserRouter>
  )
}
