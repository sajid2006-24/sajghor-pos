import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
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
import { getAuth } from './lib/db'

function RequireAuth({children}){
  const auth=getAuth()
  if(!auth) return <Navigate to="/login" replace/>
  return children
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<RequireAuth><Layout><Dashboard/></Layout></RequireAuth>} />
        <Route path="/pos" element={<RequireAuth><Layout><POS/></Layout></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><Layout><Products/></Layout></RequireAuth>} />
        <Route path="/stock" element={<RequireAuth><Layout><Stock/></Layout></RequireAuth>} />
        <Route path="/purchases" element={<RequireAuth><Layout><Purchases/></Layout></RequireAuth>} />
        <Route path="/services" element={<RequireAuth><Layout><Services/></Layout></RequireAuth>} />
        <Route path="/sales" element={<RequireAuth><Layout><SalesHistory/></Layout></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth><Layout><Reports/></Layout></RequireAuth>} />
        <Route path="/expenses" element={<RequireAuth><Layout><Expenses/></Layout></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Layout><Settings/></Layout></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  )
}
