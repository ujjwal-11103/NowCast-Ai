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
import { AuthProvider } from './context/auth/AuthContext';

import ProtectedRoute from './context/auth/ProtectedRoute';
import MainPage from './pages/Main/MainPage';
import Ingestion from './pages/Ingestion/Ingestion';
import Reporting from './pages/Reporting/Reporting';
import ErrorAnalysis from './pages/Error Analysis/ErrorAnalysis';
import Norms from './pages/Norms/Norms';
import AuthPage from './pages/auth/AuthPage';
import ForecastTestPage from './testing/ForecastTestPage';
import PricingPage from './testing/PricingPage';

const App = () => {
  return (
    <BrowserRouter>
      <ForecastProvider>
        <SidebarProvider>
          <AuthProvider>

            <Toaster richColors position="top-right" />
            <Routes>

              {/* <Route path='/' element={<Login />} /> */}
              {/* <Route path='/teresa' element={<Teresa />} /> */}
              {/* <Route path='/neptune' element={<MarketMixModelling />} /> */}
              {/* <Route path="/supplychaintower" element={<SupplyChainTower />} /> */}

              <Route path="/" element={<AuthPage />} />
              {/* <Route path="/forecast" element={<ForecastTestPage />} />
              <Route path="/pricing" element={<PricingPage />} /> */}

              {/* Protected Routes */}
              {/* <Route path="/forecast" element={
                <ProtectedRoute>
                  <ForecastTestPage />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={
                <ProtectedRoute>
                  <PricingPage />
                </ProtectedRoute>
              } /> */}

              <Route path="/overall" element={
                <ProtectedRoute>
                  <Overall />
                </ProtectedRoute>
              } />

              <Route path="/ingestion" element={
                <ProtectedRoute>
                  <Ingestion />
                </ProtectedRoute>
              } />

              <Route path="/planning" element={
                <ProtectedRoute>
                  <Planning />
                </ProtectedRoute>
              } />

              {/* Add all other protected routes similarly */}
              <Route path="/reporting" element={
                <ProtectedRoute>
                  <Reporting />
                </ProtectedRoute>
              } />

              <Route path="/errorAnalysis" element={
                <ProtectedRoute>
                  <ErrorAnalysis />
                </ProtectedRoute>
              } />

              <Route path="/norms" element={
                <ProtectedRoute>
                  <Norms />
                </ProtectedRoute>
              } />

              <Route path="/supplyChain" element={
                <ProtectedRoute>
                  <SupplyChainTower />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </SidebarProvider>
      </ForecastProvider>
    </BrowserRouter>
  )
}

export default App
