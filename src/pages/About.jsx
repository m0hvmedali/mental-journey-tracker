// App.jsx
import React from 'react';
import {
 ArrowLeft,
 ChartLine,
 Users,
 House,
 QuoteIcon,
 UserCog,
 BriefcaseMedical,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function Feature({ Icon, title, description }) {
 return (
 <div className="flex items-center gap-4 bg-bg-surface-elevated px-4 py-2 min-h-[72px]">
 <div className="bg-slate-200 dark:bg-slate-800 rounded-lg p-3 flex-shrink-0">
 <Icon size={24} weight="regular" className="text-text-primary" />
 </div>
 <div className="flex flex-col justify-center">
 <p className="text-text-primary text-base font-medium">{title}</p>
 <p className="text-text-secondary text-sm">{description}</p>
 </div>
 </div>
 );
}


function ContactItem({ Icon, text }) {
 return (
 <div className="flex gap-4 items-center px-4 py-2 bg-bg-surface-elevated min-h-14">
 <div className="bg-slate-200 dark:bg-slate-800 rounded-lg p-3 flex-shrink-0">
 <Icon size={24} weight="regular" className="text-text-primary" />
 </div>
 <p className="text-text-primary text-base truncate flex-1">{text}</p>
 </div>
 );
}

export default function App() {
 const nav = useNavigate();

 return (
 <div
 className="flex flex-col justify-between min-h-screen bg-bg-surface-elevated"
 style={{ fontFamily: 'Manrope,"Noto Sans", sans-serif' }}
 >
 <div>
 {/* Header */}
 <div className="flex justify-between items-center p-4 pb-2">
 <button onClick={() => nav(-1)} className="text-text-primary">
 <ArrowLeft size={24} />
 </button>
 <h2 className="flex-1 text-center pr-12 text-lg font-bold text-text-primary">
 About Us
 </h2>
 </div>

 {/* Intro */}
 <h3 className="text-2xl font-bold text-text-primary text-center px-4 pt-5 pb-2">
 Empowering your journey to mental wellness
 </h3>
 <p className="text-base text-text-muted px-4 pt-1 pb-3">
 This project is designed to help you continually develop. (We always recommend visiting a specialist.) </p>

 {/* Key Features */}
 <h3 className="text-lg font-bold text-text-primary px-4 pt-4 pb-2">
 Key Features
 </h3>
 <Feature
 Icon={ArrowLeft}
 title="Customized Programs"
 description="Personalized therapy plans tailored to your needs."
 />
 <Feature
 Icon={ChartLine}
 title="Progress Tracking"
 description="Track your progress and celebrate your achievements."
 />
 <Feature
 Icon={Users}
 title="Community Support"
 description="Connect with a supportive community of users."
 />

 {/* Team */}
 <h3 className="text-lg font-bold text-text-primary px-4 pt-4 pb-2">
 Our Team
 </h3>
 <Feature
 Icon={UserCog}
 title="Mohamed Aly"
 description="Lead Developer"
 />


 {/* Contact */}

 </div>

 {/* Footer nav */}
 
 </div>
 );
}
