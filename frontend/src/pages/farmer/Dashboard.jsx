import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, CheckCircle, Clock, AlertTriangle, MessageSquare,
  CloudSun, TrendingUp, Leaf, ArrowRight, Zap, Bot, Bell
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { StatCard, Card, Badge, SkeletonCard, PageHeader, PriorityBadge, StatusBadge } from '../../components/common/UIComponents.jsx'
import { weatherService, mandiService } from '../../services/index.jsx'
import complaintService from '../../services/complaintService.jsx'

const COMPLAINT_TREND = [
  { month: 'Jan', filed: 4, resolved: 3 },
  { month: 'Feb', filed: 6, resolved: 5 },
  { month: 'Mar', filed: 3, resolved: 4 },
  { month: 'Apr', filed: 8, resolved: 6 },
  { month: 'May', filed: 5, resolved: 7 },
  { month: 'Jun', filed: 7, resolved: 5 },
]

const PIE_DATA = [
  { name: 'Resolved', value: 65, color: '#10b981' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Open', value: 10, color: '#0ea5e9' },
]

const AI_TIPS = [
  { icon: '🌾', text: 'Optimal time to sow Rabi crops is approaching. Check your soil moisture.' },
  { icon: '💧', text: 'Reduce irrigation by 20% — rain expected in your area next 3 days.' },
  { icon: '🐛', text: 'High pest risk this week. Consider neem-based spray as preventive measure.' },
  { icon: '📈', text: 'Tomato prices rising in Nashik Mandi. Consider selling within 5 days.' },
]

const QUICK_ACTIONS = [
  { label: 'File Complaint', path: '/complaints/new', icon: FileText, color: 'text-accent' },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, color: 'text-primary' },
  { label: 'Crop Doctor', path: '/crop-doctor', icon: Zap, color: 'text-warning' },
  { label: 'Emergency SOS', path: '/sos', icon: Bell, color: 'text-danger' },
]

export default function FarmerDashboard() {
  const { user } = useSelector(state => state.auth)
  const [stats, setStats] = useState(null)
  const [weather, setWeather] = useState(null)
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsData, complaintsData] = await Promise.allSettled([
        complaintService.getComplaintStats(),
        complaintService.getMyComplaints({ size: 5, sort: 'createdAt,desc' }),
      ])

      if (statsData.status === 'fulfilled') setStats(statsData.value)
      if (complaintsData.status === 'fulfilled') {
        setRecentComplaints(complaintsData.value.content || complaintsData.value)
      }

      // Mock weather
      setWeather({
        temp: 28,
        feels_like: 31,
        humidity: 65,
        condition: 'Partly Cloudy',
        rain_probability: 40,
        wind: 12,
      })
    } catch (e) {
      // Use mock data
      setStats({ total: 12, resolved: 8, pending: 3, open: 1, high_priority: 2 })
      setRecentComplaints([])
    } finally {
      setLoading(false)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.fullName?.split(' ')[0] || 'Farmer'

  return (
    <div className="space-y-6 stagger">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-border p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm">{greeting} 🌿</p>
            <h1 className="text-2xl font-display font-bold text-white mt-1">
              {greeting}, <span className="gradient-text">{firstName}!</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {user?.village}, {user?.district} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(({ label, path, icon: Icon, color }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:border-slate-600 transition-colors"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={FileText}
          color="accent"
          loading={loading}
          trend={5}
          trendValue="vs last month"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          color="success"
          loading={loading}
          trend={12}
          trendValue="resolution rate"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          color="warning"
          loading={loading}
        />
        <StatCard
          title="High Priority"
          value={stats?.high_priority || 0}
          icon={AlertTriangle}
          color="danger"
          loading={loading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="section-title">Complaint Activity</h3>
                <p className="section-subtitle">Filed vs Resolved — last 6 months</p>
              </div>
              <Badge variant="primary">6M</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={COMPLAINT_TREND}>
                <defs>
                  <linearGradient id="filed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="filed" stroke="#0ea5e9" fill="url(#filed)" name="Filed" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Status Pie & Weather */}
        <div className="space-y-4">
          {/* Pie */}
          <Card>
            <h3 className="section-title mb-4">Status Overview</h3>
            <div className="flex items-center gap-4">
              <PieChart width={100} height={100}>
                <Pie data={PIE_DATA} cx={45} cy={45} innerRadius={30} outerRadius={45} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-2">
                {PIE_DATA.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-slate-400">{name}</span>
                    <span className="text-slate-200 font-semibold ml-auto">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Weather */}
          {weather && (
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-semibold text-slate-200">Today's Weather</h3>
                </div>
                <Link to="/weather" className="text-xs text-primary hover:text-primary-400">View all →</Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-display font-bold text-white">{weather.temp}°C</p>
                  <p className="text-xs text-slate-400 mt-1">{weather.condition}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-slate-400">Humidity: <span className="text-slate-200">{weather.humidity}%</span></p>
                  <p className="text-xs text-slate-400">Rain: <span className="text-accent">{weather.rain_probability}%</span></p>
                  <p className="text-xs text-slate-400">Wind: <span className="text-slate-200">{weather.wind} km/h</span></p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* AI Tips & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Tips */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <h3 className="section-title">AI Recommendations</h3>
          </div>
          <div className="space-y-3">
            {AI_TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-lg flex-shrink-0">{tip.icon}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{tip.text}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/ai-assistant" className="btn-ghost text-sm mt-4 flex items-center gap-1">
            Ask AI Assistant <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Complaints</h3>
            <Link to="/complaints" className="text-xs text-primary hover:text-primary-400 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentComplaints.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No complaints yet</p>
              <Link to="/complaints/new" className="btn-primary text-xs mt-3 inline-flex items-center gap-1">
                File First Complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map(complaint => (
                <Link
                  key={complaint.id}
                  to={`/complaints/${complaint.id}`}
                  className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{complaint.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{complaint.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
