// src/pages/admin/ContentVersions.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import { History, ArrowRight, RotateCcw, Check, Clock, User } from 'lucide-react';

export default function ContentVersions() {
  const { id } = useParams();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await adminContentService.getContentVersions(id);
      setVersions(data || []);
      if (data && data.length > 0) {
        setSelectedVersion(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadVersions();
  }, [id]);

  const handleRestore = async (versionNumber) => {
    if (!window.confirm(`هل أنت متأكد من استعادة النسخة رقم (${versionNumber})؟`)) return;
    try {
      await adminContentService.restoreVersion(id, versionNumber);
      alert('تمت استعادة النسخة بنجاح!');
      loadVersions();
    } catch (err) {
      alert('فشل استعادة النسخة.');
    }
  };

  return (
    <AdminLayout
      title="سجل النسخ والتدقيق (Audit & Versions)"
      subtitle="استعراض ومقارنة التعديلات السابقة واستعادة أي إصدار تاريخي"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Versions List */}
          <div className="lg:col-span-5 bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
            <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600" />
              النسخ المحفوظة ({versions.length})
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-text-muted">جاري تحميل النسخ...</div>
              ) : versions.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted">لا توجد نسخ سابقة محفوظة.</div>
              ) : (
                versions.map((v) => (
                  <button
                    key={v.id || v.version_number}
                    onClick={() => setSelectedVersion(v)}
                    className={`w-full text-right p-3.5 rounded-xl border text-xs transition-colors block ${
                      selectedVersion?.version_number === v.version_number
                        ? 'bg-teal-500/10 border-teal-500/30 text-teal-900 dark:text-teal-200'
                        : 'bg-surface-elevated/40 border-border-subtle hover:bg-surface-elevated text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">الإصدار #{v.version_number}</span>
                      <span className="text-[11px] text-text-muted">
                        {new Date(v.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <div className="text-xs text-text-primary font-medium mt-1">
                      {v.change_summary || 'تحديث دوري للمحتوى'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Version Snapshot Detail View */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-border-subtle p-6 space-y-4">
            {selectedVersion ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div>
                    <h4 className="font-bold text-base text-text-primary">
                      {selectedVersion.title || selectedVersion.title_snapshot || selectedVersion.snapshot_data?.title || 'لقطة النسخة'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                      <span>إصدار #{selectedVersion.version_number}</span>
                      <span>•</span>
                      <span>{new Date(selectedVersion.created_at).toLocaleString('ar-EG')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestore(selectedVersion.version_number)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة هذا الإصدار</span>
                  </button>
                </div>

                {/* Markdown Snapshot */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">محتوى النص (Markdown Snapshot)</label>
                  <pre className="p-4 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
                    {selectedVersion.markdown_content || selectedVersion.markdown_snapshot || selectedVersion.snapshot_data?.markdown_content || '(فارغ)'}
                  </pre>
                </div>

                {/* Blocks Count */}
                <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border-subtle flex items-center justify-between text-xs">
                  <span className="font-bold text-text-primary">الكتل المضمنة في هذه النسخة:</span>
                  <span className="font-mono text-teal-600 font-bold">
                    {(selectedVersion.blocks_snapshot || selectedVersion.blocks || selectedVersion.snapshot_data?.blocks || []).length} كتل
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-xs text-text-muted">
                اختر إصداراً من القائمة الجانبية لعرض تفاصيله واستعادته.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
