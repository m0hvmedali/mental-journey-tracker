import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODULES_DATA } from '@/data/modulesData.js';
import { ArrowLeft, Search } from 'lucide-react';

export default function Modules() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = MODULES_DATA.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.tagline.toLowerCase().includes(query.toLowerCase()) ||
    m.pages.some((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-app font-sans pb-24 transition-colors">
      <header className="flex justify-between items-center px-4 sm:px-8 py-6 border-b-2 border-text-primary bg-bg-app sticky top-0 z-20">
        <button 
          onClick={() => navigate('/')} 
          className="flex size-10 shrink-0 items-center justify-center border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-app transition-colors"
          aria-label="Go home"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-2xl font-display font-bold text-text-primary tracking-tight">المكتبة العلاجية</h2>
        <div className="size-10 shrink-0" />
      </header>

      {/* Editorial Search Bar */}
      <div className="px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full">
        <div className="flex border-b-2 border-text-primary items-center pb-2 focus-within:border-accent-primary transition-colors">
          <Search size={24} className="text-text-primary shrink-0 mr-4 ml-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المواضيع النفسية..."
            className="flex-1 bg-transparent outline-none text-xl font-display text-text-primary placeholder:text-text-muted/60 placeholder:font-sans"
            dir="auto"
          />
        </div>
      </div>

      {/* Modules Editorial Layout */}
      <div className="px-4 sm:px-8 py-2 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-12 sm:gap-16">
          {filtered.map((m, index) => (
            <article 
              key={m.slug} 
              className="group flex flex-col md:flex-row gap-6 md:gap-10 border-b border-border-medium pb-12 last:border-b-0"
              dir="auto"
            >
              {/* Image Treatment - Sharp & Monochromatic Hint */}
              <div className="w-full md:w-1/3 aspect-[4/3] relative shrink-0">
                <div className="absolute inset-0 bg-text-primary translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                <div
                  className="absolute inset-0 bg-center bg-cover border border-text-primary grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: `url(${m.hero})` }}
                />
              </div>
              
              {/* Typography / Copy Treatment */}
              <div className="flex flex-col flex-1 pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm font-bold text-text-secondary uppercase tracking-widest border border-border-subtle px-2 py-1">
                    الوحدة {String(m.id).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-accent-palm">
                    {m.pages.length} مواضيع
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight mb-4 group-hover:text-accent-primary transition-colors">
                  {m.title}
                </h3>
                
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-serif-display mb-8">
                  {m.tagline}
                </p>
                
                <Link 
                  to={`/modules/${m.slug}`}
                  className="mt-auto inline-flex items-center gap-2 text-text-primary font-bold font-display border-b-2 border-text-primary pb-1 self-start hover:text-accent-primary hover:border-accent-primary transition-colors"
                >
                  <span>قراءة الوحدة</span>
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                </Link>
              </div>
            </article>
          ))}
          
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-text-muted font-bold">لم يتم العثور على نتائج تطابق "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
