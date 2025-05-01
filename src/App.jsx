import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/navbar/NavBar'
import { Toaster } from "sonner";
import Login from './pages/LoginPage/Login'
import Teresa from './pages/teresa/Teresa';
import SupplyChainTower from './pages/supplychaintower/SupplyChainTower';
import MarketMixModelling from './pages/neptune/MarketMixModelling';
import Overall from './pages/Overall/Overall';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        {/* <Route path='/' element={<Login />} /> */}
        <Route path='/teresa' element={<Teresa />} />
        <Route path='/neptune' element={<MarketMixModelling />} />
        <Route path="/supplychaintower" element={<SupplyChainTower />} />
        <Route path="/" element={<SupplyChainTower />} />
        <Route path="/dashboard" element={<Overall />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
