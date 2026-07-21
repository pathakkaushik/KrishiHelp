import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import { register as registerAction } from '../../store/slices/authSlice.jsx'
import toast from 'react-hot-toast'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector(state => state.auth)

  const onSubmit = async (data) => {
    const payload = { ...data, role: 'FARMER' }
    const result = await dispatch(registerAction(payload))
    if (registerAction.fulfilled.match(result)) {
      toast.success('Account created! Please verify your OTP.')
      navigate('/verify-otp', { state: { userId: result.payload.userId } })
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  const nextStep = async () => {
    const fields = step === 1 ? ['fullName', 'email', 'mobile'] : ['password', 'village', 'district']
    const valid = await trigger(fields)
    if (valid) setStep(2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-100">Create account</h2>
        <p className="text-sm text-slate-400 mt-1">Join KrishiMitra — free for all farmers</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        {[1, 2].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-slate-700'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Min 3 characters' } })}
                  placeholder="Ramesh Kumar"
                  className="input-field pl-10"
                />
              </div>
              {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('mobile', {
                    required: 'Mobile is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian mobile number' }
                  })}
                  placeholder="98XXXXXXXX"
                  className="input-field pl-10"
                  maxLength={10}
                />
              </div>
              {errors.mobile && <p className="text-xs text-danger mt-1">{errors.mobile.message}</p>}
            </div>

            <button type="button" onClick={nextStep} className="btn-primary w-full flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase and number'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Village</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('village', { required: 'Village is required' })}
                  placeholder="Your village name"
                  className="input-field pl-10"
                />
              </div>
              {errors.village && <p className="text-xs text-danger mt-1">{errors.village.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">District</label>
                <input
                  {...register('district', { required: 'Required' })}
                  placeholder="District"
                  className="input-field"
                />
                {errors.district && <p className="text-xs text-danger mt-1">{errors.district.message}</p>}
              </div>
              <div>
                <label className="label">State</label>
                <input
                  {...register('state', { required: 'Required' })}
                  placeholder="State"
                  className="input-field"
                />
                {errors.state && <p className="text-xs text-danger mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                Back
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-400 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
