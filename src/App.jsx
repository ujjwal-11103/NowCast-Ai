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
import { Provider } from 'react-redux';
import store from './redux/store';

import ProtectedRoute from './context/auth/ProtectedRoute';
import MainPage from './pages/Main/MainPage';
import Ingestion from './pages/Ingestion/Ingestion';
import Reporting from './pages/Reporting/Reporting';
import ErrorAnalysis from './pages/Error Analysis/ErrorAnalysis';
import Norms from './pages/Norms/Norms';
import AuthPage from './pages/auth/AuthPage';
import ForecastTestPage from './testing/ForecastTestPage';
import PricingPage from './testing/PricingPage';
import MEIO from './pages/MEIO/MEIO';
import Chemical from './pages/Chemical/ChemicalApp';
import CVR from './pages/CVR/CVRApp';
import SalesPerformance from './pages/Sales/SalesPerformance';
import PricingAnalytics from './pages/PricingAnalyst/PricingAnalytics';
import MarketMixModeling from './pages/PricingAnalyst/MarketMixModeling';
import CEODashboard from './pages/PricingAnalyst/CEODashboard';
import PlanningAnalyst from './pages/PricingAnalyst/PlanningAnalyst';
import CustomReporting from './pages/Reporting/CustomReporting';
import TradePromotion from './pages/TradePromotion/TradePromotion';
import TPOptimization from './pages/TPOptimization/TPOptimization';
import ManufacturingDemoPage from './pages/Manufacturing/ManufacturingDemoPage';
import ERPNextPage from './pages/ERPNext/ERPNextPage';
import ERPDashboard from './pages/Manufacturing/ERPDashboard';
import StockOverview from './pages/Manufacturing/StockOverview';
import BillOfMaterials from './pages/Manufacturing/BillOfMaterials';
import WorkOrder from './pages/Manufacturing/WorkOrder';
import StockEntry from './pages/Manufacturing/StockEntry';
import ItemMaster from './pages/Manufacturing/ItemMaster';
import StockLedger from './pages/Manufacturing/StockLedger';
import ManufacturingHub from './pages/Manufacturing/ManufacturingHub';
import ProductionPlan from './pages/Manufacturing/ProductionPlan';


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ForecastProvider>
          <SidebarProvider>
            <AuthProvider>

              <Toaster richColors position="top-center" />
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

                {/* <Route path="/overall" element={
                  <ProtectedRoute>
                    <Overall />
                  </ProtectedRoute>
                } /> */}

                <Route path="/ingestion" element={
                  <ProtectedRoute>
                    <Ingestion />
                  </ProtectedRoute>
                } />

                {/* <Route path="/planning" element={
                  <ProtectedRoute>
                    <Planning />
                  </ProtectedRoute>
                } /> */}

                {/* Add all other protected routes similarly */}
                {/* <Route path="/reporting" element={
                  <ProtectedRoute>
                    <Reporting />
                  </ProtectedRoute>
                } /> */}

                {/* <Route path="/errorAnalysis" element={
                  <ProtectedRoute>
                    <ErrorAnalysis />
                  </ProtectedRoute>
                } /> */}

                {/* <Route path="/norms" element={
                  <ProtectedRoute>
                    <Norms />
                  </ProtectedRoute>
                } /> */}

                {/* <Route path="/meio" element={
                  <ProtectedRoute>
                    <MEIO />
                  </ProtectedRoute>
                } /> */}

                {/* <Route path="/chemical" element={
                  <ProtectedRoute>
                    <Chemical />
                  </ProtectedRoute>
                } />

                <Route path="/cvr" element={
                  <ProtectedRoute>
                    <CVR />
                  </ProtectedRoute>
                } />

                <Route path="/salesPerformance" element={
                  <ProtectedRoute>
                    <SalesPerformance />
                  </ProtectedRoute>
                } /> */}

                <Route path="/marketMixModeling" element={
                  <ProtectedRoute>
                    <MarketMixModelling />
                  </ProtectedRoute>
                } />

                {/* <Route path="/ceoDashboard" element={
                  <ProtectedRoute>
                    <CEODashboard />
                  </ProtectedRoute>
                } /> */}

                <Route path="/pricingAnalytics" element={
                  <ProtectedRoute>
                    <PricingAnalytics />
                  </ProtectedRoute>
                } />

                {/* <Route path="/supplyChain" element={
                  <ProtectedRoute>
                    <SupplyChainTower />
                  </ProtectedRoute>
                } /> */}

                <Route path="/custom-reporting" element={
                  <ProtectedRoute>
                    <CustomReporting />
                  </ProtectedRoute>
                } />

                <Route path="/tradePromotion" element={
                  <ProtectedRoute>
                    <TradePromotion />
                  </ProtectedRoute>
                } />

                <Route path="/planningAnalyst" element={
                  <ProtectedRoute>
                    <PlanningAnalyst />
                  </ProtectedRoute>
                } />

                <Route path="/tp-optimization-tool" element={
                  <ProtectedRoute>
                    <TPOptimization />
                  </ProtectedRoute>
                } />

                <Route path="/erpnext" element={
                  <ProtectedRoute>
                    <ERPNextPage />
                  </ProtectedRoute>
                } />

                {/* Manufacturing Demo Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><ERPDashboard /></ProtectedRoute>} />
                <Route path="/stock" element={<ProtectedRoute><StockOverview /></ProtectedRoute>} />
                <Route path="/stock/item-view" element={<ProtectedRoute><ItemMaster /></ProtectedRoute>} />
                <Route path="/manufacturing" element={<ProtectedRoute><ManufacturingHub /></ProtectedRoute>} />
                <Route path="/manufacturing/bom" element={<ProtectedRoute><BillOfMaterials /></ProtectedRoute>} />
                <Route path="/manufacturing/work-order" element={<ProtectedRoute><WorkOrder /></ProtectedRoute>} />
                <Route path="/manufacturing/issue-materials" element={<ProtectedRoute><StockEntry /></ProtectedRoute>} />
                <Route path="/manufacturing/complete-production" element={<ProtectedRoute><StockEntry /></ProtectedRoute>} />
                <Route path="/manufacturing/production-plan" element={<ProtectedRoute><ProductionPlan /></ProtectedRoute>} />
                <Route path="/stock/finished-goods" element={<ProtectedRoute><StockOverview defaultGroupFilter="Finished Goods" /></ProtectedRoute>} />
                <Route path="/stock/ledger" element={<ProtectedRoute><StockLedger /></ProtectedRoute>} />

              </Routes>
            </AuthProvider>
          </SidebarProvider>
        </ForecastProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
