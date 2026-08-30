// src/pages/admin/ContentManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Square
} from 'lucide-react';

export default function ContentManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const statusFilter = searchParams.get('status') || 'all';
  const typeFilter = searchParams.get('type') || 'all';
  const langFilter = searchParams.get('lang') || 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await adminContentService.getContentList({
        status: statusFilter,
        contentType: typeFilter,
        language: langFilter,
        search: searchQuery,
        page,
        limit: 20
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load content list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [statusFilter, typeFilter, langFilter, page]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchContent();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusFilterChange = (status) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (status === 'all') newParams.delete('status');
    else newParams.set('status', status);
    setSearchParams(newParams);
  };

  const handleTypeFilterChange = (type) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (type === 'all') newParams.delete('type');
    else newParams.set('type', type);
    setSearchParams(newParams);
  };

  const handleQuickStatusToggle = async (item) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await adminContentService.updateContentStatus(item.id, nextStatus);
      setItems(items.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
    } catch (err) {
      alert('فشل تغيير الحالة.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    try {
      await adminContentService.deleteContent(id);
      setItems(items.filter(i => i.id !== id));
      setTotal(t => Math.max(0, t - 1));
    } catch (err) {
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => adminContentService.updateContentStatus(id, newStatus)));
      setSelectedIds([]);
      fetchContent();
    } catch (err) {
      alert('حدث خطأ أثناء التحديث الجماعي.');
    } finally {
      setActionLoading(false);
    }
  };

  const contentTypeLabels = {
    scientific_page: 'صفحة علمية متكاملة',
    article: 'مقال علمي',
    lesson: 'درس ضمن مسار',
    exercise: 'تمرين علاجي',
    insight: 'كبسولة معرفية',
    about: 'عن المنصة',
    reference: 'مرجع ودراسة'
  };

  return (
    <AdminLayout
      title="إدارة المحتوى العلمي"
      subtitle={`إجمالي العناصر: ${total} سجل | تصفية وإدارة الكتل والمقالات`}
      actionButton={
        <Link
          to="/admin/content/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء محتوى جديد</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، المعرف (slug)، أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-xl border border-border-subtle overflow-x-auto text-xs shrink-0">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'published', label: 'منشور' },
              { id: 'draft', label: 'مسودة' },
              { id: 'archived', label: 'مؤرشف' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStatusFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-surface text-teal-700 dark:text-teal-300 shadow-xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Type Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
              aria-label="نوع المحتوى"
              className="px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">كافة الأنواع</option>
              <option value="scientific_page">صفحة علمية (Scientific Page)</option>
              <option value="article">مقال (Article)</option>
              <option value="lesson">درس (Lesson)</option>
              <option value="exercise">تمرين (Exercise)</option>
              <option value="insight">كبسولة (Insight)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-teal-800 dark:text-teal-200">
              تم تحديد {selectedIds.length} عنصر
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('published')}
                disabled={actionLoading}
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
              >
                نشر المحدد
              </button>
              <button
                onClick={() => handleBulkStatusChange('draft')}
                disabled={actionLoading}
                className="px-3 py-1 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700"
              >
                تحويل لمسودة
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 text-text-secondary hover:text-text-primary"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}

        {/* Content Table */}
        <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-elevated border-b border-border-subtle text-text-secondary font-semibold">
                <tr>
                  <th className="p-4 w-10">
                    <button onClick={toggleSelectAll} className="text-text-muted hover:text-text-primary">
                      {selectedIds.length > 0 && selectedIds.length === items.length ? (
                        <CheckSquare className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">العنوان والمعرف</th>
                  <th className="p-4">النوع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الكتل</th>
                  <th className="p-4">الوسوم</th>
                  <th className="p-4">تاريخ التحديث</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-text-muted">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                      جاري تحميل عناصر المحتوى...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-text-muted">
                      لا يوجد محتوى يطابق خيارات التصفية الحالية.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-surface-hover/60 transition-colors ${
                          isSelected ? 'bg-teal-500/5' : ''
                        }`}
                      >
                        <td className="p-4">
                          <button onClick={() => toggleSelectOne(item.id)} className="text-text-muted hover:text-text-primary">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="p-4 min-w-[220px]">
                          <Link
                            to={`/admin/content/${item.slug}`}
                            className="font-bold text-text-primary hover:text-teal-600 transition-colors block text-sm"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[11px] text-text-muted bg-surface-elevated px-1.5 py-0.5 rounded">
                              /{item.slug}
                            </span>
                            <span className="text-[10px] text-text-muted uppercase">
                              [{item.language}]
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-1 rounded-md bg-surface-elevated text-text-secondary text-[11px] font-medium whitespace-nowrap">
                            {contentTypeLabels[item.content_type] || item.content_type}
                          </span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleQuickStatusToggle(item)}
                            title="انقر لتغيير الحالة السريعة"
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full flex items-center gap-1.5 transition-colors ${
                              item.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                : item.status === 'draft'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                                : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-500/20'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{item.status === 'published' ? 'منشور' : item.status === 'draft' ? 'مسودة' : 'مؤرشف'}</span>
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 text-text-muted">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{item.blocksCount || 0}</span>
                          </div>
                        </td>

                        <td className="p-4 max-w-[160px]">
                          <div className="flex flex-wrap gap-1">
                            {(item.tags || []).slice(0, 2).map((tag) => (
                              <span key={tag.id || tag.slug} className="px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary text-[10px]">
                                {tag.name}
                              </span>
                            ))}
                            {(item.tags || []).length > 2 && (
                              <span className="text-[10px] text-text-muted">+{item.tags.length - 2}</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-text-muted whitespace-nowrap">
                          {new Date(item.updated_at).toLocaleDateString('ar-EG')}
                        </td>

                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/c/${item.slug}`}
                              target="_blank"
                              title="معاينة حية في التطبيق"
                              className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/admin/content/${item.slug}`}
                              title="تحرير المحتوى والكتل"
                              className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              title="حذف"
                              className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-surface-elevated/40 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-muted">
                الصفحة {page} من {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-border-subtle bg-surface text-text-secondary disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-border-subtle bg-surface text-text-secondary disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
