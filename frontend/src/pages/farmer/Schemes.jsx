import { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, CheckCircle, ExternalLink, Search, ChevronRight } from 'lucide-react'
import { Card, PageHeader, Badge, Alert } from '../../components/common/UIComponents.jsx'

const SCHEMES = [
  { id: 1, name: 'PM Kisan Samman Nidhi', benefit: '₹6,000/year', eligibility: 'All land-owning farmers', category: 'Income Support', status: 'ELIGIBLE', icon: '🌾' },
  { id: 2, name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Crop Insurance', eligibility: 'All farmers with crop loans', category: 'Insurance', status: 'ELIGIBLE', icon: '🛡️' },
  { id: 3, name: 'Kisan Credit Card (KCC)', benefit: 'Credit up to ₹3 lakh @ 4%', eligibility: 'Farmers with land records', category: 'Credit', status: 'ELIGIBLE', icon: '💳' },
  { id: 4, name: 'PM Kusum Solar Pump', benefit: '60% subsidy on solar pump', eligibility: 'Farmers without electricity', category: 'Infrastructure', status: 'CHECK', icon: '☀️' },
  { id: 5, name: 'Soil Health Card Scheme', benefit: 'Free soil testing', eligibility: 'All farmers', category: 'Soil', status: 'ELIGIBLE', icon: '🧪' },
  { id: 6, name: 'e-NAM (National Market)', benefit: 'Better market prices', eligibility: 'Registered farmers', category: 'Market', status: 'CHECK', icon: '📊' },
]

export default function SchemesPage() {
  const [search, setSearch] = useState('')
  const filtered = SCHEMES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader title="Government Schemes" subtitle="AI-matched schemes for your profile" breadcrumbs={['Home', 'Schemes']} />
      <Alert type="success">Based on your profile, you are eligible for 4 schemes. Apply now to avail benefits!</Alert>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..." className="input-field pl-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scheme, i) => (
          <motion.div key={scheme.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card hover className="cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{scheme.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-200 leading-tight">{scheme.name}</h3>
                    <Badge variant={scheme.status === 'ELIGIBLE' ? 'success' : 'warning'}>{scheme.status}</Badge>
                  </div>
                  <p className="text-xs text-primary font-medium mt-1">{scheme.benefit}</p>
                  <p className="text-xs text-slate-500 mt-1">{scheme.eligibility}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="muted">{scheme.category}</Badge>
                    <button className="text-xs text-primary hover:text-primary-400 flex items-center gap-1">
                      Apply Now <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
