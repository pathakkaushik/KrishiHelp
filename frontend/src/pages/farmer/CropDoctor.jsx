import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Leaf, AlertTriangle, CheckCircle, ChevronDown,
  ChevronUp, Loader2, RefreshCw, Camera, Info
} from 'lucide-react'
import { Card, PageHeader, Badge, Alert, ProgressBar } from '../../components/common/UIComponents.jsx'
import toast from 'react-hot-toast'

const SAMPLE_DISEASES = [
  {
    name: 'Powdery Mildew',
    confidence: 92,
    severity: 'MEDIUM',
    crop: 'Wheat',
    description: 'Fungal disease appearing as white powdery spots on leaves and stems. Caused by Blumeria graminis.',
    symptoms: ['White powdery spots on leaf surface', 'Yellowing of affected areas', 'Stunted plant growth', 'Premature leaf drop'],
    treatment: [
      'Apply sulfur-based fungicide (Sulfex 80WP) at 2g/L water',
      'Use systemic fungicides like Propiconazole 25EC at 0.1%',
      'Remove and destroy infected plant parts',
      'Improve air circulation around plants',
    ],
    prevention: [
      'Use resistant varieties',
      'Avoid overhead irrigation',
      'Maintain proper plant spacing',
      'Apply preventive fungicides at flowering stage',
    ],
    organic: ['Neem oil spray (5ml/L)', 'Baking soda solution (1 tbsp/L)', 'Milk spray (1:9 dilution)'],
  }
]

export default function CropDoctor() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [expandedSection, setExpandedSection] = useState('treatment')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const analyzeImage = async () => {
    if (!image) return
    setAnalyzing(true)
    try {
      // Simulate AI analysis — in production call aiService.analyzeImage()
      await new Promise(r => setTimeout(r, 2500))
      setResult(SAMPLE_DISEASES[0])
      toast.success('Analysis complete!')
    } catch (e) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
  }

  const SEVERITY_CONFIG = {
    LOW: { color: 'success', label: 'Low Severity' },
    MEDIUM: { color: 'warning', label: 'Medium Severity' },
    HIGH: { color: 'danger', label: 'High Severity' },
  }

  const Section = ({ id, title, icon: Icon, children }) => (
    <div className="border-b border-slate-700/50 last:border-0">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-medium text-slate-200 text-sm">{title}</span>
        </div>
        {expandedSection === id
          ? <ChevronUp className="w-4 h-4 text-slate-500" />
          : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Crop Doctor"
        subtitle="AI-powered plant disease detection and treatment advice"
        breadcrumbs={['Home', 'Crop Doctor']}
      />

      <Alert type="info">
        Upload a clear photo of the affected plant part (leaf, stem, fruit). Best results with good lighting and close-up shots.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Upload Plant Image
            </h3>

            {!preview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'}`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">
                  {isDragActive ? 'Drop image here...' : 'Drag photo or click to browse'}
                </p>
                <p className="text-xs text-slate-600 mt-1">JPG, PNG, WEBP • Max 10MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Plant"
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  onClick={reset}
                  className="absolute top-2 right-2 bg-slate-900/80 text-slate-300 hover:text-white p-1.5 rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {image && !result && (
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
                ) : (
                  <><Leaf className="w-4 h-4" /> Analyze Disease</>
                )}
              </button>
            )}

            {analyzing && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-slate-400 text-center">AI is examining your plant image...</p>
                <ProgressBar value={75} color="primary" />
              </div>
            )}
          </Card>

          {/* Tips */}
          <Card className="bg-primary/5 border-primary/10">
            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Tips for Best Results
            </h4>
            <ul className="space-y-2">
              {[
                'Take photo in daylight, avoid shadows',
                'Focus on the most affected area',
                'Include both healthy and diseased parts',
                'Avoid blurry or dark images',
                'Multiple angles help improve accuracy',
              ].map((tip, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Results Panel */}
        <div>
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center py-16 text-center">
              <Leaf className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-slate-500 font-medium">No analysis yet</p>
              <p className="text-xs text-slate-600 mt-1">Upload a plant photo to detect diseases</p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              {/* Result Header */}
              <div className="p-5 border-b border-slate-700/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-100">{result.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Detected in: {result.crop}</p>
                  </div>
                  <Badge variant={SEVERITY_CONFIG[result.severity]?.color || 'warning'}>
                    {SEVERITY_CONFIG[result.severity]?.label}
                  </Badge>
                </div>

                {/* Confidence */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">AI Confidence</span>
                    <span className="text-primary font-bold">{result.confidence}%</span>
                  </div>
                  <ProgressBar value={result.confidence} color="primary" />
                </div>

                <p className="text-sm text-slate-300 mt-4 leading-relaxed">{result.description}</p>
              </div>

              {/* Accordion Sections */}
              <Section id="symptoms" title="Symptoms Identified" icon={AlertTriangle}>
                <ul className="space-y-1.5">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="treatment" title="Recommended Treatment" icon={CheckCircle}>
                <ol className="space-y-2">
                  {result.treatment.map((t, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
              </Section>

              <Section id="prevention" title="Prevention Measures" icon={Leaf}>
                <ul className="space-y-1.5">
                  {result.prevention.map((p, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="organic" title="Organic Alternatives" icon={Leaf}>
                <ul className="space-y-1.5">
                  {result.organic.map((o, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-lg">🌿</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="p-4">
                <button onClick={reset} className="btn-secondary w-full text-sm">
                  Analyze Another Image
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
