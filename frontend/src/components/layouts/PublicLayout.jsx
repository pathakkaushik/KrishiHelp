import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sprout, Leaf, Wheat, Droplets } from 'lucide-react'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex-col justify-between p-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow-primary">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-xl">KrishiMitra AI</p>
            <p className="text-xs text-primary font-medium">Smart Farmer Assistance Platform</p>
          </div>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-4xl font-display font-bold text-white leading-tight mb-4">
            Empowering<br />
            <span className="gradient-text">Farmers</span> with<br />
            AI Intelligence
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            From crop diagnosis to grievance management — your complete digital companion
            for modern farming in rural India.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { icon: Leaf, text: 'Crop Doctor' },
              { icon: Wheat, text: 'Mandi Prices' },
              { icon: Droplets, text: 'Weather Alerts' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-300">
                <Icon className="w-3 h-3 text-primary" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative flex gap-8"
        >
          {[
            { value: '10L+', label: 'Farmers Helped' },
            { value: '28', label: 'States Covered' },
            { value: '95%', label: 'Resolution Rate' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <p className="font-display font-bold text-white">KrishiMitra AI</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
