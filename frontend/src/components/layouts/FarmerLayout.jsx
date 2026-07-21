import { useState, useEffect } from 'react'
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Leaf, CloudSun, TrendingUp,
  FileText, Stethoscope, FlaskConical, Calculator, ShoppingBag,
  Tractor, Calendar, Heart, FolderLock, Newspaper, AlertTriangle,
  Users, Bell, Search, Sun, Moon, Menu, X, ChevronLeft, User,
  LogOut, Settings, Sprout
} from 'lucide-react'
import { toggleTheme } from '../../store/slices/themeSlice.jsx'
import { logout } from '../../store/slices/authSlice.jsx'
import { toggleNotificationPanel } from '../../store/slices/notificationSlice.jsx'
import { Avatar } from '../common/UIComponents.jsx'
import NotificationPanel from '../common/NotificationPanel.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Assistant', path: '/ai-assistant', icon: MessageSquare },
  { label: 'Crop Doctor', path: '/crop-doctor', icon: Stethoscope },
  { label: 'Complaints', path: '/complaints', icon: FileText },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Weather', path: '/weather', icon: CloudSun },
  { label: 'Mandi Prices', path: '/mandi-prices', icon: TrendingUp },
  { label: 'Schemes', path: '/schemes', icon: Leaf },
  { label: 'Soil Health', path: '/soil-health', icon: FlaskConical },
  { label: 'Loan Assistant', path: '/loan-assistant', icon: Calculator },
  { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { label: 'Equipment', path: '/equipment', icon: Tractor },
  { label: 'Farm Calendar', path: '/farm-calendar', icon: Calendar },
  { label: 'Livestock', path: '/livestock', icon: Heart },
  { label: 'Documents', path: '/documents', icon: FolderLock },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Emergency SOS', path: '/sos', icon: AlertTriangle, danger: true },
]

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { mode } = useSelector(state => state.theme)
  const { user } = useSelector(state => state.auth)
  const { unreadCount, isOpen: notifOpen } = useSelector(state => state.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.aside
          animate={{ width: sidebarOpen ? 260 : 72 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`
            fixed lg:relative inset-y-0 left-0 z-50
            flex flex-col bg-slate-900 border-r border-slate-800
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform lg:transition-none
          `}
          style={{ width: sidebarOpen ? 260 : 72 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 min-h-[64px]">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Sprout className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-slate-100 text-sm leading-none">KrishiMitra</p>
                    <p className="text-xs text-primary font-medium mt-0.5">AI Platform</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {NAV_ITEMS.map(({ label, path, icon: Icon, danger }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? danger
                        ? 'text-danger bg-danger/10 border border-danger/20'
                        : 'text-primary bg-primary/10 border border-primary/20'
                      : danger
                        ? 'text-slate-400 hover:text-danger hover:bg-danger/5'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`
                }
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-2 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => navigate('/profile')}>
              <Avatar name={user?.fullName} src={user?.profilePicture} size="sm" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName || 'Farmer'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.village || 'Rural India'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/5 transition-colors text-sm mt-1 ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                placeholder="Search anything..."
                className="bg-transparent text-sm text-slate-300 placeholder-slate-500 focus:outline-none flex-1"
              />
              <kbd className="text-xs text-slate-600 bg-slate-700/50 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button
              onClick={() => dispatch(toggleNotificationPanel())}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Avatar name={user?.fullName} src={user?.profilePicture} size="sm" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="page-container"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel isOpen={notifOpen} onClose={() => dispatch(toggleNotificationPanel())} />
    </div>
  )
}
