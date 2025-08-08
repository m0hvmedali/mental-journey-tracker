import { HeartPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginByName() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('username')) {
      navigate('/home')
    }
  }, [navigate])

  const handleLogin = () => {
    const trimmed = username.trim()
    if (!trimmed) {
      alert('اكتب اسمك يا نجم ✍️')
      return
    }
  
    // حفظ الاسم كسلسلة نصية عادية (بدون JSON)
    localStorage.setItem('username', trimmed)
    navigate('/home')
  }

  return (


    <div className="flex flex-col items-center justify-center pb-40 bg-gradient-to-br from-[#f8f5ff] to-[#eef2ff] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e0d6ff] p-4 mt-30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4a2c82] mb-2 font-serif">Hello < HeartPlus/> </h1>
          <p className="text-[#6b7280]">Pls Login To Continue</p>
          <div className="w-16 h-1 bg-[#7e5bef] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#4a2c82] mb-1">
              Just your name
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثلاً: أحمد"
              className="w-full px-4 py-3 border border-[#e0d6ff] rounded-xl focus:ring-2 focus:ring-[#7e5bef] focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#7e5bef] to-[#5b6bef] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}