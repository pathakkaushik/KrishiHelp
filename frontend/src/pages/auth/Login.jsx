import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { login, reset } from '../../store/slices/authSlice.jsx'
import toast from 'react-hot-toast'

const ROLE_REDIRECT = {
  FARMER: '/dashboard',
  OFFICER: '/officer/dashboard',
  ADMIN: '/admin/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading } = useSelector(state => state.auth)

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      dispatch(reset())
      const user = result.payload.user
      const redirect = location.state?.from?.pathname || ROLE_REDIRECT[user.role] || '/dashboard'
      toast.success(`Welcome back, ${user.fullName?.split(' ')[0]}!`)
      navigate(redirect, { replace: true })
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  // Demo login
  const demoLogin = (role) => {
    const demos = {
      farmer: { email: 'farmer@demo.com', password: 'Demo@123' },
      officer: { email: 'officer@demo.com', password: 'Demo@123' },
      admin: { email: 'admin@demo.com', password: 'Demo@123' },
    }
    handleSubmit(onSubmit)(demos[role])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-100">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-1">Sign in to your KrishiMitra account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">Email or Mobile</label>
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-400">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
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

        <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {/* Demo Logins */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-700/50" />
          <span className="text-xs text-slate-500">Try Demo</span>
          <div className="flex-1 border-t border-slate-700/50" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['farmer', 'officer', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => demoLogin(role)}
              className="btn-secondary py-2 px-3 text-xs capitalize"
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-400">
        New to KrishiMitra?{' '}
        <Link to="/register" className="text-primary hover:text-primary-400 font-medium">
          Create account
        </Link>
      </p>
    </motion.div>
  )
}
