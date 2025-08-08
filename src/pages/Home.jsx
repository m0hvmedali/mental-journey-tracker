// src/pages/Home.jsx
import { useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('username')
    if (!userData) {
      navigate('/')
    }
  }, []) 
  
  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#f8fcfa] overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Top bar */}
      <header className="flex justify-between items-center p-4 pb-2">
        <h2 className="flex-1 text-center pl-12 text-lg font-bold tracking-tight text-[#0e1b15]">Home</h2>
        <NavLink
  to="/setting"
  className={({ isActive }) =>
    `flex w-12 items-center justify-end ${
      isActive ? 'text-[#0e1b15]' : 'text-[#4e9778]'
    }`
  }
>
  <Settings className="w-5 h-5" />
</NavLink>

      </header>
 
      
      {/* hero banner */}
      <section className="px-4 py-3"><div className="w-full min-h-[218px] bg-center bg-cover rounded-xl" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC552S5olc1-Kh6YCQFknyrQamVFeeVSJDl1uHH9xhZqYk0Zgu0733uY9-Y8d2k5NAkW8CpwfJEBYtxF0Z4ZBPWLikIs5LuBC7kMYr4v_NqgyImqWuYu1xb2Vr2AiNhmDNaZcXga1CT-GIgrrXhH21FUNn50uSy9aO-l1fyrEbaFQnEzlBzzCkVEwAwcK165CZrNDeXrAbXoXslU1O90OmwQ3UABJxbKE60MhoBshAaAGoe9ihQmWVAPIFTplwa_xLnKkHTl6uCIcsU)' }} /></section>

      <h3 className="text-2xl font-bold leading-tight text-center px-4 pt-5 pb-2 text-[#0e1b15]">Mindful Growth</h3>
      <p className="text-base font-normal leading-normal text-center px-4 pt-1 pb-3 text-[#0e1b15]">Welcome back, Continue your journey towards a healthier you.</p>

      <div className="flex justify-center mb-6"><div className="flex flex-col gap-3 max-w-[480px] w-full px-4">
        <NavLink to="/wheel" className="flex h-10 items-center justify-center rounded-xl bg-[#30e898] text-[#0e1b15] text-sm font-bold">Interactive Wheel of Feelings</NavLink>
        <NavLink to="/diary" className="flex h-10 items-center justify-center rounded-xl bg-[#e7f3ee] text-[#0e1b15] text-sm font-bold">Diary Entry</NavLink>
      </div></div>
    </div>
  );
}
