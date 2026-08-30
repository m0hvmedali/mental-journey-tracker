// src/pages/admin/ContentEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import { INTERACTIVE_COMPONENTS } from '@/components/interactive/InteractiveRegistry';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import {
  Save,
  ArrowRight,
  Eye,
  Edit3,
  Layers,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  Quote,
  AlertCircle,
  FileCode,
  BookOpen,
  Tags,
  CheckCircle2,
  Clock,
  History,
  Smartphone,
  Monitor,
  ExternalLink,
  Code,
  RotateCcw,
  Languages
} from 'lucide-react';

export default function ContentEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'blocks', 'meta', 'references', 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [changeSummary, setChangeSummary] = useState('');

  // Available options
  const [availableTags, setAvailableTags] = useState([]);
  const [availableRefs, setAvailableRefs] = useState([]);

  // Content Form State
  const [formData, setFormData] = useState({
    id: null,
    translation_group_id: '',
    slug: '',
    language: 'ar',
    title: '',
    description: '',
    content_type: 'scientific_page',
    status: 'draft',
    markdown_content: '',
    plain_text: '',
    css: '',
    featured_image: '',
    seo_title: '',
    seo_description: '',
    metadata: {
      framework: 'CBT',
      reading_time_minutes: 5,
      difficulty: 'متوسط',
      author: 'فريق التحرير العلمي'
    }
  });

  const [blocks, setBlocks] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedRefIds, setSelectedRefIds] = useState([]);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [tagsData, refsData] = await Promise.all([
          adminContentService.getTagsList(),
          adminContentService.getReferencesList()
        ]);
        setAvailableTags(tagsData || []);
        setAvailableRefs(refsData || []);

        if (!isNew) {
          const item = await adminContentService.getContentItem(slug, true);
          if (item) {
            setFormData({
              id: item.id,
              translation_group_id: item.translation_group_id || '',
              slug: item.slug,
              language: item.language || 'ar',
              title: item.title || '',
              description: item.description || '',
              content_type: item.content_type || 'article',
              status: item.status || 'draft',
              markdown_content: item.markdown_content || '',
              plain_text: item.plain_text || '',
              css: item.css || '',
              featured_image: item.featured_image || '',
              seo_title: item.seo_title || '',
              seo_description: item.seo_description || '',
              metadata: {
                framework: item.metadata?.framework || 'CBT',
                reading_time_minutes: item.metadata?.reading_time_minutes || 5,
                difficulty: item.metadata?.difficulty || 'متوسط',
                author: item.metadata?.author || 'فريق التحرير العلمي'
              }
            });
            setBlocks(item.blocks || []);
            setSelectedTagIds(item.tags?.map(t => t.id) || []);
            setSelectedRefIds(item.references?.map(r => r.id) || []);

            const vers = await adminContentService.getContentVersions(item.id);
            setVersions(vers || []);
          }
        } else {
          // Initialize empty new item with template block
          setFormData(prev => ({
            ...prev,
            slug: '',
            title: 'عنوان المقال الجديد',
            markdown_content: `# مقدمة المقال\n\nاكتب المحتوى العلمي هنا بتنسيق Markdown...`,
          }));
          setBlocks([
            {
              id: crypto.randomUUID(),
              block_type: 'markdown',
              position: 1,
              payload: { content: '### تمرين عملي أو تفاعلي\nيمكنك إضافة تفاصيل الخطوات هنا.' },
              metadata: {}
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load content editor data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, isNew]);

  // Slug generator from title
  const generateSlugFromTitle = () => {
    if (!formData.title) return;
    const clean = formData.title
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0621-\u064A-]+/g, '');
    setFormData(prev => ({ ...prev, slug: clean }));
  };

  // Block management functions
  const addBlock = (type) => {
    const nextPos = blocks.length + 1;
    let newBlock = {
      id: crypto.randomUUID(),
      block_type: type,
      position: nextPos,
      payload: {},
      metadata: {}
    };

    if (type === 'markdown') {
      newBlock.payload = { content: '### قسم جديد\nاكتب النص التوضيحي هنا...' };
    } else if (type === 'interactive_component') {
      newBlock.payload = {
        component: 'thought-record-wizard',
        props: { initialDistortion: 'allOrNothing', mode: 'guided' }
      };
      newBlock.metadata = { title: 'أداة تفاعلية موجهة' };
    } else if (type === 'image') {
      newBlock.payload = {
        url: '/article-by3DYy7JylaR.webp',
        alt: 'صورة توضيحية',
        caption: 'وصف الصورة أو الرسم البياني'
      };
    } else if (type === 'quote') {
      newBlock.payload = {
        quote: 'اقتباس إكلينيكي ملهم أو ركيزة علاجية...',
        author: 'اسم العالم أو المصدر'
      };
    } else if (type === 'callout') {
      newBlock.payload = {
        type: 'note',
        title: 'ملاحظة إكلينيكية',
        message: 'معلومة هامة للممارس أو المستفيد...'
      };
    }

    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, position: i + 1 }));
    setBlocks(updated);
  };

  const moveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const reordered = updated.map((b, i) => ({ ...b, position: i + 1 }));
    setBlocks(reordered);
  };

  const updateBlockPayload = (index, payloadKey, value) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      payload: { ...updated[index].payload, [payloadKey]: value }
    };
    setBlocks(updated);
  };

  const updateBlockMetadata = (index, metaKey, value) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      metadata: { ...updated[index].metadata, [metaKey]: value }
    };
    setBlocks(updated);
  };

  // Save content
  const handleSave = async (statusOverride = null) => {
    if (!formData.title) {
      alert('يرجى إدخال عنوان المحتوى.');
      return;
    }
    if (!formData.slug) {
      generateSlugFromTitle();
    }

    const payload = {
      ...formData,
      status: statusOverride || formData.status
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await adminContentService.createContent(
          payload,
          blocks,
          selectedTagIds,
          selectedRefIds
        );
        alert('تم إنشاء المحتوى بنجاح!');
        navigate(`/admin/content/${created.slug}`);
      } else {
        await adminContentService.updateContent(
          formData.id,
          payload,
          blocks,
          selectedTagIds,
          selectedRefIds,
          changeSummary || 'تحديث المحتوى والكتل'
        );
        alert('تم حفظ التعديلات وإنشاء نسخة جديدة في السجل!');
        const vers = await adminContentService.getContentVersions(formData.id);
        setVersions(vers || []);
        setChangeSummary('');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المحتوى.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreVersion = async (versionNumber) => {
    if (!window.confirm(`هل أنت متأكد من استعادة النسخة رقم (${versionNumber})؟ سيتم تطبيقها كمسودة جديدة دون فقدان السجل السابق.`)) return;
    try {
      setSaving(true);
      await adminContentService.restoreVersion(formData.id, versionNumber);
      alert('تمت استعادة النسخة بنجاح!');
      setShowVersionModal(false);
      window.location.reload();
    } catch (err) {
      alert('فشل استعادة النسخة.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="محرر المحتوى">
        <div className="p-16 text-center text-text-muted">جاري تحميل المحتوى والكتل...</div>
      </AdminLayout>
    );
  }

  const interactiveKeys = Object.keys(INTERACTIVE_COMPONENTS);

  return (
    <AdminLayout
      title={isNew ? 'إنشاء محتوى علمي جديد' : `تحرير: ${formData.title}`}
      subtitle={`المعرف: /${formData.slug || 'untitled'} | الحالة: ${formData.status === 'published' ? 'منشور' : 'مسودة'}`}
      actionButton={
        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              onClick={() => setShowVersionModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border-subtle hover:bg-surface-hover text-text-secondary transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>سجل النسخ ({versions.length})</span>
            </button>
          )}

          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-text-primary transition-colors disabled:opacity-50"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>حفظ كمسودة</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'جاري الحفظ...' : 'نشر وتحديث'}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs for Editor Panels */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border-subtle">
            {[
              { id: 'editor', label: 'المحرر والكتل', icon: Edit3 },
              { id: 'meta', label: 'البيانات والميتاداتا', icon: FileCode },
              { id: 'references', label: 'المراجع والوسوم', icon: BookOpen },
              { id: 'preview', label: 'معاينة حية', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {!isNew && (
            <Link
              to={`/c/${formData.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold"
            >
              <span>فتح الرابط العام</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* TAB 1: Editor & Blocks */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Markdown Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Title & Slug Quick Header */}
              <div className="bg-surface p-5 rounded-2xl border border-border-subtle space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">عنوان المحتوى</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: دليل التشوهات المعرفية وإعادة الهيكلة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-base font-bold text-text-primary focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">المعرف البرمجي (Slug)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="thinking-errors"
                        className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary focus:border-teal-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={generateSlugFromTitle}
                        className="px-2.5 py-1.5 rounded-xl bg-surface-elevated border border-border-subtle hover:bg-surface-hover text-[11px] text-text-secondary"
                      >
                        توليد
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">نوع المحتوى</label>
                    <select
                      value={formData.content_type}
                      onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="scientific_page">صفحة علمية (Scientific Page)</option>
                      <option value="article">مقال إكلينيكي (Article)</option>
                      <option value="lesson">درس ضمن مسار (Lesson)</option>
                      <option value="exercise">تمرين تفاعلي (Exercise)</option>
                      <option value="insight">كبسولة معرفية (Insight)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">الملخص والوصف الإكلينيكي</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف موجز للمحتوى يظهر في البطاقات ومحركات البحث..."
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Markdown Core Textarea */}
              <div className="bg-surface p-5 rounded-2xl border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-teal-600" />
                    المتن الأساسي (Markdown)
                  </span>
                  <span className="text-[11px] text-text-muted">يدعم الترويسات والقوائم والاقتباسات</span>
                </div>

                <textarea
                  rows={14}
                  value={formData.markdown_content}
                  onChange={(e) => setFormData({ ...formData, markdown_content: e.target.value })}
                  placeholder="# عنوان رئيسي\n\nنص المقال العلمي..."
                  className="w-full p-4 rounded-xl bg-surface-elevated border border-border-subtle font-mono text-xs text-text-primary leading-relaxed focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Content Blocks Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface p-5 rounded-2xl border border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold font-display text-text-primary">الكتل الإضافية والتفاعلية</h3>
                  </div>
                  <span className="text-[11px] text-text-muted">{blocks.length} كتل</span>
                </div>

                {/* Add Block Toolbar */}
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-border-subtle">
                  <div className="text-[11px] font-bold text-text-secondary mb-2">إضافة كتلة جديدة:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => addBlock('interactive_component')}
                      className="flex items-center gap-1.5 p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>أداة تفاعلية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => addBlock('quote')}
                      className="flex items-center gap-1.5 p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-primary text-xs font-medium border border-border-subtle transition-colors"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      <span>اقتباس علاجي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => addBlock('image')}
                      className="flex items-center gap-1.5 p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-primary text-xs font-medium border border-border-subtle transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>صورة توضيحية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => addBlock('markdown')}
                      className="flex items-center gap-1.5 p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-primary text-xs font-medium border border-border-subtle transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>نص Markdown</span>
                    </button>
                  </div>
                </div>

                {/* Blocks List */}
                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id || index}
                      className="p-4 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-3"
                    >
                      {/* Block Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-600/10 text-teal-600 text-[11px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-text-primary">
                            {block.block_type === 'interactive_component' && '🧩 أداة تفاعلية (Interactive Component)'}
                            {block.block_type === 'quote' && '💬 اقتباس علاجي (Quote)'}
                            {block.block_type === 'image' && '🖼️ صورة (Image)'}
                            {block.block_type === 'markdown' && '📝 فقرة (Markdown)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(index, -1)}
                            disabled={index === 0}
                            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, 1)}
                            disabled={index === blocks.length - 1}
                            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Specific Payload Editors */}
                      {block.block_type === 'interactive_component' && (
                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="block text-[10px] font-medium text-text-secondary mb-1">اختيار المكون التفاعلي المعتمد:</label>
                            <select
                              value={block.payload.component || 'thought-record-wizard'}
                              onChange={(e) => updateBlockPayload(index, 'component', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary font-mono"
                            >
                              {interactiveKeys.map((k) => (
                                <option key={k} value={k}>{k}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-text-secondary mb-1">عنوان الترويسة للتمرين:</label>
                            <input
                              type="text"
                              value={block.metadata?.title || ''}
                              onChange={(e) => updateBlockMetadata(index, 'title', e.target.value)}
                              placeholder="مثال: معالج رصد وتفنيد الفكرة التلقائية"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary"
                            />
                          </div>
                        </div>
                      )}

                      {block.block_type === 'quote' && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            value={block.payload.quote || ''}
                            onChange={(e) => updateBlockPayload(index, 'quote', e.target.value)}
                            placeholder="نص الاقتباس..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary"
                          />
                          <input
                            type="text"
                            value={block.payload.author || ''}
                            onChange={(e) => updateBlockPayload(index, 'author', e.target.value)}
                            placeholder="المؤلف / المرجع"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary"
                          />
                        </div>
                      )}

                      {block.block_type === 'image' && (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={block.payload.url || ''}
                            onChange={(e) => updateBlockPayload(index, 'url', e.target.value)}
                            placeholder="رابط الصورة URL (/article-by3DYy7JylaR.webp)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary font-mono"
                          />
                          <input
                            type="text"
                            value={block.payload.caption || ''}
                            onChange={(e) => updateBlockPayload(index, 'caption', e.target.value)}
                            placeholder="وصف توضيحي أسفل الصورة (Caption)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-text-primary"
                          />
                        </div>
                      )}

                      {block.block_type === 'markdown' && (
                        <textarea
                          rows={3}
                          value={block.payload.content || ''}
                          onChange={(e) => updateBlockPayload(index, 'content', e.target.value)}
                          placeholder="نص Markdown..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs font-mono text-text-primary"
                        />
                      )}
                    </div>
                  ))}

                  {blocks.length === 0 && (
                    <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-xl">
                      لا توجد كتل إضافية بعد. استخدم الأزرار أعلاه لإضافة أدوات تفاعلية أو اقتباسات.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Metadata & SEO */}
        {activeTab === 'meta' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
              <h3 className="text-sm font-bold font-display text-text-primary">الإعدادات الإكلينيكية والميتاداتا</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">الإطار العلاجي (Framework)</label>
                  <select
                    value={formData.metadata?.framework || 'CBT'}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, framework: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  >
                    <option value="CBT">العلاج المعرفي السلوكي (CBT)</option>
                    <option value="DBT">العلاج السلوكي الجدلي (DBT)</option>
                    <option value="ACT">العلاج بالقبول والالتزام (ACT)</option>
                    <option value="Psychodynamic">ديناميكي نفسي (Psychodynamic)</option>
                    <option value="Mindfulness">اليقظة الذهنية والتأمل</option>
                    <option value="General">عام / توعية نفسية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">مستوى الصعوبة</label>
                  <select
                    value={formData.metadata?.difficulty || 'متوسط'}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, difficulty: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  >
                    <option value="مبتدئ">مبتدئ (Beginner)</option>
                    <option value="متوسط">متوسط (Intermediate)</option>
                    <option value="متقدم">متقدم (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">وقت القراءة التقديري (بالدقائق)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.metadata?.reading_time_minutes || 5}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, reading_time_minutes: parseInt(e.target.value) || 5 }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">المؤلف أو المراجع العلمي</label>
                  <input
                    type="text"
                    value={formData.metadata?.author || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, author: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">صورة الغلاف المميزة (Featured Image URL)</label>
                <input
                  type="text"
                  value={formData.featured_image || ''}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="/article-by3DYy7JylaR.webp"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                />
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
              <h3 className="text-sm font-bold font-display text-text-primary">إعدادات محركات البحث (SEO & OpenGraph)</h3>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">عنوان SEO (Page Title)</label>
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={formData.title}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">وصف SEO (Meta Description)</label>
                <textarea
                  rows={2}
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder={formData.description}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Scientific References & Tags */}
        {activeTab === 'references' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scientific References Linker */}
            <div className="bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  المراجع العلمية المربوطة
                </h3>
                <Link to="/admin/references" className="text-xs text-teal-600 hover:text-teal-700">
                  إدارة المراجع
                </Link>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {availableRefs.map((ref) => {
                  const isChecked = selectedRefIds.includes(ref.id);
                  return (
                    <label
                      key={ref.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-teal-500/10 border-teal-500/30 text-text-primary'
                          : 'bg-surface-elevated/40 border-border-subtle text-text-secondary hover:bg-surface-elevated'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedRefIds(selectedRefIds.filter(id => id !== ref.id));
                          } else {
                            setSelectedRefIds([...selectedRefIds, ref.id]);
                          }
                        }}
                        className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <div className="font-bold text-text-primary">{ref.title}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          {ref.authors} ({ref.year}) — {ref.publication}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Tags Selector */}
            <div className="bg-surface p-6 rounded-2xl border border-border-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
                  <Tags className="w-4 h-4 text-teal-600" />
                  الوسوم والتصنيفات
                </h3>
                <Link to="/admin/tags" className="text-xs text-teal-600 hover:text-teal-700">
                  إدارة الوسوم
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isChecked = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                        } else {
                          setSelectedTagIds([...selectedTagIds, tag.id]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        isChecked
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-surface-elevated text-text-secondary border-border-subtle hover:text-text-primary'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Live Public Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary">وضع المعاينة الحية:</span>
                <span className="text-xs text-text-secondary">تطبيق مباشر لـ ContentBlockRenderer ومحرك القوالب</span>
              </div>

              <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-lg border border-border-subtle">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md ${previewDevice === 'desktop' ? 'bg-surface text-teal-600 shadow-xs' : 'text-text-muted'}`}
                  title="سطح المكتب"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md ${previewDevice === 'mobile' ? 'bg-surface text-teal-600 shadow-xs' : 'text-text-muted'}`}
                  title="هاتف محمول"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-sm border-4 border-border-subtle rounded-3xl p-4 bg-bg-app shadow-2xl min-h-[640px]' : 'w-full'}`}>
              <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
                    {formData.metadata?.framework || 'CBT'}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary leading-tight">
                    {formData.title}
                  </h1>
                  {formData.description && (
                    <p className="text-text-secondary text-sm leading-relaxed mt-2">
                      {formData.description}
                    </p>
                  )}
                </div>

                {/* Markdown Content */}
                <div className="prose dark:prose-invert max-w-none text-right">
                  <MarkdownRenderer content={formData.markdown_content} />
                </div>

                {/* Render Attached Blocks */}
                <ContentBlockRenderer blocks={blocks} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version History Drawer / Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-xl w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-5" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                <h3 className="font-display font-bold text-lg text-text-primary">سجل نسخ المحتوى (Audit Versions)</h3>
              </div>
              <button onClick={() => setShowVersionModal(false)} className="text-text-muted hover:text-text-primary">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 divide-y divide-border-subtle">
              {versions.map((ver) => (
                <div key={ver.id || ver.version_number} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono">
                        نسخة #{ver.version_number}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(ver.created_at).toLocaleString('ar-EG')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-text-primary mt-1">
                      {ver.change_summary || 'تعديل وتحديث'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestoreVersion(ver.version_number)}
                    className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-teal-500/10 hover:text-teal-600 border border-border-subtle text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    استعادة
                  </button>
                </div>
              ))}

              {versions.length === 0 && (
                <div className="py-8 text-center text-xs text-text-muted">لا توجد نسخ سابقة محفوظة بعد.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
