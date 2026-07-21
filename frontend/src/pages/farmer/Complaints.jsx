import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, FileText, ChevronRight, Calendar } from 'lucide-react'
import { fetchComplaints, setFilters, clearFilters } from '../../store/slices/complaintSlice.jsx'
import {
  PageHeader, Card, StatusBadge, PriorityBadge,
  SkeletonList, EmptyState, Badge
} from '../../components/common/UIComponents.jsx'
import { formatDistanceToNow } from 'date-fns'

const CATEGORIES = ['All', 'WATER_IRRIGATION', 'ELECTRICITY', 'ROADS', 'GOVERNMENT_SCHEMES', 'AGRICULTURE', 'FERTILIZER', 'SEEDS', 'ANIMAL_HUSBANDRY', 'PUBLIC_SERVICES', 'DISASTER']
const STATUSES = ['All', 'OPEN', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']

export default function ComplaintsPage() {
  const dispatch = useDispatch()
  const { complaints, isLoading, totalElements, totalPages, currentPage, filters } = useSelector(state => state.complaints)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchComplaints({ ...filters, search, page: 0, size: 10 }))
  }, [filters, search])

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value === 'All' ? '' : value }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Complaints"
        subtitle={`${totalElements} total complaints`}
        breadcrumbs={['Home', 'Complaints']}
        action={
          <Link to="/complaints/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Complaint
          </Link>
        }
      />

      {/* Search & Filters */}
      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'border-primary text-primary' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          {(filters.status || filters.category) && (
            <button onClick={() => dispatch(clearFilters())} className="btn-ghost text-sm text-danger">
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="label text-xs">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleFilterChange('status', s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      (filters.status || 'All') === s
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {s === 'All' ? 'All' : s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label text-xs">Priority</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <button
                    key={p}
                    onClick={() => handleFilterChange('priority', p)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      (filters.priority || 'All') === p
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* List */}
      <Card padding="p-0">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No complaints found"
            description="You haven't filed any complaints yet, or none match your filters."
            action={
              <Link to="/complaints/new" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> File First Complaint
              </Link>
            }
          />
        ) : (
          <div>
            {complaints.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/complaints/${complaint.id}`}
                  className="flex items-start gap-4 p-5 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate group-hover:text-primary transition-colors">
                          {complaint.title}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{complaint.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                      <Badge variant="muted">
                        {complaint.category?.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-slate-600 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {complaint.createdAt
                          ? formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })
                          : 'Recently'}
                      </span>
                    </div>
                    {complaint.complaintNumber && (
                      <p className="text-xs text-slate-600 mt-1">#{complaint.complaintNumber}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => dispatch(fetchComplaints({ ...filters, page: i, size: 10 }))}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
