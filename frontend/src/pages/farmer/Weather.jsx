import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CloudSun, Cloud, CloudRain, Sun, Wind, Droplets,
  Thermometer, Eye, Gauge, AlertTriangle, MapPin, RefreshCw
} from 'lucide-react'
import { Card, PageHeader, Badge, Alert } from '../../components/common/UIComponents.jsx'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const MOCK_CURRENT = {
  temp: 29, feels_like: 33, humidity: 68, wind: 14, visibility: 8,
  pressure: 1012, uv: 6, condition: 'Partly Cloudy', icon: '⛅',
  location: 'Nashik, Maharashtra', updated: '10:45 AM',
}

const MOCK_FORECAST = [
  { day: 'Today', high: 32, low: 22, rain: 20, icon: '⛅', condition: 'Partly Cloudy' },
  { day: 'Tue', high: 29, low: 21, rain: 65, icon: '🌧', condition: 'Rainy' },
  { day: 'Wed', high: 27, low: 20, rain: 80, icon: '⛈', condition: 'Thunderstorm' },
  { day: 'Thu', high: 31, low: 22, rain: 30, icon: '🌤', condition: 'Mostly Sunny' },
  { day: 'Fri', high: 33, low: 24, rain: 10, icon: '☀️', condition: 'Sunny' },
  { day: 'Sat', high: 34, low: 25, rain: 5, icon: '☀️', condition: 'Clear' },
  { day: 'Sun', high: 30, low: 22, rain: 45, icon: '🌦', condition: 'Showers' },
]

const HOURLY = [
  { time: '6 AM', temp: 24, rain: 10 }, { time: '9 AM', temp: 27, rain: 15 },
  { time: '12 PM', temp: 32, rain: 20 }, { time: '3 PM', temp: 34, rain: 35 },
  { time: '6 PM', temp: 30, rain: 55 }, { time: '9 PM', temp: 26, rain: 40 },
]

const FARMING_ADVICE = [
  { icon: '💧', title: 'Irrigation', text: 'Rain expected Tue–Wed. Skip irrigation for 2 days. Resume Thu if needed.', type: 'info' },
  { icon: '🌾', title: 'Sowing', text: 'Good window for sowing on Fri–Sat. Soil moisture will be optimal.', type: 'success' },
  { icon: '🐛', title: 'Pest Alert', text: 'High humidity increases fungal risk. Apply preventive spray today.', type: 'warning' },
  { icon: '🧹', title: 'Harvesting', text: 'Avoid harvesting on Tue–Wed due to rain. Plan for Thu onwards.', type: 'warning' },
]

export default function WeatherPage() {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('Nashik, Maharashtra')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weather & Climate"
        subtitle="7-day forecast with farming advisory"
        breadcrumbs={['Home', 'Weather']}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-400 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {location}
            </div>
            <button onClick={() => {}} className="btn-ghost p-2">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Current Weather Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-border p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-7xl">{MOCK_CURRENT.icon}</span>
            <div>
              <p className="text-6xl font-display font-bold text-white">{MOCK_CURRENT.temp}°</p>
              <p className="text-slate-400 mt-1">{MOCK_CURRENT.condition}</p>
              <p className="text-xs text-slate-500 mt-0.5">Feels like {MOCK_CURRENT.feels_like}°C</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Droplets, label: 'Humidity', value: `${MOCK_CURRENT.humidity}%`, color: 'text-blue-400' },
              { icon: Wind, label: 'Wind', value: `${MOCK_CURRENT.wind} km/h`, color: 'text-slate-300' },
              { icon: Eye, label: 'Visibility', value: `${MOCK_CURRENT.visibility} km`, color: 'text-slate-300' },
              { icon: Gauge, label: 'Pressure', value: `${MOCK_CURRENT.pressure} hPa`, color: 'text-slate-300' },
              { icon: Thermometer, label: 'UV Index', value: `${MOCK_CURRENT.uv} / 10`, color: 'text-warning' },
              { icon: CloudRain, label: 'Rain Chance', value: '20%', color: 'text-accent' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-4">Last updated: {MOCK_CURRENT.updated}</p>
      </motion.div>

      {/* Alerts */}
      <Alert type="warning" title="Rain Alert">
        Heavy rainfall expected Tuesday and Wednesday (65–80% probability). Take necessary precautions for stored crops and livestock.
      </Alert>

      {/* 7-Day Forecast */}
      <Card>
        <h3 className="section-title mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {MOCK_FORECAST.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors
                ${i === 0 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-slate-800/50'}`}
            >
              <p className={`text-xs font-semibold ${i === 0 ? 'text-primary' : 'text-slate-400'}`}>{day.day}</p>
              <span className="text-2xl">{day.icon}</span>
              <p className="text-sm font-bold text-slate-200">{day.high}°</p>
              <p className="text-xs text-slate-500">{day.low}°</p>
              <div className="flex items-center gap-0.5 text-xs text-accent">
                <Droplets className="w-3 h-3" />
                <span>{day.rain}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Hourly Chart */}
      <Card>
        <h3 className="section-title mb-4">Today's Temperature & Rain</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={HOURLY}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="temp" orientation="left" />
            <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Area yAxisId="temp" type="monotone" dataKey="temp" stroke="#f59e0b" fill="url(#tempGrad)" name="Temp °C" />
            <Area yAxisId="rain" type="monotone" dataKey="rain" stroke="#0ea5e9" fill="url(#rainGrad)" name="Rain %" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Farming Advice */}
      <div>
        <h3 className="section-title mb-4">Farming Advisory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FARMING_ADVICE.map((advice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 border-l-4 ${
                advice.type === 'warning' ? 'border-l-warning' :
                advice.type === 'success' ? 'border-l-primary' : 'border-l-accent'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{advice.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{advice.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{advice.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
