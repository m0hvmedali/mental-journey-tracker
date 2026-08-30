import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, GripVertical, Layers } from 'lucide-react';
import adminContentService from '../../services/adminContentService';


export default function ShortcutsManager() {
  const [shortcuts, setShortcuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', is_visible: true, sort_order: 0 });

  const [allContent, setAllContent] = useState([]);
  const [selectedShortcutItems, setSelectedShortcutItems] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scData, contentData] = await Promise.all([
        adminContentService.getShortcuts(),
        adminContentService.getAllContent()
      ]);
      setShortcuts(scData);
      setAllContent(contentData.filter(c => c.status === 'published' || c.status === 'draft'));
    } catch (err) {
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    try {
      if (id) {
        await adminContentService.updateShortcut(id, formData);
      } else {
        await adminContentService.createShortcut(formData);
      }
      setEditingId(null);
      loadData();
    } catch (err) {
      alert('خطأ في الحفظ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      await adminContentService.deleteShortcut(id);
      loadData();
    }
  };

  const openItemModal = (shortcut) => {
    setEditingId(shortcut.id);
    setSelectedShortcutItems(shortcut.items || []);
    setShowItemModal(true);
  };

  const saveItems = async () => {
    try {
      await adminContentService.saveShortcutItems(editingId, selectedShortcutItems.map((item, idx) => ({
        content_id: item.content_id || item.content.id,
        sort_order: idx
      })));
      setShowItemModal(false);
      setEditingId(null);
      loadData();
    } catch (err) {
      alert('خطأ في حفظ العناصر');
    }
  };

  const toggleContentSelection = (content) => {
    const exists = selectedShortcutItems.find(i => (i.content_id === content.id || i.content?.id === content.id));
    if (exists) {
      setSelectedShortcutItems(selectedShortcutItems.filter(i => (i.content_id !== content.id && i.content?.id !== content.id)));
    } else {
      setSelectedShortcutItems([...selectedShortcutItems, { content_id: content.id, content, sort_order: selectedShortcutItems.length }]);
    }
  };

  const moveItem = (index, direction) => {
    const newItems = [...selectedShortcutItems];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setSelectedShortcutItems(newItems);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة اختصارات الرئيسية (Shortcuts)</h2>
        <button 
          onClick={() => { setEditingId('new'); setFormData({ title: '', description: '', icon: '', is_visible: true, sort_order: shortcuts.length }); }}
          className="bg-accent-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={16} /> إضافة جديد
        </button>
      </div>

      <div className="bg-white rounded-md border border-border-medium overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 border-b border-border-medium">
            <tr>
              <th className="p-4">الترتيب</th>
              <th className="p-4">العنوان</th>
              <th className="p-4">الظهور</th>
              <th className="p-4">العناصر</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map(sc => (
              <tr key={sc.id} className="border-b border-border-subtle">
                <td className="p-4">{sc.sort_order}</td>
                <td className="p-4 font-bold">{sc.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${sc.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sc.is_visible ? 'ظاهر' : 'مخفي'}
                  </span>
                </td>
                <td className="p-4">
                  {sc.items?.length || 0} صفحات
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(sc.id); setFormData(sc); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => openItemModal(sc)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="إدارة المحتوى">
                    <Layers size={16} />
                  </button>
                  <button onClick={() => handleDelete(sc.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && editingId !== 'items' && !showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">{editingId === 'new' ? 'إضافة اختصار جديد' : 'تعديل الاختصار'}</h3>
            <div>
              <label className="block text-sm mb-1">العنوان</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">الوصف</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">الترتيب</label>
              <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full border p-2 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.is_visible} onChange={e => setFormData({...formData, is_visible: e.target.checked})} id="is_visible" />
              <label htmlFor="is_visible">ظاهر للعامة</label>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 border rounded">إلغاء</button>
              <button onClick={() => handleSave(editingId === 'new' ? null : editingId)} className="px-4 py-2 bg-accent-primary text-white rounded">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 flex flex-col h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">إدارة صفحات الاختصار</h3>
              <button onClick={() => setShowItemModal(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 flex gap-6 overflow-hidden">
              <div className="flex-1 flex flex-col border rounded p-4 overflow-hidden">
                <h4 className="font-bold mb-2">جميع الصفحات</h4>
                <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                  {allContent.map(content => {
                    const isSelected = selectedShortcutItems.find(i => (i.content_id === content.id || i.content?.id === content.id));
                    return (
                      <div key={content.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                        <span className="truncate">{content.title}</span>
                        <button onClick={() => toggleContentSelection(content)} className={`p-1 rounded ${isSelected ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                          {isSelected ? <X size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex-1 flex flex-col border rounded p-4 bg-gray-50 overflow-hidden">
                <h4 className="font-bold mb-2">الصفحات المختارة (ترتيب العرض)</h4>
                <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                  {selectedShortcutItems.map((item, idx) => {
                    const content = item.content || allContent.find(c => c.id === item.content_id);
                    if (!content) return null;
                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-white border rounded">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="disabled:opacity-30"><GripVertical size={14} className="rotate-90" /></button>
                          <button onClick={() => moveItem(idx, 'down')} disabled={idx === selectedShortcutItems.length - 1} className="disabled:opacity-30"><GripVertical size={14} className="rotate-90" /></button>
                        </div>
                        <span className="flex-1 truncate">{content.title}</span>
                        <button onClick={() => toggleContentSelection(content)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <X size={16} />
                        </button>
                      </div>
                    )
                  })}
                  {selectedShortcutItems.length === 0 && <p className="text-gray-500 text-sm text-center mt-4">لا توجد صفحات مضافة</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <button onClick={() => setShowItemModal(false)} className="px-4 py-2 border rounded">إلغاء</button>
              <button onClick={saveItems} className="px-4 py-2 bg-accent-primary text-white rounded">حفظ العناصر</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
