import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'

// Layouts
import PublicLayout from './components/layouts/PublicLayout.jsx'
import FarmerLayout from './components/layouts/FarmerLayout.jsx'
import OfficerLayout from './components/layouts/OfficerLayout.jsx'
import AdminLayout from './components/layouts/AdminLayout.jsx'

// Auth Pages
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import OtpVerification from './pages/auth/OtpVerification.jsx'

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard.jsx'
import ComplaintsPage from './pages/farmer/Complaints.jsx'
import CreateComplaint from './pages/farmer/CreateComplaint.jsx'
import ComplaintDetail from './pages/farmer/ComplaintDetail.jsx'
import AIAssistant from './pages/farmer/AIAssistant.jsx'
import CropDoctor from './pages/farmer/CropDoctor.jsx'
import WeatherPage from './pages/farmer/Weather.jsx'
import MandiPrices from './pages/farmer/MandiPrices.jsx'
import SchemesPage from './pages/farmer/Schemes.jsx'
import SoilHealth from './pages/farmer/SoilHealth.jsx'
import LoanAssistant from './pages/farmer/LoanAssistant.jsx'
import Marketplace from './pages/farmer/Marketplace.jsx'
import EquipmentRental from './pages/farmer/EquipmentRental.jsx'
import FarmCalendar from './pages/farmer/FarmCalendar.jsx'
import LivestockPage from './pages/farmer/Livestock.jsx'
import DocumentVault from './pages/farmer/DocumentVault.jsx'
import NewsPage from './pages/farmer/News.jsx'
import EmergencySOS from './pages/farmer/EmergencySOS.jsx'
import CommunityPage from './pages/farmer/Community.jsx'
import ProfilePage from './pages/farmer/Profile.jsx'

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard.jsx'
import OfficerComplaints from './pages/officer/Complaints.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import ComplaintManagement from './pages/admin/ComplaintManagement.jsx'
import Analytics from './pages/admin/Analytics.jsx'
import OfficerManagement from './pages/admin/OfficerManagement.jsx'

// Common
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import LoadingScreen from './components/common/LoadingScreen.jsx'

import { setTheme } from './store/slices/themeSlice.jsx'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { mode } = useSelector(state => state.theme)

  useEffect(() => {
    const savedTheme = localStorage.getItem('krishimitra_theme') || 'dark'
    dispatch(setTheme(savedTheme))
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [dispatch])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Farmer Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['FARMER']}>
            <FarmerLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<FarmerDashboard />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/new" element={<CreateComplaint />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/crop-doctor" element={<CropDoctor />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/mandi-prices" element={<MandiPrices />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/loan-assistant" element={<LoanAssistant />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/equipment" element={<EquipmentRental />} />
          <Route path="/farm-calendar" element={<FarmCalendar />} />
          <Route path="/livestock" element={<LivestockPage />} />
          <Route path="/documents" element={<DocumentVault />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/sos" element={<EmergencySOS />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Officer Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['OFFICER']}>
            <OfficerLayout />
          </ProtectedRoute>
        }>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/complaints" element={<OfficerComplaints />} />
          <Route path="/officer/complaints/:id" element={<ComplaintDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/officers" element={<OfficerManagement />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
