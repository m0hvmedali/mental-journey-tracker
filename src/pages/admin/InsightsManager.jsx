// src/pages/admin/InsightsManager.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import { Sparkles, Plus, Trash2, Heart, Award } from 'lucide-react';

export default function InsightsManager() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    insight_text: '',
    author_or_source: '',
    topic: 'CBT',
    evidence_level: 'clinical',
    is_featured: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminContentService.getInsightsList();
      setInsights(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminContentService.createInsight(formData);
      setShowModal(false);
      setFormData({
        insight_text: '',
        author_or_source: '',
        topic: 'CBT',
        evidence_level: 'clinical',
        is_featured: true
      });
      loadData();
    } catch (err) {
      alert('فشل إضافة الكبسولة.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await adminContentService.deleteInsight(id);
      setInsights(insights.filter(i => i.id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  return (
    <AdminLayout
      title="الكبسولات المعرفية والمشاعر"
      subtitle="إدارة الجرعات المعرفية السريعة وقاعدة بيانات موسوعة المشاعر"
      actionButton={
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة كبسولة معرفية</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 p-16 text-center text-xs text-text-muted">جاري التحميل...</div>
          ) : insights.length === 0 ? (
            <div className="col-span-2 p-16 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border-subtle">
              لا توجد كبسولات مسجلة.
            </div>
          ) : (
            insights.map((item) => (
              <div
                key={item.id}
                className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-bold">
                      {item.topic}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-text-muted hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-text-primary leading-relaxed">
                    "{item.insight_text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                  <span>المصدر: {item.author_or_source || 'مرجع إكلينيكي'}</span>
                  <span className="font-mono text-[10px] uppercase">{item.evidence_level}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display font-bold text-base text-text-primary">إضافة كبسولة معرفية جديدة</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">نص الكبسولة / البصيرة</label>
                <textarea
                  rows={3}
                  required
                  value={formData.insight_text}
                  onChange={(e) => setFormData({ ...formData, insight_text: e.target.value })}
                  placeholder="الفكرة ليست حقيقة، بل فرضية يضعها العقل..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">المؤلف أو المرجع</label>
                <input
                  type="text"
                  value={formData.author_or_source}
                  onChange={(e) => setFormData({ ...formData, author_or_source: e.target.value })}
                  placeholder="Aaron Beck"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">الموضوع</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  >
                    <option value="CBT">CBT</option>
                    <option value="DBT">DBT</option>
                    <option value="ACT">ACT</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">مستوى الدليل</label>
                  <select
                    value={formData.evidence_level}
                    onChange={(e) => setFormData({ ...formData, evidence_level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  >
                    <option value="clinical">Clinical Practice</option>
                    <option value="empirical">Empirical Study</option>
                    <option value="theory">Theoretical Model</option>
                  </select>
                </div>
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
                  حفظ الكبسولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
