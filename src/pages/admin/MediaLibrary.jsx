// src/pages/admin/MediaLibrary.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminContentService } from '@/services/adminContentService';
import {
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Upload,
  Filter
} from 'lucide-react';

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMedia, setNewMedia] = useState({
    media_type: 'image',
    url: '',
    alt_text: '',
    caption: '',
    mime_type: 'image/webp'
  });

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await adminContentService.getMediaList({ search, mediaType: filterType });
      setMediaItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [filterType]);

  useEffect(() => {
    const timer = setTimeout(loadMedia, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateMedia = async (e) => {
    e.preventDefault();
    if (!newMedia.url) return;
    try {
      await adminContentService.createMedia(newMedia);
      setShowAddModal(false);
      setNewMedia({
        media_type: 'image',
        url: '',
        alt_text: '',
        caption: '',
        mime_type: 'image/webp'
      });
      loadMedia();
    } catch (err) {
      alert('فشل إضافة أصل الوسائط.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
      await adminContentService.deleteMedia(id);
      setMediaItems(mediaItems.filter(m => m.id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  return (
    <AdminLayout
      title="مكتبة الوسائط والأصول"
      subtitle="إدارة الصور التوضيحية، الأصوات العلاجية، وملفات الوسائط المتعددة"
      actionButton={
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة أصل جديد</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="البحث في الوسائط بالوصف أو الرابط..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-border-subtle text-xs shrink-0">
            {['all', 'image', 'audio', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterType === type
                    ? 'bg-surface text-teal-600 shadow-xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {type === 'all' ? 'الكل' : type === 'image' ? 'صور' : type === 'audio' ? 'أصوات' : 'فيديو'}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-text-muted">جاري تحميل مكتبة الوسائط...</div>
        ) : mediaItems.length === 0 ? (
          <div className="p-16 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border-subtle">
            لا توجد ملفات وسائط مطابقة.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-border-subtle overflow-hidden flex flex-col justify-between shadow-xs group"
              >
                <div className="aspect-video bg-surface-elevated flex items-center justify-center relative overflow-hidden">
                  {item.media_type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt_text || 'Media'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : item.media_type === 'audio' ? (
                    <div className="flex flex-col items-center gap-2 text-teal-600">
                      <Music className="w-10 h-10" />
                      <span className="text-[10px] font-mono text-text-muted">ملف صوتي</span>
                    </div>
                  ) : (
                    <Video className="w-10 h-10 text-indigo-600" />
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-xs text-text-primary truncate">
                      {item.alt_text || item.caption || 'ملف وسائط بدون عنوان'}
                    </div>
                    <div className="text-[11px] text-text-muted truncate font-mono mt-0.5" dir="ltr">
                      {item.url}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-text-muted hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl border border-border-subtle shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display font-bold text-base text-text-primary">إضافة أصل وسائط جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleCreateMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">نوع الوسائط</label>
                <select
                  value={newMedia.media_type}
                  onChange={(e) => setNewMedia({ ...newMedia, media_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                >
                  <option value="image">صورة (Image)</option>
                  <option value="audio">ملف صوتي (Audio)</option>
                  <option value="video">فيديو (Video)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">الرابط المباشر (URL)</label>
                <input
                  type="text"
                  required
                  value={newMedia.url}
                  onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                  placeholder="/article-by3DYy7JylaR.webp أو رابط CDN..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">النص البديل (Alt Text)</label>
                <input
                  type="text"
                  value={newMedia.alt_text}
                  onChange={(e) => setNewMedia({ ...newMedia, alt_text: e.target.value })}
                  placeholder="وصف تفصيلي لمحتوى الصورة لذوي الإعاقة ومحركات البحث"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">الشرح التوضيحي (Caption)</label>
                <input
                  type="text"
                  value={newMedia.caption}
                  onChange={(e) => setNewMedia({ ...newMedia, caption: e.target.value })}
                  placeholder="الشرح الذي يظهر أسفل الصورة أو الأداة"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-elevated"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
                >
                  حفظ الأصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
