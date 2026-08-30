// src/pages/admin/ModulesManager.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  ListOrdered,
  CheckCircle2,
  Clock,
  Layers,
  ChevronUp,
  ChevronDown,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function ModulesManager() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [moduleForm, setModuleForm] = useState({
    title: '',
    slug: '',
    description: '',
    order_index: 1,
    background_image: '/article-by3DYy7JylaR.webp',
    status: 'published'
  });

  const [lessonsList, setLessonsList] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [modulesData, contentRes] = await Promise.all([
        adminContentService.getModulesList(),
        adminContentService.getContentList({ limit: 100 })
      ]);
      setModules(modulesData || []);
      setAllContent(contentRes.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModuleModal = () => {
    setSelectedModule(null);
    setModuleForm({
      title: '',
      slug: '',
      description: '',
      order_index: modules.length + 1,
      background_image: '/article-by3DYy7JylaR.webp',
      status: 'published'
    });
    setShowModuleModal(true);
  };

  const openEditModuleModal = (mod) => {
    setSelectedModule(mod);
    setModuleForm({
      title: mod.title,
      slug: mod.slug,
      description: mod.description || '',
      order_index: mod.order_index || 1,
      background_image: mod.background_image || '',
      status: mod.status || 'published'
    });
    setShowModuleModal(true);
  };

  const openLessonsManagerModal = (mod) => {
    setSelectedModule(mod);
    setLessonsList(mod.lessons || []);
    setShowLessonsModal(true);
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedModule) {
        await adminContentService.updateModule(selectedModule.id, moduleForm);
      } else {
        await adminContentService.createModule(moduleForm);
      }
      setShowModuleModal(false);
      loadData();
    } catch (err) {
      alert('فشل حفظ المسار.');
    }
  };

  const handleDeleteModule = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف مسار "${title}"؟`)) return;
    try {
      await adminContentService.deleteModule(id);
      setModules(modules.filter(m => m.id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  const handleAddLessonToModule = (contentId) => {
    if (!contentId) return;
    const contentItem = allContent.find(c => c.id === contentId);
    if (!contentItem) return;

    if (lessonsList.some(l => l.content_id === contentId)) {
      alert('هذا المحتوى مضاف بالفعل للمسار.');
      return;
    }

    const nextOrder = lessonsList.length + 1;
    const newLesson = {
      content_id: contentId,
      section_name: 'القسم الرئيسي',
      order_index: nextOrder,
      content: contentItem
    };
    setLessonsList([...lessonsList, newLesson]);
  };

  const handleRemoveLesson = (index) => {
    const updated = lessonsList.filter((_, i) => i !== index);
    setLessonsList(updated);
  };

  const handleMoveLesson = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= lessonsList.length) return;
    const updated = [...lessonsList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setLessonsList(updated);
  };

  const handleSaveLessons = async () => {
    try {
      await adminContentService.updateModuleLessons(selectedModule.id, lessonsList);
      alert('تم حفظ ترتيب الدروس بنجاح!');
      setShowLessonsModal(false);
      loadData();
    } catch (err) {
      alert('فشل حفظ دروس المسار.');
    }
  };

  return (
    <AdminLayout
      title="المسارات والبرامج التعليمية"
      subtitle="هيكلة المناهج النفسية، ترتيب الدروس، وربط الصفحات العلمية بالمسارات"
      actionButton={
        <button
          onClick={openAddModuleModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء مسار جديد</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 p-16 text-center text-xs text-text-muted">جاري تحميل المسارات...</div>
          ) : modules.length === 0 ? (
            <div className="col-span-2 p-16 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border-subtle">
              لا توجد مسارات تعليمية بعد.
            </div>
          ) : (
            modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-surface rounded-2xl border border-border-subtle p-6 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-text-primary">{mod.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                          <span className="font-mono text-[11px]">/{mod.slug}</span>
                          <span>•</span>
                          <span>ترتيب: #{mod.order_index}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-600">
                      {mod.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </div>

                  {mod.description && (
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {mod.description}
                    </p>
                  )}

                  {/* Lessons Preview */}
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border-subtle space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-secondary font-bold">
                      <span>الدروس المربوطة ({mod.lessons?.length || 0})</span>
                      <button
                        onClick={() => openLessonsManagerModal(mod)}
                        className="text-teal-600 hover:text-teal-700 font-semibold"
                      >
                        تنظيم الدروس
                      </button>
                    </div>

                    <div className="space-y-1">
                      {(mod.lessons || []).slice(0, 3).map((l, i) => (
                        <div key={l.id || i} className="flex items-center gap-2 text-xs text-text-primary">
                          <span className="w-4 h-4 rounded-full bg-teal-600/10 text-teal-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{l.content?.title || 'درس علمي'}</span>
                        </div>
                      ))}
                      {(mod.lessons || []).length > 3 && (
                        <div className="text-[11px] text-text-muted pr-6">
                          +{mod.lessons.length - 3} دروس إضافية
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <button
                    onClick={() => openLessonsManagerModal(mod)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-500/20 transition-colors"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>إدارة الدروس والترتيب</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModuleModal(mod)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Module Add/Edit Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display font-bold text-base text-text-primary">
                {selectedModule ? 'تعديل المسار التعليمي' : 'إنشاء مسار تعليمي جديد'}
              </h3>
              <button onClick={() => setShowModuleModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">اسم المسار</label>
                <input
                  type="text"
                  required
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="مسار تنظيم المشاعر..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">المعرف (Slug)</label>
                  <input
                    type="text"
                    required
                    value={moduleForm.slug}
                    onChange={(e) => setModuleForm({ ...moduleForm, slug: e.target.value })}
                    placeholder="emotional-regulation"
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">رقم الترتيب</label>
                  <input
                    type="number"
                    value={moduleForm.order_index}
                    onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">الوصف العام</label>
                <textarea
                  rows={3}
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="وصف البرنامج التعليمي والأهداف الإكلينيكية..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
                >
                  حفظ المسار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Lessons Ordering Modal */}
      {showLessonsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-2xl w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-5" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-text-primary">
                  تنظيم دروس مسار: {selectedModule?.title}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">إضافة صفحات المحتوى وترتيب تسلسل التعلم</p>
              </div>
              <button onClick={() => setShowLessonsModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            {/* Quick Add Dropdown */}
            <div className="flex items-center gap-2">
              <select
                id="lessonSelect"
                aria-label="اختيار محتوى لإضافته للمسار"
                className="flex-1 px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddLessonToModule(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="" disabled>اختر صفحة علمية أو درساً لإضافته للمسار...</option>
                {allContent.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.content_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Ordered Lessons List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {lessonsList.map((lesson, idx) => (
                <div
                  key={lesson.id || lesson.content_id || idx}
                  className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-text-primary truncate">
                        {lesson.content?.title || 'درس علمي'}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono truncate">
                        /{lesson.content?.slug || ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveLesson(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveLesson(idx, 1)}
                      disabled={idx === lessonsList.length - 1}
                      className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(idx)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {lessonsList.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-xl">
                  لا توجد دروس في هذا المسار. اختر من القائمة أعلاه لإضافة دروس.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowLessonsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveLessons}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
              >
                حفظ ترتيب الدروس
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
