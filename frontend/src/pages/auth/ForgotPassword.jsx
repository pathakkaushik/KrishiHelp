import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
export default function ForgotPassword() {
  return (
    <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-slate-100">ForgotPassword</h2>
      <p className="text-sm text-slate-400">This page is ready for full implementation.</p>
      <Link to="/login" className="btn-secondary inline-block">Back to Login</Link>
    </motion.div>
  )
}
