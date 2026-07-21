import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function LoadingScreen({ message = 'Loading KrishiMitra...' }) {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-primary mb-6"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-slate-400"
      >
        <Leaf className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </div>
  )
}
