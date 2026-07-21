import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  FileText, Upload, X, AlertTriangle, Loader2,
  Droplets, Zap, Road, Landmark, Tractor, Wheat,
  Bug, Heart, Building, CloudRain, ArrowLeft
} from 'lucide-react'
import { createComplaint } from '../../store/slices/complaintSlice.jsx'
import { PageHeader, Alert, Card } from '../../components/common/UIComponents.jsx'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'WATER_IRRIGATION', label: 'Water & Irrigation', icon: Droplets, color: 'text-blue-400' },
  { id: 'ELECTRICITY', label: 'Electricity', icon: Zap, color: 'text-yellow-400' },
  { id: 'ROADS', label: 'Roads', icon: Road, color: 'text-orange-400' },
  { id: 'GOVERNMENT_SCHEMES', label: 'Govt Schemes', icon: Landmark, color: 'text-purple-400' },
  { id: 'AGRICULTURE', label: 'Agriculture Dept', icon: Tractor, color: 'text-green-400' },
  { id: 'FERTILIZER', label: 'Fertilizer Issues', icon: Wheat, color: 'text-lime-400' },
  { id: 'SEEDS', label: 'Seed Issues', icon: Bug, color: 'text-red-400' },
  { id: 'ANIMAL_HUSBANDRY', label: 'Animal Husbandry', icon: Heart, color: 'text-pink-400' },
  { id: 'PUBLIC_SERVICES', label: 'Public Services', icon: Building, color: 'text-cyan-400' },
  { id: 'DISASTER', label: 'Disaster Related', icon: CloudRain, color: 'text-slate-400' },
]

export default function CreateComplaint() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [files, setFiles] = useState([])
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.slice(0, 5 - files.length)
    setFiles(prev => [...prev, ...newFiles])
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index))

  const onSubmit = async (data) => {
    if (!selectedCategory) {
      toast.error('Please select a category')
      return
    }

    setIsSubmitting(true)
    const payload = { ...data, category: selectedCategory, attachments: files }

    const result = await dispatch(createComplaint(payload))
    setIsSubmitting(false)

    if (createComplaint.fulfilled.match(result)) {
      toast.success('Complaint filed successfully!')
      navigate('/complaints')
    } else {
      toast.error('Failed to file complaint. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="File a Complaint"
        subtitle="Report an issue and track its resolution"
        breadcrumbs={['Home', 'Complaints', 'New']}
        action={
          <button onClick={() => navigate('/complaints')} className="btn-ghost flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        }
      />

      <Alert type="info">
        AI will automatically categorize and prioritize your complaint. You'll receive updates at every step.
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Card>
          <h3 className="section-title mb-4">Basic Details</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Complaint Title *</label>
              <input
                {...register('title', { required: 'Title is required', minLength: { value: 10, message: 'Min 10 characters' } })}
                placeholder="Brief description of your issue..."
                className="input-field"
              />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label">Detailed Description *</label>
              <textarea
                {...register('description', { required: 'Description is required', minLength: { value: 30, message: 'Min 30 characters' } })}
                placeholder="Describe your issue in detail. Include date when it started, how it affects you, what solutions you've tried..."
                rows={5}
                className="input-field resize-none"
              />
              {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
              <p className="text-xs text-slate-500 mt-1">
                {watch('description')?.length || 0} characters (minimum 30)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Location / Village</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  placeholder="Village, Block, District"
                  className="input-field"
                />
                {errors.location && <p className="text-xs text-danger mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <label className="label">Incident Date</label>
                <input
                  {...register('incidentDate')}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Category */}
        <Card>
          <h3 className="section-title mb-4">Select Category *</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center
                  ${selectedCategory === id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
              >
                <Icon className={`w-5 h-5 ${selectedCategory === id ? 'text-primary' : color}`} />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </button>
            ))}
          </div>
          {!selectedCategory && (
            <p className="text-xs text-slate-500 mt-3">* Please select a category to proceed</p>
          )}
        </Card>

        {/* Attachments */}
        <Card>
          <h3 className="section-title mb-4">Attachments (Optional)</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="text-xs text-slate-600 mt-1">JPG, PNG, PDF • Max 10MB per file • Up to 5 files</p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => removeFile(i)}
                    className="p-1 text-slate-500 hover:text-danger rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/complaints')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedCategory}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><FileText className="w-4 h-4" /> Submit Complaint</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
