import { motion } from 'framer-motion'

// ─── Stat Card ──────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', loading }) {
  const colorMap = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    accent: 'text-accent bg-accent/10 border-accent/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  if (loading) return <SkeletonCard />

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-slate-100 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className={trend >= 0 ? 'text-emerald-400' : 'text-danger'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-slate-500">{trendValue}</span>
        </div>
      )}
    </motion.div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, padding = 'p-6' }) {
  return (
    <div className={`glass-card ${padding} ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'primary', size = 'sm' }) {
  const variants = {
    primary: 'badge-primary',
    warning: 'badge-warning',
    danger: 'badge-danger',
    success: 'badge-success',
    info: 'badge-info',
    muted: 'badge bg-slate-700 text-slate-300',
  }
  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }
  return (
    <span className={`${variants[variant]} ${sizes[size]} inline-flex items-center rounded-full font-semibold`}>
      {children}
    </span>
  )
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
export function PriorityBadge({ priority }) {
  const map = {
    HIGH: { variant: 'danger', label: 'High' },
    MEDIUM: { variant: 'warning', label: 'Medium' },
    LOW: { variant: 'success', label: 'Low' },
  }
  const { variant, label } = map[priority] || { variant: 'muted', label: priority }
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    OPEN: { variant: 'info', label: 'Open' },
    PENDING: { variant: 'warning', label: 'Pending' },
    IN_PROGRESS: { variant: 'primary', label: 'In Progress' },
    RESOLVED: { variant: 'success', label: 'Resolved' },
    CLOSED: { variant: 'muted', label: 'Closed' },
    ESCALATED: { variant: 'danger', label: 'Escalated' },
  }
  const { variant, label } = map[status] || { variant: 'muted', label: status }
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Skeleton Components ──────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="shimmer h-4 w-24 rounded mb-2" />
          <div className="shimmer h-8 w-16 rounded" />
        </div>
        <div className="shimmer w-12 h-12 rounded-xl" />
      </div>
      <div className="shimmer h-3 w-32 rounded" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-t border-slate-700/30">
      <div className="shimmer w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="shimmer h-4 w-3/4 rounded mb-2" />
        <div className="shimmer h-3 w-1/2 rounded" />
      </div>
      <div className="shimmer h-6 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonList({ count = 5 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action, breadcrumbs }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-slate-400' : ''}>{crumb}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-display font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  if (!label) return <div className="divider" />
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 border-t border-slate-700/50" />
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <div className="flex-1 border-t border-slate-700/50" />
    </div>
  )
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', title, children, onClose }) {
  const styles = {
    info: 'bg-accent/10 border-accent/30 text-accent',
    success: 'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    error: 'bg-danger/10 border-danger/30 text-danger',
  }
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm ${styles[type]}`}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <p className="opacity-90">{children}</p>
    </div>
  )
}

// ─── Loading Dots ────────────────────────────────────────────────────────────
export function LoadingDots() {
  return (
    <div className="loading-dots flex items-center gap-1">
      <span /><span /><span />
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-slate-700`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white ring-2 ring-slate-700`}>
      {initials}
    </div>
  )
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'primary', showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colors[color]} rounded-full`}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative glass-card w-full ${sizes[size]} z-10`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-display font-bold text-slate-100">{title}</h2>
            <button onClick={onClose} className="btn-ghost p-2 rounded-lg">✕</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}
