import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService.js'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError(null)
    const trimmedIdentifier = identifier.trim()
    const trimmedPassword = password.trim()

    if (!trimmedIdentifier || !trimmedPassword) {
      setError('يرجى كتابة الاسم (أو البريد) وكلمة المرور للمتابعة')
      return
    }
    
    setLoading(true)
    try {
      if (isLogin) {
        await authService.signIn(trimmedIdentifier, trimmedPassword)
      } else {
        await authService.signUp(trimmedIdentifier, trimmedPassword)
      }
      
      navigate('/home')
    } catch (err) {
      console.error('Auth error:', err)
      if (err.message?.includes('Invalid login credentials')) {
        setError('بيانات الدخول غير صحيحة، يرجى التأكد من الاسم وكلمة المرور.')
      } else if (err.message?.includes('User already registered')) {
        setError('هذا الحساب مسجل بالفعل، يمكنك تسجيل الدخول مباشرة.')
      } else if (err.message?.includes('Email not confirmed') || err.message?.includes('email not confirmed')) {
        setError('البريد الإلكتروني غير مؤكد بعد. تم تفعيل الدخول المباشر لجهازك.')
        // Fallback to local session
        const actualName = trimmedIdentifier.includes('@') ? trimmedIdentifier.split('@')[0] : trimmedIdentifier
        localStorage.setItem('username', actualName)
        navigate('/home')
        return
      } else if (err.message?.includes('rate limit') || err.message?.includes('Too Many Requests') || err.status === 429) {
        setError('تم تجاوز حد طلبات الخادم المؤقت. تم تسجيل دخولك محلياً للمتابعة.')
        const actualName = trimmedIdentifier.includes('@') ? trimmedIdentifier.split('@')[0] : trimmedIdentifier
        localStorage.setItem('username', actualName)
        navigate('/home')
        return
      } else {
        setError(err.message || 'حدث خطأ أثناء المصادقة')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-screen bg-bg-app text-text-primary p-4 transition-colors">
      <div className="w-full max-w-md bg-bg-surface rounded-sm shadow-sm border border-border-medium p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="size-16 rounded-sm bg-transparent flex items-center justify-center mx-auto shrink-0 overflow-hidden">
            <img 
              src="/ChatGPT_Image_Jul_19_2025_06_34_59_PM.svg" 
              alt="Site Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
              مرحباً بك
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {isLogin ? 'سجل دخولك بالاسم أو البريد للمتابعة' : 'أنشئ حساباً باسمك وابدأ رحلتك الآن'}
            </p>
          </div>
          <div className="w-12 h-1 bg-accent-primary mx-auto rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-sm text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="identifier" className="block text-xs font-bold text-text-primary">
              الاسم أو البريد الإلكتروني
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="مثلاً: أحمد أو ahmed@example.com"
              className="w-full px-4 py-3 bg-bg-app border border-border-subtle rounded-sm text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-text-primary">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اكتب كلمة المرور"
              className="w-full px-4 py-3 bg-bg-app border border-border-subtle rounded-sm text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-primary hover:bg-accent-hover text-white py-3 rounded-sm font-bold text-sm transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
            }}
            className="text-xs text-text-muted hover:text-accent-primary transition-colors"
          >
            {isLogin ? 'لا تملك حساباً؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  )
}

