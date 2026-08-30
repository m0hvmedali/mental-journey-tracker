// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import { INTERACTIVE_COMPONENTS } from '@/components/interactive/InteractiveRegistry';
import {
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  FolderKanban,
  Image as ImageIcon,
  BookOpen,
  Tags,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const data = await adminContentService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const interactiveKeys = Object.keys(INTERACTIVE_COMPONENTS);

  return (
    <AdminLayout
      title="لوحة التحكم الرئيسية"
      subtitle="نظرة عامة على دورة حياة المحتوى، المقاييس، ومحرك الصفحات التفاعلية"
      actionButton={
        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border-subtle hover:bg-surface-hover text-text-secondary transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>
          <Link
            to="/admin/content/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء محتوى جديد</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-secondary">إجمالي الصفحات والمقالات</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">
              {loading ? '...' : stats?.total || 0}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
              <span>{stats?.published || 0} منشور</span>
              <span>•</span>
              <span>{stats?.draft || 0} مسودة</span>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-secondary">المسارات والبرامج</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">
              {loading ? '...' : stats?.modulesCount || 0}
            </div>
            <div className="text-xs text-text-muted mt-2">
              مسارات إكلينيكية منظمة
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-secondary">المراجع العلمية</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">
              {loading ? '...' : stats?.referencesCount || 0}
            </div>
            <div className="text-xs text-text-muted mt-2">
              دراسات ومراجع محكمة
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-secondary">أصول الوسائط والمكتبة</span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">
              {loading ? '...' : stats?.mediaCount || 0}
            </div>
            <div className="text-xs text-text-muted mt-2">
              صور وملفات صوتية
            </div>
          </div>
        </div>

        {/* Content Lifecycle Distribution */}
        <div className="bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display text-text-primary">حالة نشر المحتوى العلمي</h2>
              <p className="text-xs text-text-secondary mt-0.5">توزيع المحتوى وفق مراحل دورة الاعتماد العلمي</p>
            </div>
            <Link to="/admin/content" className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
              <span>عرض كل المحتوى</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-text-secondary">منشور ومتاح للمستخدمين</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.published || 0}</div>
                </div>
              </div>
              <Link to="/admin/content?status=published" className="p-1 text-emerald-600 hover:text-emerald-700">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-text-secondary">مسودات قيد الإعداد والمراجعة</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats?.draft || 0}</div>
                </div>
              </div>
              <Link to="/admin/content?status=draft" className="p-1 text-amber-600 hover:text-amber-700">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-neutral-500/5 border border-neutral-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-500/10 text-neutral-600 flex items-center justify-center">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-text-secondary">محتوى مؤرشف</div>
                  <div className="text-xl font-bold text-neutral-600 dark:text-neutral-400">{stats?.archived || 0}</div>
                </div>
              </div>
              <Link to="/admin/content?status=archived" className="p-1 text-neutral-600 hover:text-neutral-700">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2 Columns: Recent Activity + Interactive Component Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Content */}
          <div className="lg:col-span-7 bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-text-primary">آخر التحديثات على المحتوى</h2>
              <Link to="/admin/content" className="text-xs text-text-secondary hover:text-text-primary">
                عرض الكل
              </Link>
            </div>

            <div className="divide-y divide-border-subtle">
              {loading ? (
                <div className="py-8 text-center text-xs text-text-muted">جاري تحميل السجلات...</div>
              ) : (stats?.recentActivity || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted">لا يوجد محتوى بعد.</div>
              ) : (
                stats.recentActivity.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-text-primary truncate">{item.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span className="font-mono text-[11px] bg-surface-elevated px-1.5 py-0.5 rounded">{item.slug}</span>
                        <span>•</span>
                        <span>{item.content_type}</span>
                        <span>•</span>
                        <span>{new Date(item.updated_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                          item.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                      <Link
                        to={`/admin/content/${item.slug}`}
                        className="px-3 py-1 text-xs rounded-lg bg-surface-elevated hover:bg-teal-500/10 hover:text-teal-600 font-medium transition-colors"
                      >
                        تحرير
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Components Whitelist Registry Status */}
          <div className="lg:col-span-5 bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold font-display text-text-primary">محرك الأدوات التفاعلية</h2>
                <p className="text-xs text-text-secondary">العناصر البرمجية المعتمدة في InteractiveRegistry</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {interactiveKeys.map((key) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-surface-elevated/60 border border-border-subtle/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <code className="font-mono text-text-primary text-[11px] font-bold">{key}</code>
                  </div>
                  <span className="text-text-muted text-[11px]">مفعل وآمن</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-teal-500/5 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 leading-relaxed">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                معيار الأمان الصارم:
              </div>
              يتم استدعاء المكونات عبر Whitelist مغلق ولا يتم تشغيل أي JavaScript عشوائي من قاعدة البيانات.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
