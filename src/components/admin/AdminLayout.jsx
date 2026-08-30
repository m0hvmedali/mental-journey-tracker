// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderKanban,
  Image as ImageIcon,
  BookOpen,
  Tags,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  Home
} from 'lucide-react';
import { authService } from '@/services/authService';

export default function AdminLayout({ children, title, subtitle, actionButton }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
    { to: '/admin/content', label: 'إدارة المحتوى', icon: FileText },
    { to: '/admin/content/new', label: 'محتوى جديد', icon: PlusCircle },
    { to: '/admin/modules', label: 'المسارات والدروس', icon: FolderKanban },
    { to: '/admin/media', label: 'مكتبة الوسائط', icon: ImageIcon },
    { to: '/admin/references', label: 'المراجع العلمية', icon: BookOpen },
    { to: '/admin/tags', label: 'الوسوم والتصنيفات', icon: Tags },
    { to: '/admin/insights', label: 'الكبسولات والمشاعر', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-bg-app text-text-primary flex flex-col md:flex-row antialiased" dir="rtl">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border-subtle sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl bg-surface-elevated text-text-secondary hover:text-text-primary"
            aria-label="القائمة"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              CMS
            </div>
            <span className="font-display font-bold text-base text-text-primary">استوديو المحتوى</span>
          </div>
        </div>

        <Link
          to="/home"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          التطبيق
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-30 h-screen w-64 bg-surface border-l border-border-subtle flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                CMS
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-text-primary tracking-tight">استوديو المحتوى</h2>
                <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>بوابة المشرف العلمي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-subtle bg-surface-elevated/40 space-y-2">
          <Link
            to="/home"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-border-subtle bg-surface hover:bg-surface-hover text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>معاينة واجهة المستخدم</span>
            <ExternalLink className="w-3 h-3 text-text-muted" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        {/* Page Header */}
        <header className="bg-surface/80 backdrop-blur border-b border-border-subtle px-6 py-5 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">{title}</h1>
              {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
            {actionButton && <div className="flex items-center gap-3">{actionButton}</div>}
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}
