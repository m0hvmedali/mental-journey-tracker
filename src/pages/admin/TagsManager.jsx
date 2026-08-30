// src/pages/admin/TagsManager.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import { Tags, Plus, Edit, Trash2, Hash } from 'lucide-react';

export default function TagsManager() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'framework'
  });

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await adminContentService.getTagsList();
      setTags(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const openAddModal = () => {
    setEditingTag(null);
    setFormData({ name: '', slug: '', category: 'framework' });
    setShowModal(true);
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      category: tag.category || 'framework'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTag) {
        await adminContentService.updateTag(editingTag.id, formData);
      } else {
        await adminContentService.createTag(formData);
      }
      setShowModal(false);
      loadTags();
    } catch (err) {
      alert('فشل حفظ الوسم.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوسم "${name}"؟`)) return;
    try {
      await adminContentService.deleteTag(id);
      setTags(tags.filter(t => t.id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  return (
    <AdminLayout
      title="إدارة الوسوم والتصنيفات (Taxonomy)"
      subtitle="تنظيم التصنيفات الإكلينيكية، المهارات، والمفاهيم النفسية عبر التطبيق"
      actionButton={
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة وسم جديد</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-elevated border-b border-border-subtle text-text-secondary font-semibold">
                <tr>
                  <th className="p-4">اسم الوسم</th>
                  <th className="p-4">المعرف (Slug)</th>
                  <th className="p-4">فئة التصنيف</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-text-muted">جاري تحميل الوسوم...</td>
                  </tr>
                ) : tags.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-text-muted">لا توجد وسوم مسجلة بعد.</td>
                  </tr>
                ) : (
                  tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-surface-hover/60 transition-colors">
                      <td className="p-4 font-bold text-text-primary flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-teal-600" />
                        <span>{tag.name}</span>
                      </td>
                      <td className="p-4 font-mono text-text-muted">{tag.slug}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated text-text-secondary text-[11px] font-medium border border-border-subtle">
                          {tag.category || 'عام'}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id, tag.name)}
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
          <div className="bg-surface max-w-md w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display font-bold text-base text-text-primary">
                {editingTag ? 'تعديل الوسم' : 'إضافة وسم جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">اسم الوسم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: علاج معرفي سلوكي"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">المعرف (Slug)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="cbt"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">فئة التصنيف (Category)</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                >
                  <option value="framework">إطار علاجي (Framework)</option>
                  <option value="concept">مفهوم معرفي (Concept)</option>
                  <option value="skill">مهارة سلوكية (Skill)</option>
                  <option value="practice">ممارسة وتأمل (Practice)</option>
                  <option value="general">عام (General)</option>
                </select>
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
                  {editingTag ? 'تحديث الوسم' : 'حفظ الوسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
