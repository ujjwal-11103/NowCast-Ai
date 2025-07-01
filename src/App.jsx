import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/navbar/NavBar'
import { Toaster } from "sonner";
import Login from './pages/LoginPage/Login'
import Teresa from './pages/teresa/Teresa';
import SupplyChainTower from './pages/supplychaintower/SupplyChainTower';
import MarketMixModelling from './pages/neptune/MarketMixModelling';
import Overall from './pages/Overall/Overall';
import Planning from './pages/Planning/Planning';

import { SidebarProvider } from './context/sidebar/SidebarContext';
import { ForecastProvider } from './context/ForecastContext/ForecastContext';

import MainPage from './pages/Main/MainPage';
import Ingestion from './pages/Ingestion/Ingestion';
import Reporting from './pages/Reporting/Reporting';
import ErrorAnalysis from './pages/Error Analysis/ErrorAnalysis';
import Norms from './pages/Norms/Norms';
import AuthPage from './pages/auth/AuthPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <ForecastProvider>
        <SidebarProvider>
          <Routes>
            {/* <Route path='/' element={<Login />} /> */}
            {/* <Route path='/teresa' element={<Teresa />} /> */}
            {/* <Route path='/neptune' element={<MarketMixModelling />} /> */}
            {/* <Route path="/supplychaintower" element={<SupplyChainTower />} /> */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/overall" element={<Overall />} />
            <Route path="/ingestion" element={<Ingestion />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/errorAnalysis" element={<ErrorAnalysis />} />
            <Route path="/norms" element={<Norms />} />
            <Route path="/supplyChain" element={<SupplyChainTower />} />
          </Routes>
        </SidebarProvider>
      </ForecastProvider>
    </BrowserRouter>
  )
}

export default App
