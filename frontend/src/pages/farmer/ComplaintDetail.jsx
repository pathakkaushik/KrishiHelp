import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, FileText, Clock, CheckCircle, AlertTriangle,
  MessageSquare, Paperclip, Star, Send, Loader2, User, MapPin
} from 'lucide-react'
import {
  Card, PageHeader, StatusBadge, PriorityBadge, Badge, Alert
} from '../../components/common/UIComponents.jsx'
import complaintService from '../../services/complaintService.jsx'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['OPEN', 'PENDING', 'IN_PROGRESS', 'RESOLVED']

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' })
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [comp, tl] = await Promise.all([
        complaintService.getComplaintById(id),
        complaintService.getComplaintTimeline(id),
      ])
      setComplaint(comp)
      setTimeline(tl)
      if (comp.status === 'RESOLVED') setShowFeedback(true)
    } catch (e) {
      toast.error('Failed to load complaint')
      navigate('/complaints')
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (!feedback.rating) return toast.error('Please provide a rating')
    setSubmittingFeedback(true)
    try {
      await complaintService.submitFeedback(id, feedback)
      toast.success('Feedback submitted! Thank you.')
      setShowFeedback(false)
    } catch (e) {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer w-48 rounded" />
        <div className="h-48 shimmer rounded-2xl" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    )
  }

  if (!complaint) return null

  const currentStep = STATUS_STEPS.indexOf(complaint.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Complaint Details"
        breadcrumbs={['Home', 'Complaints', `#${complaint.complaintNumber || id}`]}
        action={
          <button onClick={() => navigate('/complaints')} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        }
      />

      {/* Progress Bar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Complaint Status</h3>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    done
                      ? 'bg-primary border-primary text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-600'
                  } ${active ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-slate-800' : ''}`}>
                    {done && i < currentStep
                      ? <CheckCircle className="w-4 h-4" />
                      : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${done ? 'text-primary' : 'text-slate-600'}`}>
                    {step.replace('_', ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-100">{complaint.title}</h2>
                {complaint.complaintNumber && (
                  <p className="text-sm text-slate-500 mt-1">#{complaint.complaintNumber}</p>
                )}
              </div>
              <PriorityBadge priority={complaint.priority} />
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{complaint.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700/50">
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <Badge variant="info">{complaint.category?.replace('_', ' ')}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {complaint.location || 'Not specified'}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Filed On</p>
                <p className="text-sm text-slate-300">
                  {complaint.createdAt ? format(new Date(complaint.createdAt), 'dd MMM yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                <p className="text-sm text-slate-300">
                  {complaint.updatedAt
                    ? formatDistanceToNow(new Date(complaint.updatedAt), { addSuffix: true })
                    : 'N/A'}
                </p>
              </div>
            </div>

            {complaint.assignedOfficer && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Assigned Officer</p>
                  <p className="text-sm font-medium text-slate-200">{complaint.assignedOfficer.name}</p>
                  <p className="text-xs text-slate-400">{complaint.assignedOfficer.department}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Attachments */}
          {complaint.attachments?.length > 0 && (
            <Card>
              <h3 className="section-title mb-4 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments ({complaint.attachments.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complaint.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">{att.fileName}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Feedback */}
          {showFeedback && (
            <Card className="border-primary/20">
              <h3 className="section-title mb-2">Rate Resolution</h3>
              <p className="text-sm text-slate-400 mb-4">How satisfied are you with the resolution?</p>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setFeedback(f => ({ ...f, rating: star }))}
                    className={`transition-colors ${star <= feedback.rating ? 'text-warning' : 'text-slate-600'}`}
                  >
                    <Star className="w-7 h-7 fill-current" />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback.comment}
                onChange={e => setFeedback(f => ({ ...f, comment: e.target.value }))}
                placeholder="Any additional comments..."
                rows={3}
                className="input-field resize-none mb-3"
              />
              <button
                onClick={submitFeedback}
                disabled={submittingFeedback}
                className="btn-primary flex items-center gap-2"
              >
                {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Feedback
              </button>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <div>
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity Timeline
            </h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No updates yet</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-700" />
                <div className="space-y-4">
                  {timeline.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 relative"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center flex-shrink-0 relative z-10">
                        {event.status === 'RESOLVED'
                          ? <CheckCircle className="w-3.5 h-3.5 text-primary" />
                          : event.status === 'ESCALATED'
                            ? <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                            : <MessageSquare className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                      <div className="pb-4 min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200">{event.action || event.status}</p>
                        {event.remarks && (
                          <p className="text-xs text-slate-400 mt-0.5">{event.remarks}</p>
                        )}
                        <p className="text-xs text-slate-600 mt-1">
                          {event.createdAt
                            ? formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })
                            : 'Recently'}
                          {event.updatedBy && ` · ${event.updatedBy}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
