import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, CheckCircle2, Clock, Trash2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { tasksService } from '../../services/tasksService';

export default function FloatingTasksPanel({ onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New task form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarUrl = (taskTitle, taskNotes, taskDate, taskTime) => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(taskTitle);
    const details = encodeURIComponent(taskNotes || '');
    
    let dates = '';
    if (taskDate && taskTime) {
      const start = new Date(`${taskDate}T${taskTime}`);
      const end = new Date(start.getTime() + 15 * 60000); // 15 mins later
      
      const formatGoogleDate = (d) => {
        return d.toISOString().replace(/-|:|\.\d\d\d/g, ''); 
      };
      dates = `&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}`;
    } else if (taskDate) {
      const start = new Date(taskDate);
      const end = new Date(start.getTime() + 24 * 60 * 60000);
      const formatAllDay = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
      dates = `&dates=${formatAllDay(start)}/${formatAllDay(end)}`;
    }
    
    return `${baseUrl}&text=${text}&details=${details}${dates}`;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let combinedDue = null;
    if (dueDate && dueTime) {
      combinedDue = new Date(`${dueDate}T${dueTime}`).toISOString();
    } else if (dueDate) {
      combinedDue = new Date(dueDate).toISOString();
    }

    try {
      const taskData = {
        title: title.trim(),
        notes: notes.trim(),
        due: combinedDue
      };
      
      await tasksService.addTask(taskData);
      
      // Reload tasks from service
      await loadTasks();

      // Open Calendar URL in new tab
      const url = generateCalendarUrl(title, notes, dueDate, dueTime);
      window.open(url, '_blank', 'noopener,noreferrer');

      setIsAdding(false);
      setTitle('');
      setNotes('');
      setDueDate('');
      setDueTime('');
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      await tasksService.toggleTask(taskId, completed);
      // Optimistic update
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed } : t));
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await tasksService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleOpenCalendar = (task) => {
    let dDate = '';
    let dTime = '';
    if (task.due) {
      const d = new Date(task.due);
      // Format as YYYY-MM-DD
      dDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    const url = generateCalendarUrl(task.title, task.notes, dDate, dTime);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div dir="rtl" className="tasks-panel-container">
      {/* Same token pattern as FloatingAIChat.jsx — kept in sync so every
          floating widget reads as one family, not separate designs. */}
      <style>{`
        .tasks-panel {
          --font-display: 'Alexandria', 'Tajawal', sans-serif;
          --font-body: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif;
          --font-mono: 'Space Mono', monospace;

          --panel-bg: ${isDark ? 'rgba(26, 23, 20, 0.97)' : 'rgba(250, 247, 242, 0.98)'};
          --panel-surface: ${isDark ? 'rgba(219, 203, 182, 0.06)' : 'rgba(219, 203, 182, 0.28)'};
          --panel-surface-hover: ${isDark ? 'rgba(219, 203, 182, 0.10)' : 'rgba(219, 203, 182, 0.42)'};
          --panel-text: ${isDark ? '#FAF7F2' : '#2A2724'};
          --panel-muted: ${isDark ? '#A89E92' : '#6B6259'};
          --panel-border: ${isDark ? 'rgba(250, 247, 242, 0.08)' : 'rgba(42, 39, 36, 0.10)'};
          --panel-accent: ${isDark ? '#4A8F6B' : '#2C4C3B'};
          --panel-accent-hover: ${isDark ? '#5CA37D' : '#3E7A5A'};
          --panel-accent-bg: ${isDark ? 'rgba(74, 143, 107, 0.14)' : 'rgba(44, 76, 59, 0.08)'};
          --panel-error: ${isDark ? '#C4574A' : '#A13D2E'};
          --panel-error-bg: ${isDark ? 'rgba(196, 87, 74, 0.12)' : 'rgba(161, 61, 46, 0.08)'};
          --panel-shadow: ${isDark ? '0 25px 50px -12px rgba(15, 12, 10, 0.6)' : '0 20px 40px -15px rgba(42, 39, 36, 0.14)'};
          --panel-input-bg: ${isDark ? 'rgba(36, 32, 28, 0.9)' : 'rgba(255, 253, 250, 0.9)'};

          background-color: var(--panel-bg);
          color: var(--panel-text);
          box-shadow: var(--panel-shadow);
          font-family: var(--font-body);
        }
        .tasks-panel h3, .tasks-panel h4 {
          font-family: var(--font-display);
        }
        .tasks-panel time, .tasks-panel .task-meta-numeral {
          font-family: var(--font-mono);
        }
        .panel-scrollbar::-webkit-scrollbar { width: 5px; }
        .panel-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .panel-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(250, 247, 242, 0.10)' : 'rgba(42, 39, 36, 0.12)'};
          border-radius: 9999px;
        }
        .panel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(250, 247, 242, 0.18)' : 'rgba(42, 39, 36, 0.20)'};
        }
      `}</style>

      <div className="tasks-panel fixed inset-0 sm:absolute sm:inset-auto sm:bottom-0 sm:left-0 sm:w-[380px] sm:h-[550px] sm:max-h-[80vh] rounded-none sm:rounded-[20px] border-0 sm:border border-[var(--panel-border)] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--panel-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[var(--panel-accent-bg)] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[var(--panel-accent)]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--panel-text)]">مهامي</h3>
              <p className="text-[10px] text-[var(--panel-muted)]">احفظ مهامك وأضفها لتقويم جوجل بسهولة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-[var(--panel-surface)] text-[var(--panel-muted)] hover:text-[var(--panel-text)] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 panel-scrollbar relative">
          <div className="space-y-4">
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-[var(--panel-surface)] hover:bg-[var(--panel-surface-hover)] border border-[var(--panel-border)] border-dashed rounded-xl text-sm font-medium text-[var(--panel-accent)] transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>إضافة مهمة جديدة</span>
              </button>
            )}

            {isAdding && (
              <form onSubmit={handleCreateTask} className="bg-[var(--panel-surface)] border border-[var(--panel-border)] rounded-xl p-4 space-y-3">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="عنوان المهمة..."
                  className="w-full bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded-lg px-3 py-2 text-sm text-[var(--panel-text)] focus:outline-none focus:border-[var(--panel-accent)] transition-colors"
                  required
                />
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="ملاحظات إضافية (اختياري)..."
                  rows={2}
                  className="w-full bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded-lg px-3 py-2 text-sm text-[var(--panel-text)] focus:outline-none focus:border-[var(--panel-accent)] transition-colors resize-none"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="flex-1 bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded-lg px-2 py-2 text-xs text-[var(--panel-text)] focus:outline-none focus:border-[var(--panel-accent)]"
                  />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    className="flex-1 bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded-lg px-2 py-2 text-xs text-[var(--panel-text)] focus:outline-none focus:border-[var(--panel-accent)]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-2 text-xs font-medium text-[var(--panel-muted)] hover:text-[var(--panel-text)] bg-[var(--panel-surface)] rounded-lg transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1 py-2 text-xs font-bold text-white bg-[var(--panel-accent)] hover:bg-[var(--panel-accent-hover)] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    حفظ وإضافة للتقويم
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 pt-2">
              {tasks.length === 0 && !isAdding && (
                <div className="text-center py-8 text-[var(--panel-muted)] text-sm">
                  لا توجد مهام حالياً.
                </div>
              )}
              {tasks.map(task => (
                <div key={task.id} className="bg-[var(--panel-surface)] border border-[var(--panel-border)] rounded-xl p-3 flex justify-between items-start group hover:border-[var(--panel-accent)]/30 transition-colors">
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-[var(--panel-text)]">{task.title}</h5>
                    {task.due && (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--panel-accent)]">
                        <Calendar size={12} />
                        <time className="task-meta-numeral">
                          {new Date(task.due).toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    )}
                    {task.notes && (
                      <p className="text-xs text-[var(--panel-muted)] mt-1 line-clamp-2">{task.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={() => handleOpenCalendar(task)}
                        className="p-1.5 text-[var(--panel-muted)] hover:text-[var(--panel-accent)] hover:bg-[var(--panel-accent-bg)] rounded-md transition-colors shrink-0 cursor-pointer"
                        title="إضافة لتقويم جوجل"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-[var(--panel-muted)] hover:text-[var(--panel-error)] hover:bg-[var(--panel-error-bg)] rounded-md transition-colors shrink-0 cursor-pointer"
                        title="حذف المهمة"
                      >
                        <Trash2 size={14} />
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Info */}
        <div className="px-4 py-3 border-t border-[var(--panel-border)] flex justify-between items-center text-[10px] text-[var(--panel-muted)] shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>سيتم فتح نافذة جديدة لإضافة المهمة للتقويم</span>
          </div>
        </div>
      </div>
    </div>
  );
}