import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, Command } from 'lucide-react';
import { generateSearchIndex } from '../../data/searchIndex';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Build search index on mount
    setSearchIndex(generateSearchIndex());
    
    // Focus input automatically
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Intelligent search logic
    const matched = searchIndex.filter(item => {
      // 1. Direct title match
      if (item.title && item.title.toLowerCase().includes(lowerQuery)) return true;
      // 2. Direct description match
      if (item.description && item.description.toLowerCase().includes(lowerQuery)) return true;
      
      // 3. Keyword match
      if (item.keywords && Array.isArray(item.keywords)) {
        return item.keywords.some(k => k && k.toLowerCase().includes(lowerQuery));
      }
      return false;
    });

    // Remove duplicates by path, prioritizing the main pages over sections
    const uniquePaths = new Map();
    matched.forEach(item => {
      if (!uniquePaths.has(item.path)) {
        uniquePaths.set(item.path, item);
      } else {
        // If it's a section but we already have the main page, keep the main page unless the section is a much stronger match
        const existing = uniquePaths.get(item.path);
        if (existing.id.startsWith('page') && item.id.startsWith('section')) {
          // keep existing
        } else if (existing.id.startsWith('section') && item.id.startsWith('page')) {
          uniquePaths.set(item.path, item); // swap to page
        }
      }
    });

    // Limit to top 15 results
    setResults(Array.from(uniquePaths.values()).slice(0, 15));
  }, [query, searchIndex]);

  const handleResultClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-bg-app/95 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      {/* Header / Search Input */}
      <div className="p-4 border-b border-border-subtle bg-bg-surface flex items-center gap-3">
        <button 
          onClick={onClose}
          className="p-2 rounded-xl bg-bg-surface-hover hover:bg-bg-surface-elevated text-text-muted hover:text-text-primary transition-all shrink-0"
        >
          <X size={20} />
        </button>
        
        <div className="flex-1 relative flex items-center">
          <Search size={18} className="absolute right-3 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أداة، درس، تمرين، شعور..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-bg-surface-hover border border-border-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-text-primary placeholder:text-text-muted text-sm sm:text-base outline-none transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute left-3 p-1 text-text-muted hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted space-y-4">
            <Command size={48} className="opacity-20" />
            <p className="text-sm font-medium">ابدأ البحث في مكتبة المهارات والأدوات التفاعلية</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-emerald-600 mb-4 px-1">
              تم العثور على {results.length} نتائج
            </p>
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.path)}
                className="w-full text-right flex items-center gap-4 p-4 rounded-2xl bg-bg-surface border border-border-subtle hover:border-emerald-400/50 hover:shadow-md transition-all group"
              >
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Search size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-text-primary truncate">
                    {result.title}
                  </h4>
                  {result.description && (
                    <p className="text-xs sm:text-sm text-text-muted truncate mt-0.5">
                      {result.description}
                    </p>
                  )}
                  <p className="text-[10px] text-emerald-600/80 mt-1 font-mono flex items-center gap-1">
                    <span className="opacity-50">مسار:</span> {result.path}
                  </p>
                </div>
                <ChevronLeft size={20} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1 shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted space-y-3 text-center">
            <p className="text-sm sm:text-base font-medium text-text-primary">لم يتم العثور على نتائج لـ "{query}"</p>
            <p className="text-xs">جرب البحث بكلمات مختلفة مثل: "قلق"، "تفكير"، "تنفس"</p>
          </div>
        )}
      </div>
    </div>
  );
}
