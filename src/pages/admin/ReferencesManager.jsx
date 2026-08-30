// src/pages/admin/ReferencesManager.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  BookmarkCheck,
  Filter
} from 'lucide-react';

export default function ReferencesManager() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRef, setEditingRef] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    publication: '',
    url: '',
    doi: '',
    category: 'CBT'
  });

  const loadReferences = async () => {
    try {
      setLoading(true);
      const data = await adminContentService.getReferencesList({
        search,
        category: categoryFilter
      });
      setReferences(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferences();
  }, [categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(loadReferences, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAddModal = () => {
    setEditingRef(null);
    setFormData({
      title: '',
      authors: '',
      year: new Date().getFullYear(),
      publication: '',
      url: '',
      doi: '',
      category: 'CBT'
    });
    setShowModal(true);
  };

  const openEditModal = (ref) => {
    setEditingRef(ref);
    setFormData({
      title: ref.title || '',
      authors: ref.authors || '',
      year: ref.year || new Date().getFullYear(),
      publication: ref.publication || '',
      url: ref.url || '',
      doi: ref.doi || '',
      category: ref.category || 'CBT'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRef) {
        await adminContentService.updateReference(editingRef.id, formData);
      } else {
        await adminContentService.createReference(formData);
      }
      setShowModal(false);
      loadReferences();
    } catch (err) {
      alert('فشل حفظ المرجع.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف المرجع "${title}"؟`)) return;
    try {
      await adminContentService.deleteReference(id);
      setReferences(references.filter(r => r.id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  return (
    <AdminLayout
      title="المراجع والدراسات العلمية"
      subtitle="إدارة قائمة الدراسات الأكاديمية، الكتب، ومصادر الأدلة الإكلينيكية المحكمة"
      actionButton={
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مرجع علمي</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="البحث في المراجع بالعنوان، المؤلف، أو جهة النشر..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-border-subtle text-xs shrink-0">
            {['all', 'CBT', 'DBT', 'ACT', 'Neurobiology', 'General'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-surface text-teal-600 shadow-xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* References Table */}
        <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-elevated border-b border-border-subtle text-text-secondary font-semibold">
                <tr>
                  <th className="p-4">عنوان الدراسة / الكتاب</th>
                  <th className="p-4">المؤلفون</th>
                  <th className="p-4">السنة</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">جهة النشر / DOI</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-muted">جاري تحميل المراجع...</td>
                  </tr>
                ) : references.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-muted">لا توجد مراجع مسجلة.</td>
                  </tr>
                ) : (
                  references.map((ref) => (
                    <tr key={ref.id} className="hover:bg-surface-hover/60 transition-colors">
                      <td className="p-4 font-bold text-text-primary max-w-sm">
                        {ref.title}
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mr-2 text-[11px] text-teal-600 hover:underline font-normal"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>رابط</span>
                          </a>
                        )}
                      </td>
                      <td className="p-4 text-text-secondary max-w-xs truncate">{ref.authors || '—'}</td>
                      <td className="p-4 font-mono">{ref.year || '—'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-bold">
                          {ref.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-text-muted text-[11px]">
                        <div>{ref.publication || '—'}</div>
                        {ref.doi && <div className="font-mono text-[10px] text-text-muted mt-0.5">DOI: {ref.doi}</div>}
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(ref)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ref.id, ref.title)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display font-bold text-base text-text-primary">
                {editingRef ? 'تعديل المرجع العلمي' : 'إضافة مرجع علمي جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">عنوان الدراسة أو الكتاب</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Cognitive Therapy of Depression..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">المؤلفون</label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    placeholder="Beck, A. T., et al."
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">سنة النشر</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">جهة النشر / الدورية</label>
                  <input
                    type="text"
                    value={formData.publication}
                    onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                    placeholder="Guilford Press / Journal of Clinical Psychology"
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">التصنيف الإكلينيكي</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  >
                    <option value="CBT">CBT (معرفي سلوكي)</option>
                    <option value="DBT">DBT (جدلي سلوكي)</option>
                    <option value="ACT">ACT (قبول والتزام)</option>
                    <option value="Neurobiology">Neurobiology (علوم الأعصاب)</option>
                    <option value="General">General (عام)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">رابط المصدر (URL)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">معرف الكائن الرقمي (DOI)</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  placeholder="10.1002/1097-4679..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
                >
                  {editingRef ? 'تحديث المرجع' : 'حفظ المرجع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
