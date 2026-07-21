import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, FileText, CheckCircle, Clock, AlertTriangle,
  TrendingUp, MapPin, Activity, BarChart3, Shield
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { StatCard, Card, Badge, PageHeader, ProgressBar } from '../../components/common/UIComponents.jsx'
import { adminService } from '../../services/index.jsx'

const MOCK_STATS = {
  totalUsers: 12450, totalFarmers: 11200, totalOfficers: 48,
  totalComplaints: 3240, resolved: 2810, pending: 285, open: 145,
  highPriority: 52, activeVillages: 342, resolutionRate: 86.7,
}

const MONTHLY_DATA = [
  { month: 'Jan', complaints: 280, resolved: 240 },
  { month: 'Feb', complaints: 320, resolved: 285 },
  { month: 'Mar', complaints: 290, resolved: 260 },
  { month: 'Apr', complaints: 410, resolved: 370 },
  { month: 'May', complaints: 380, resolved: 355 },
  { month: 'Jun', complaints: 340, resolved: 300 },
]

const CATEGORY_DATA = [
  { name: 'Water', value: 28, color: '#0ea5e9' },
  { name: 'Agriculture', value: 22, color: '#10b981' },
  { name: 'Roads', value: 18, color: '#f59e0b' },
  { name: 'Electricity', value: 15, color: '#f97316' },
  { name: 'Schemes', value: 10, color: '#8b5cf6' },
  { name: 'Other', value: 7, color: '#64748b' },
]

const TOP_VILLAGES = [
  { name: 'Rahata', district: 'Ahmednagar', complaints: 42, resolved: 38, rate: 90 },
  { name: 'Igatpuri', district: 'Nashik', complaints: 38, resolved: 31, rate: 82 },
  { name: 'Sangamner', district: 'Ahmednagar', complaints: 35, resolved: 33, rate: 94 },
  { name: 'Yeola', district: 'Nashik', complaints: 29, resolved: 22, rate: 76 },
  { name: 'Kopargaon', district: 'Ahmednagar', complaints: 26, resolved: 25, rate: 96 },
]

const TOP_OFFICERS = [
  { name: 'Rajesh Patil', dept: 'Agriculture', resolved: 128, rating: 4.8 },
  { name: 'Priya Sharma', dept: 'Water Dept', resolved: 112, rating: 4.7 },
  { name: 'Suresh Kumar', dept: 'Roads', resolved: 98, rating: 4.5 },
  { name: 'Anita Desai', dept: 'Electricity', resolved: 89, rating: 4.6 },
]

export default function AdminDashboard() {
  const [stats] = useState(MOCK_STATS)
  const [loading] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="KrishiMitra platform overview and analytics"
        breadcrumbs={['Admin', 'Dashboard']}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="success">Live</Badge>
            <span className="text-xs text-slate-500">Last updated: just now</span>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} color="primary" loading={loading} trend={8} trendValue="this month" />
        <StatCard title="Total Farmers" value={stats.totalFarmers.toLocaleString()} icon={Users} color="accent" loading={loading} />
        <StatCard title="Total Complaints" value={stats.totalComplaints.toLocaleString()} icon={FileText} color="warning" loading={loading} trend={12} trendValue="this month" />
        <StatCard title="Resolved" value={stats.resolved.toLocaleString()} icon={CheckCircle} color="success" loading={loading} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="warning" loading={loading} />
        <StatCard title="High Priority" value={stats.highPriority} icon={AlertTriangle} color="danger" loading={loading} />
        <StatCard title="Active Villages" value={stats.activeVillages} icon={MapPin} color="accent" loading={loading} />
        <StatCard title="Resolution Rate" value={`${stats.resolutionRate}%`} icon={TrendingUp} color="success" loading={loading} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="section-title">Monthly Complaint Trend</h3>
                <p className="section-subtitle">Filed vs Resolved — 2024</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="complaints" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Filed" />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h3 className="section-title mb-4">By Category</h3>
          <div className="flex justify-center mb-4">
            <PieChart width={160} height={160}>
              <Pie data={CATEGORY_DATA} cx={75} cy={75} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {CATEGORY_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-slate-400 flex-1">{name}</span>
                <span className="text-xs font-semibold text-slate-300">{value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Villages & Officers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Villages */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Top Villages
            </h3>
            <Badge variant="info">By Complaints</Badge>
          </div>
          <div className="space-y-4">
            {TOP_VILLAGES.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-slate-200">{v.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{v.district}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${v.rate >= 90 ? 'text-primary' : v.rate >= 80 ? 'text-warning' : 'text-danger'}`}>
                      {v.rate}%
                    </span>
                    <span className="text-xs text-slate-600 ml-1">resolved</span>
                  </div>
                </div>
                <ProgressBar value={v.rate} color={v.rate >= 90 ? 'primary' : v.rate >= 80 ? 'warning' : 'danger'} />
                <p className="text-xs text-slate-600 mt-1">{v.resolved}/{v.complaints} complaints resolved</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Top Officers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Top Officers
            </h3>
            <Badge variant="primary">By Performance</Badge>
          </div>
          <div className="space-y-3">
            {TOP_OFFICERS.map((officer, i) => (
              <motion.div
                key={officer.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{officer.name}</p>
                  <p className="text-xs text-slate-500">{officer.dept}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{officer.resolved}</p>
                  <p className="text-xs text-slate-500">resolved</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-warning">⭐ {officer.rating}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
