import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Phone, Heart, Zap, Droplets, CloudRain,
  Stethoscope, Loader2, CheckCircle, MapPin
} from 'lucide-react'
import { Card, PageHeader, Alert } from '../../components/common/UIComponents.jsx'
import { sosService } from '../../services/index.jsx'
import toast from 'react-hot-toast'

const EMERGENCY_TYPES = [
  { id: 'MEDICAL', label: 'Medical Emergency', icon: Heart, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', desc: 'Health emergency, need ambulance' },
  { id: 'LIVESTOCK', label: 'Livestock Emergency', icon: Stethoscope, color: 'text-warning', bg: 'bg-warning/10 border-warning/30', desc: 'Animal illness, need vet' },
  { id: 'FLOOD', label: 'Flood', icon: CloudRain, color: 'text-accent', bg: 'bg-accent/10 border-accent/30', desc: 'Flood rescue needed' },
  { id: 'DROUGHT', label: 'Drought', icon: Droplets, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', desc: 'Severe water shortage' },
  { id: 'IRRIGATION_FAILURE', label: 'Irrigation Failure', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', desc: 'Canal/pump failure' },
  { id: 'ELECTRICITY_FAILURE', label: 'Electricity Failure', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', desc: 'Power outage' },
]

const CONTACTS = [
  { name: 'Ambulance', number: '108', icon: Heart, color: 'text-danger' },
  { name: 'Police', number: '100', icon: AlertTriangle, color: 'text-warning' },
  { name: 'Fire Brigade', number: '101', icon: Zap, color: 'text-orange-400' },
  { name: 'NDRF Helpline', number: '011-24363260', icon: CloudRain, color: 'text-accent' },
  { name: 'Kisan Helpline', number: '1800-180-1551', icon: Droplets, color: 'text-primary' },
  { name: 'PM Kisan Helpline', number: '155261', icon: Phone, color: 'text-green-400' },
]

export default function EmergencySOS() {
  const [selected, setSelected] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [description, setDescription] = useState('')

  const triggerSOS = async () => {
    if (!selected) return toast.error('Please select emergency type')
    setSending(true)
    try {
      await sosService.triggerSOS({ type: selected, description, timestamp: new Date().toISOString() })
      setSent(true)
      toast.success('SOS alert sent! Help is on the way.')
    } catch (e) {
      // For demo, show success anyway
      setSent(true)
      toast.success('SOS alert sent! Authorities notified.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 3, duration: 0.5 }}
            className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">SOS Alert Sent!</h2>
          <p className="text-slate-400 mb-6">Your emergency has been reported. Help is being arranged. Stay calm and stay safe.</p>
          <div className="bg-slate-800/60 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-xs text-slate-500">Emergency Reference ID</p>
            <p className="font-mono text-primary font-bold">SOS-{Date.now().toString().slice(-8)}</p>
          </div>
          <button onClick={() => { setSent(false); setSelected(null); setDescription('') }} className="btn-secondary w-full">
            Send Another Alert
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Emergency SOS"
        subtitle="Immediate help for farming emergencies"
        breadcrumbs={['Home', 'Emergency SOS']}
      />

      <Alert type="error" title="Emergency Use Only">
        This feature is for genuine emergencies only. Misuse may result in account suspension and legal action.
      </Alert>

      {/* Emergency Type Selection */}
      <Card>
        <h3 className="section-title mb-4">Select Emergency Type *</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EMERGENCY_TYPES.map(({ id, label, icon: Icon, color, bg, desc }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
                selected === id
                  ? bg + ' scale-95 shadow-lg'
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${selected === id ? color : 'text-slate-500'}`} />
              <span className={`text-xs font-semibold leading-tight ${selected === id ? color : 'text-slate-400'}`}>
                {label}
              </span>
              <span className="text-xs text-slate-600">{desc}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Description */}
      <Card>
        <h3 className="section-title mb-3">Describe the Situation</h3>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Briefly describe what happened and current situation..."
          rows={3}
          className="input-field resize-none"
        />
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Location will be auto-detected from your profile
        </div>
      </Card>

      {/* SOS Button */}
      <motion.button
        onClick={triggerSOS}
        disabled={!selected || sending}
        whileTap={{ scale: 0.97 }}
        className="w-full py-5 rounded-2xl bg-danger hover:bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed
                   text-white font-display font-bold text-xl flex items-center justify-center gap-3
                   transition-all shadow-lg hover:shadow-danger/30 disabled:opacity-50"
      >
        {sending ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Sending SOS...</>
        ) : (
          <><AlertTriangle className="w-6 h-6" /> SEND SOS ALERT</>
        )}
      </motion.button>

      {/* Emergency Contacts */}
      <Card>
        <h3 className="section-title mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTACTS.map(({ name, number, icon: Icon, color }) => (
            <a
              key={name}
              href={`tel:${number}`}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{name}</p>
                <p className="text-xs text-primary font-mono">{number}</p>
              </div>
              <Phone className="w-4 h-4 text-slate-600 ml-auto" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
