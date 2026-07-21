import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Search, MapPin, RefreshCw } from 'lucide-react'
import { Card, PageHeader, Badge } from '../../components/common/UIComponents.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PRICES = [
  { crop: 'Wheat', hindi: 'गेहूं', price: 2250, prev: 2180, unit: 'Quintal', mandi: 'Nashik', category: 'Cereal' },
  { crop: 'Rice', hindi: 'धान', price: 2150, prev: 2200, unit: 'Quintal', mandi: 'Nashik', category: 'Cereal' },
  { crop: 'Tomato', hindi: 'टमाटर', price: 1800, prev: 1200, unit: 'Quintal', mandi: 'Nashik', category: 'Vegetable' },
  { crop: 'Onion', hindi: 'प्याज', price: 950, prev: 1050, unit: 'Quintal', mandi: 'Nashik', category: 'Vegetable' },
  { crop: 'Potato', hindi: 'आलू', price: 1100, prev: 1100, unit: 'Quintal', mandi: 'Nashik', category: 'Vegetable' },
  { crop: 'Soybean', hindi: 'सोयाबीन', price: 4800, prev: 4650, unit: 'Quintal', mandi: 'Pune', category: 'Oilseed' },
  { crop: 'Cotton', hindi: 'कपास', price: 7200, prev: 7000, unit: 'Quintal', mandi: 'Aurangabad', category: 'Cash Crop' },
  { crop: 'Sugarcane', hindi: 'गन्ना', price: 315, prev: 310, unit: 'Quintal', mandi: 'Kolhapur', category: 'Cash Crop' },
  { crop: 'Maize', hindi: 'मक्का', price: 1950, prev: 1900, unit: 'Quintal', mandi: 'Nashik', category: 'Cereal' },
  { crop: 'Turmeric', hindi: 'हल्दी', price: 9500, prev: 8800, unit: 'Quintal', mandi: 'Sangli', category: 'Spice' },
]

const TREND_DATA = [
  { date: '1 Jun', Wheat: 2050, Tomato: 800, Onion: 1200 },
  { date: '5 Jun', Wheat: 2100, Tomato: 950, Onion: 1100 },
  { date: '10 Jun', Wheat: 2180, Tomato: 1100, Onion: 1050 },
  { date: '15 Jun', Wheat: 2200, Tomato: 1400, Onion: 980 },
  { date: '20 Jun', Wheat: 2230, Tomato: 1650, Onion: 960 },
  { date: '23 Jun', Wheat: 2250, Tomato: 1800, Onion: 950 },
]

const CATEGORIES = ['All', 'Cereal', 'Vegetable', 'Oilseed', 'Cash Crop', 'Spice']

export default function MandiPrices() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedCrops, setSelectedCrops] = useState(['Wheat', 'Tomato', 'Onion'])

  const filtered = PRICES.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.crop.toLowerCase().includes(search.toLowerCase()) || p.hindi.includes(search))
  )

  const getChange = (price, prev) => {
    const pct = ((price - prev) / prev * 100).toFixed(1)
    return { pct, up: price > prev, same: price === prev }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mandi Price Intelligence"
        subtitle={`Live prices — Updated today, ${new Date().toLocaleDateString('en-IN')}`}
        breadcrumbs={['Home', 'Mandi Prices']}
        action={
          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Maharashtra
          </div>
        }
      />

      {/* Price Trend Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Price Trends — Last 30 Days</h3>
            <p className="section-subtitle">₹ per Quintal</p>
          </div>
          <div className="flex gap-2">
            {['Wheat', 'Tomato', 'Onion'].map((crop, i) => {
              const colors = ['#10b981', '#f59e0b', '#0ea5e9']
              return (
                <div key={crop} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-0.5 rounded" style={{ background: colors[i] }} />
                  {crop}
                </div>
              )
            })}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Line type="monotone" dataKey="Wheat" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Tomato" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Onion" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search crop name..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-2 rounded-xl border transition-colors ${
                category === cat
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Table */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Crop', 'Mandi', 'Price (₹/Qtl)', 'Change', 'Category'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const { pct, up, same } = getChange(item.price, item.prev)
                return (
                  <motion.tr
                    key={item.crop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-200">{item.crop}</p>
                        <p className="text-xs text-slate-500">{item.hindi}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {item.mandi}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg font-display font-bold text-slate-100">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        same ? 'text-slate-500' : up ? 'text-primary' : 'text-danger'
                      }`}>
                        {same ? <Minus className="w-3.5 h-3.5" /> :
                          up ? <TrendingUp className="w-3.5 h-3.5" /> :
                            <TrendingDown className="w-3.5 h-3.5" />}
                        {same ? '0%' : `${up ? '+' : ''}${pct}%`}
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant="muted">{item.category}</Badge>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
