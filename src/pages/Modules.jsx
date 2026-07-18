// src/pages/Modules.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MODULE_DATA } from './ModuleDetail.jsx';

export default function Modules() {
  const [query, setQuery] = useState('');

  const filtered = MODULE_DATA.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const sections = {
    'Core Modules': filtered.filter((m) => m.id <= 3),
    'Advanced Modules': filtered.filter((m) => m.id > 3),
  };

  return (
    <div className="flex flex-col min-h-screen themed-bg font-sans">
      <header className="flex justify-between items-center p-4 pb-2">
        <button onClick={() => window.history.back()} className="flex size-12 shrink-0 items-center themed-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
            <path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/>
          </svg>
        </button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold themed-text">Modules</h2>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="flex h-12 w-full themed-bg-subtle rounded-xl overflow-hidden">
          <span className="flex items-center pl-3 themed-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72Z"/>
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules"
            className="flex-1 bg-transparent outline-none px-3 themed-text placeholder:themed-text-muted"
          />
        </div>
      </div>

      {/* Sections */}
      {Object.entries(sections).map(([title, items]) => (
        items.length ? (
          <ModuleSection key={title} title={title} items={items} />
        ) : null
      ))}
    </div>
  );
}

function ModuleSection({ title, items }) {
  return (
    <div className="pb-7">
      <h3 className="themed-text text-xl font-bold px-4 pt-5 pb-3">{title}</h3>
      <div className="px-4 flex flex-col gap-6">
        {items.map((m) => (
          <Link key={m.slug} to={`/modules/${m.slug}`} className="flex gap-4 items-stretch">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="themed-text-secondary text-sm">{title.slice(0, title.indexOf(' '))}</p>
              <p className="themed-text font-bold leading-tight">{m.title}</p>
              <p className="themed-text-muted text-sm leading-normal">{m.tagline}</p>
            </div>
            <div className="flex-1 bg-center bg-cover rounded-xl aspect-video" style={{ backgroundImage: `url(${m.hero})` }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
