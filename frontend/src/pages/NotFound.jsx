import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Sprout } from 'lucide-react'
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-6">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-6">
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
          <Sprout className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-7xl font-display font-black text-slate-800 mb-2">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm">This field seems empty. Let's get you back on track.</p>
        </div>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Go to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
