// src/components/wellness/NotesJournalSpace.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Calendar, 
  Filter, 
  Check,
  FileText
} from 'lucide-react';
import { getNotes, deleteNote, saveNote } from '../../services/notesService';

export default function NotesJournalSpace() {
  const nav = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('all');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const loadNotes = async () => {
    const list = await getNotes();
    setNotes(list);
  };

  useEffect(() => {
    loadNotes();

    const handleNotesUpdated = () => {
      loadNotes();
    };

    window.addEventListener('userNotesUpdated', handleNotesUpdated);
    return () => window.removeEventListener('userNotesUpdated', handleNotesUpdated);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
      await deleteNote(id);
      loadNotes();
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  const saveEdit = async (note) => {
    if (!editContent.trim()) return;
    await saveNote({
      ...note,
      content: editContent.trim(),
    });
    setEditingNoteId(null);
    setEditContent('');
    loadNotes();
  };

  // Get unique list of source titles for filtering
  const uniqueSources = Array.from(new Set(notes.map(n => n.source_title).filter(Boolean)));

  // Filter notes by search query and source
  const filteredNotes = notes.filter(n => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      (n.content || '').toLowerCase().includes(q) ||
      (n.source_title || '').toLowerCase().includes(q);
    
    const matchesSource = 
      selectedSourceFilter === 'all' || n.source_title === selectedSourceFilter;

    return matchesSearch && matchesSource;
  });

  // Group notes by formatted date (e.g. "20 أغسطس 2026")
  const groupedNotes = filteredNotes.reduce((groups, note) => {
    const dateObj = new Date(note.created_at || Date.now());
    const dateKey = dateObj.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(note);
    return groups;
  }, {});

  return (
    <div dir="rtl" className="space-y-8 bg-transparent">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-8">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto flex-1">
          <Search size={17} className="absolute right-3.5 top-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الملاحظات والخواطر..."
            className="w-full pr-10 pl-4 py-3 text-xs sm:text-sm bg-slate-50 text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-400"
          />
        </div>

        {/* Source Filter Dropdown */}
        {uniqueSources.length > 0 && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Filter size={16} className="text-emerald-700 shrink-0" />
            <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">جميع المصادر ({notes.length})</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Journal Grouped Notes List */}
      {Object.keys(groupedNotes).length > 0 ? (
        <div className="space-y-10 mt-6">
          {Object.entries(groupedNotes).map(([dateLabel, dateNotes]) => (
            <div key={dateLabel} className="space-y-5">
              
              {/* Date Header Separator */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 shadow-xs">
                  <Calendar size={15} className="shrink-0 text-emerald-700" />
                  <span>{dateLabel}</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-mono px-1">
                  {dateNotes.length} {dateNotes.length === 1 ? 'ملاحظة' : 'ملاحظات'}
                </span>
              </div>

              {/* Notes Grid under date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {dateNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    {/* Note Card Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800">
                          <MapPin size={15} className="text-emerald-600 shrink-0" />
                          <span>كتبتها في: "{note.source_title || 'صفحة عامة'}"</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {new Date(note.created_at || Date.now()).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {editingNoteId !== note.id && (
                          <>
                            <button
                              onClick={() => startEdit(note)}
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                              title="تعديل الملاحظة"
                            >
                              <Edit3 size={16} className="shrink-0" />
                            </button>
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="حذف الملاحظة"
                            >
                              <Trash2 size={16} className="shrink-0" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Note Content / Edit Form */}
                    {editingNoteId === note.id ? (
                      <div className="space-y-3 pt-1">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full p-3.5 rounded-xl bg-slate-50 border border-emerald-400 text-xs sm:text-sm text-slate-800 focus:outline-none leading-relaxed resize-none"
                        />
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => saveEdit(note)}
                            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <Check size={15} className="shrink-0" />
                            <span>حفظ التعديل</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
                        "{note.content}"
                      </p>
                    )}

                    {/* Back to Source Location Action Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => nav(note.source_path || '/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs transition-all active:scale-95 shadow-xs"
                      >
                        <span>العودة للمكان</span>
                        <ExternalLink size={14} className="shrink-0 text-emerald-700" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-4 shadow-xs mt-6">
          <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shrink-0">
            <FileText size={30} className="shrink-0" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">لا توجد ملاحظات مسجلة بعد</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            يمكنك كتابة ملاحظة سريعة في أي وقت ومن أي صفحة عن طريق زر الأدوات العائم أسفل الشاشة 🌸
          </p>
        </div>
      )}
    </div>
  );
}
