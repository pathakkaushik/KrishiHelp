import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { markAllRead, markRead } from '../../store/slices/notificationSlice.jsx'
import { formatDistanceToNow } from 'date-fns'

const ICONS = {
  SUCCESS: CheckCircle,
  ERROR: AlertCircle,
  WARNING: AlertCircle,
  INFO: Info,
}

const COLORS = {
  SUCCESS: 'text-primary bg-primary/10',
  ERROR: 'text-danger bg-danger/10',
  WARNING: 'text-warning bg-warning/10',
  INFO: 'text-accent bg-accent/10',
}

export default function NotificationPanel({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { items, unreadCount } = useSelector(state => state.notifications)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 w-80 z-50 glass-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllRead())}
                    className="text-xs text-primary hover:text-primary-400 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
                <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Bell className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                items.map(notif => {
                  const Icon = ICONS[notif.type] || Info
                  const colorClass = COLORS[notif.type] || COLORS.INFO
                  return (
                    <div
                      key={notif.id}
                      onClick={() => dispatch(markRead(notif.id))}
                      className={`flex gap-3 p-4 border-b border-slate-700/30 cursor-pointer hover:bg-slate-800/50 transition-colors
                        ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 leading-tight">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'just now'}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
