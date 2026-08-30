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
  ArrowRight,
  Search,
  FileText,
  Sparkles,
  ExternalLink,
  Check,
  Tag
} from 'lucide-react';

export default function ModulesManager() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
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
  const [moduleContentList, setModuleContentList] = useState([]);
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [contentLoading, setContentLoading] = useState(false);

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

  const openModuleContentModal = async (mod) => {
    setSelectedModule(mod);
    setContentSearchQuery('');
    setContentTypeFilter('all');
    setShowContentModal(true);
    try {
      setContentLoading(true);
      const items = await adminContentService.getModuleContent(mod.id);
      setModuleContentList(items || []);
    } catch (err) {
      console.error('Failed to load module content:', err);
      setModuleContentList(mod.module_content || []);
    } finally {
      setContentLoading(false);
    }
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

  // Lessons handlers
  const handleAddLessonToModule = (contentId) => {
    if (!contentId) return;
    const contentItem = allContent.find(c => c.id === contentId);
    if (!contentItem) return;

    if (lessonsList.some(l => l.content_id === contentId)) {
      alert('هذا الدرس مضاف بالفعل للمسار.');
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

  // Module CMS Content handlers
  const handleAddContentToModule = async (contentId) => {
    if (!selectedModule || !contentId) return;
    try {
      await adminContentService.addContentToModule(selectedModule.id, contentId);
      const updated = await adminContentService.getModuleContent(selectedModule.id);
      setModuleContentList(updated || []);
      loadData();
    } catch (err) {
      console.error('handleAddContentToModule error:', err);
      alert(`فشل ربط الصفحة بالمسار: ${err?.message || 'خطأ غير معروف'}`);
    }
  };

  const handleRemoveContentFromModule = async (contentId) => {
    if (!selectedModule || !contentId) return;
    try {
      await adminContentService.removeContentFromModule(selectedModule.id, contentId);
      setModuleContentList(prev => prev.filter(item => (item.content_id || item.content?.id) !== contentId));
      loadData();
    } catch (err) {
      console.error('handleRemoveContentFromModule error:', err);
      alert(`فشل إزالة الصفحة من المسار: ${err?.message || 'خطأ غير معروف'}`);
    }
  };

  const handleMoveModuleContent = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= moduleContentList.length) return;
    const updated = [...moduleContentList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setModuleContentList(updated);

    try {
      await adminContentService.updateModuleContentOrder(selectedModule.id, updated);
      loadData();
    } catch (err) {
      console.error('Failed to update content order:', err);
    }
  };

  // Content Filtering for Search
  const filteredCMSContent = allContent.filter(item => {
    const matchesSearch = !contentSearchQuery.trim() ||
      item.title?.toLowerCase().includes(contentSearchQuery.toLowerCase()) ||
      item.slug?.toLowerCase().includes(contentSearchQuery.toLowerCase());

    const matchesType = contentTypeFilter === 'all' || item.content_type === contentTypeFilter;
    return matchesSearch && matchesType;
  });

  const isContentInModule = (contentId) => {
    return moduleContentList.some(item => (item.content_id || item.content?.id) === contentId);
  };

  const getContentTypeLabel = (type) => {
    const map = {
      scientific_page: 'صفحة علمية',
      article: 'مقال تخصصي',
      lesson: 'درس منهجي',
      guide: 'دليل عملي',
      exercise: 'تمرين علاجي',
      worksheet: 'ورقة عمل'
    };
    return map[type] || type || 'محتوى';
  };

  return (
    <AdminLayout
      title="المسارات والبرامج التعليمية"
      subtitle="هيكلة المناهج النفسية، ربط صفحات ومقالات الـ CMS بالوحدات التخصصية، وترتيب الدروس"
      actionButton={
        <button
          id="btn-create-module"
          onClick={openAddModuleModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
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
                id={`module-card-${mod.id}`}
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

                  {/* Dual Content Blocks: Core Lessons + Module CMS Content */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Lessons Preview */}
                    <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border-subtle space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-text-secondary font-bold">
                          <span className="flex items-center gap-1.5">
                            <ListOrdered className="w-3.5 h-3.5 text-teal-600" />
                            الدروس ({mod.lessons?.length || 0})
                          </span>
                        </div>

                        <div className="space-y-1">
                          {(mod.lessons || []).slice(0, 2).map((l, i) => (
                            <div key={l.id || i} className="flex items-center gap-1.5 text-xs text-text-primary">
                              <span className="w-3.5 h-3.5 rounded-full bg-teal-600/10 text-teal-600 text-[9px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="truncate">{l.content?.title || 'درس علمي'}</span>
                            </div>
                          ))}
                          {(mod.lessons || []).length === 0 && (
                            <div className="text-[11px] text-text-muted">لا توجد دروس</div>
                          )}
                          {(mod.lessons || []).length > 2 && (
                            <div className="text-[10px] text-text-muted">
                              +{mod.lessons.length - 2} دروس أخرى
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => openLessonsManagerModal(mod)}
                        className="w-full mt-2 py-1 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-semibold hover:bg-teal-100 transition-colors text-center cursor-pointer"
                      >
                        إدارة الدروس
                      </button>
                    </div>

                    {/* Module CMS Content Preview */}
                    <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border-subtle space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-text-secondary font-bold">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            محتوى CMS ({mod.module_content?.length || 0})
                          </span>
                        </div>

                        <div className="space-y-1">
                          {(mod.module_content || []).slice(0, 2).map((mc, i) => (
                            <div key={mc.id || i} className="flex items-center gap-1.5 text-xs text-text-primary">
                              <span className="w-3.5 h-3.5 rounded-full bg-indigo-600/10 text-indigo-600 text-[9px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="truncate">{mc.content?.title || 'صفحة محتوى'}</span>
                            </div>
                          ))}
                          {(mod.module_content || []).length === 0 && (
                            <div className="text-[11px] text-text-muted">لا يوجد محتوى CMS إضافي</div>
                          )}
                          {(mod.module_content || []).length > 2 && (
                            <div className="text-[10px] text-text-muted">
                              +{mod.module_content.length - 2} صفحات أخرى
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        id={`btn-manage-cms-content-${mod.id}`}
                        onClick={() => openModuleContentModal(mod)}
                        className="w-full mt-2 py-1 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold hover:bg-indigo-100 transition-colors text-center cursor-pointer"
                      >
                        + إدارة محتوى CMS
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-open-module-content-main-${mod.id}`}
                      onClick={() => openModuleContentModal(mod)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>محتوى CMS للوحدة</span>
                    </button>

                    <button
                      onClick={() => openLessonsManagerModal(mod)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-500/20 transition-colors cursor-pointer"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>الدروس المنهجية</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      id={`btn-edit-module-${mod.id}`}
                      onClick={() => openEditModuleModal(mod)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-teal-600 hover:bg-surface-elevated cursor-pointer"
                      title="تعديل بيانات المسار"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-delete-module-${mod.id}`}
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                      title="حذف المسار"
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
              <button onClick={() => setShowModuleModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">✕</button>
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
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
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
                <p className="text-xs text-text-secondary mt-0.5">إضافة الدروس المنهجية وتسلسل التعلم المتتابع</p>
              </div>
              <button onClick={() => setShowLessonsModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">✕</button>
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
                <option value="" disabled>اختر صفحة علمية أو درساً لإضافته كدرس منهجي...</option>
                {allContent.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({getContentTypeLabel(item.content_type)})
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
                      className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveLesson(idx, 1)}
                      disabled={idx === lessonsList.length - 1}
                      className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(idx)}
                      className="p-1 text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {lessonsList.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-xl">
                  لا توجد دروس منهجية مضافة لهذا المسار حتى الآن.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowLessonsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveLessons}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                حفظ ترتيب الدروس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module CMS Content Manager Modal */}
      {showContentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-3xl w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-5 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-text-primary">
                    محتوى وقراءات المسار: {selectedModule?.title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  ربط صفحات ومقالات الـ CMS لتظهر كمحتوى تخصصي إضافي داخل هذه الوحدة (دون تكرار المحتوى).
                </p>
              </div>
              <button onClick={() => setShowContentModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer text-lg font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Section 1: Linked Content in Module */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                    <span>الصفحات المرتبطة حالياً بهذا المسار</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[11px] font-bold">
                      {moduleContentList.length}
                    </span>
                  </h4>
                  <span className="text-[11px] text-text-muted">
                    ترتيب العرض مستقل لكل وحدة
                  </span>
                </div>

                {contentLoading ? (
                  <div className="p-8 text-center text-xs text-text-muted">جاري تحميل المحتوى...</div>
                ) : moduleContentList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-2xl bg-surface-elevated/40">
                    لا يوجد محتوى CMS مرتبط بهذه الوحدة حتى الآن. اختر من القائمة أدناه لإضافة صفحات.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {moduleContentList.map((item, idx) => {
                      const content = item.content || {};
                      const contentId = item.content_id || content.id;
                      const isPublished = content.status === 'published';

                      return (
                        <div
                          key={item.id || contentId || idx}
                          id={`module-content-row-${contentId}`}
                          className="p-3.5 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-indigo-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-text-primary truncate">
                                  {content.title || 'صفحة محتوى'}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                                  isPublished ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {isPublished ? 'منشور' : 'مسودة'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-surface-base text-text-muted text-[10px] font-medium shrink-0">
                                  {getContentTypeLabel(content.content_type)}
                                </span>
                              </div>
                              <div className="text-[11px] text-text-muted font-mono truncate mt-0.5">
                                /c/{content.slug || ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveModuleContent(idx, -1)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-base disabled:opacity-25 cursor-pointer"
                              title="تحريك لأعلى"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveModuleContent(idx, 1)}
                              disabled={idx === moduleContentList.length - 1}
                              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-base disabled:opacity-25 cursor-pointer"
                              title="تحريك لأسفل"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveContentFromModule(contentId)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                              title="إزالة من الوحدة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Add Content from CMS */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>إضافة صفحات ومقالات من نظام CMS للوحدة</span>
                  </h4>
                </div>

                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 relative">
                    <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-text-muted" />
                    <input
                      type="text"
                      value={contentSearchQuery}
                      onChange={(e) => setContentSearchQuery(e.target.value)}
                      placeholder="ابحث في عناوين ومسارات صفحات الـ CMS..."
                      className="w-full pr-9 pl-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary placeholder:text-text-muted"
                    />
                  </div>

                  <div>
                    <select
                      value={contentTypeFilter}
                      onChange={(e) => setContentTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                    >
                      <option value="all">كل الأنواع</option>
                      <option value="scientific_page">صفحة علمية</option>
                      <option value="article">مقال تخصصي</option>
                      <option value="lesson">درس</option>
                      <option value="guide">دليل إرشادي</option>
                      <option value="exercise">تمرين</option>
                    </select>
                  </div>
                </div>

                {/* Available CMS Content List */}
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {filteredCMSContent.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted">
                      لم يتم العثور على صفحات مطابقة للبحث.
                    </div>
                  ) : (
                    filteredCMSContent.map((item) => {
                      const alreadyAdded = isContentInModule(item.id);
                      const isPublished = item.status === 'published';

                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                            alreadyAdded
                              ? 'bg-surface-elevated/40 border-border-subtle/50 opacity-75'
                              : 'bg-surface border-border-subtle hover:border-teal-500/40 hover:bg-surface-elevated'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className={`w-4 h-4 shrink-0 ${alreadyAdded ? 'text-indigo-600' : 'text-text-muted'}`} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-text-primary truncate">
                                  {item.title}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${
                                  isPublished ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {isPublished ? 'منشور' : 'مسودة'}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted text-[9px] font-medium shrink-0">
                                  {getContentTypeLabel(item.content_type)}
                                </span>
                              </div>
                              <div className="text-[10px] text-text-muted font-mono truncate">
                                /c/{item.slug}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {alreadyAdded ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveContentFromModule(item.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                title="اضغط للإزالة من الوحدة"
                              >
                                <Check className="w-3 h-3 text-indigo-600" />
                                <span>مُضاف للوحدة</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddContentToModule(item.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+ إضافة للوحدة</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-border-subtle shrink-0">
              <span className="text-[11px] text-text-muted">
                يتم حفظ الروابط والترتيب تلقائياً وتنعكس على صفحة الوحدة العامة فوراً.
              </span>
              <button
                type="button"
                onClick={() => setShowContentModal(false)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                تم والعودة
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

