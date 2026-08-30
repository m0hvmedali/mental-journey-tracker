// src/components/garden/SettingsModal.jsx
import { useState } from 'react';
import { 
 X, 
 User, 
 Moon, 
 Sun, 
 Globe, 
 Bell, 
 Music, 
 ShieldCheck, 
 Download, 
 RotateCcw, 
 Check, 
 Sparkles
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMusic } from '@/contexts/MusicContext';
import { useNotification } from '@/contexts/NotificationContext';
import { updateUserProfile, exportUserData, resetUserProgress } from '@/utils/progress';

export default function SettingsModal({ isOpen, onClose, profile, onProfileUpdated }) {
 const { toggleTheme, isDark } = useTheme();
 const { language, changeLanguage, availableLanguages } = useLanguage();
 const { isEnabled: musicEnabled, toggleMusic } = useMusic();
 const { 
 dailyReminder, 
 gratitudeReminder, 
 toggleDailyReminder, 
 toggleGratitudeReminder 
 } = useNotification();

 const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'appearance' | 'notifications' | 'privacy'
 const [name, setName] = useState(profile?.name || '');
 const [bio, setBio] = useState(profile?.bio || '');
 const [savedSuccess, setSavedSuccess] = useState(false);
 const [confirmReset, setConfirmReset] = useState(false);

 if (!isOpen) return null;

 const handleSaveProfile = (e) => {
 e.preventDefault();
 const updated = updateUserProfile({ name, bio });
 onProfileUpdated(updated);
 setSavedSuccess(true);
 setTimeout(() => setSavedSuccess(false), 2000);
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
 <div 
 className="relative w-full max-w-2xl bg-bg-surface rounded-3xl border border-border-medium shadow-lg overflow-hidden flex flex-col max-h-[90vh] text-text-primary"
 dir="rtl"
 style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}
 >
 {/* Modal Header */}
 <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-subtle bg-bg-app">
 <div className="flex items-center gap-2.5">
 <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
 <User size={18} />
 </div>
 <div>
 <h3 className="text-base sm:text-lg font-bold text-text-primary">
 إعدادات وتفضيلات المستخدم
 </h3>
 <p className="text-xs text-text-muted">تخصيص الهوية الشخصية وتجربة التقدم</p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-slate-400 hover:text-text-secondary dark:hover:text-slate-200 hover:bg-bg-surface-hover dark:hover:bg-bg-surface-elevated transition-all"
 >
 <X size={20} />
 </button>
 </div>

 {/* Tab Navigation Bar */}
 <div className="flex border-b border-border-subtle bg-bg-app/60 /60 px-4 gap-2 overflow-x-auto">
 {[
 { id: 'profile', label: 'الملف الشخصي', icon: User },
 { id: 'appearance', label: 'المظهر واللغة', icon: Sun },
 { id: 'notifications', label: 'التنبيهات والموسيقى', icon: Bell },
 { id: 'privacy', label: 'الخصوصية والبيانات', icon: ShieldCheck }
 ].map(tab => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
 isActive 
 ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 bg-bg-surface rounded-t-xl' 
 : 'border-transparent text-slate-500 hover:text-text-primary dark:hover:text-slate-200'
 }`}
 >
 <Icon size={15} />
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>

 {/* Modal Content Body */}
 <div className="p-5 overflow-y-auto space-y-5 flex-1">
 
 {/* TAB 1: Profile Settings */}
 {activeTab === 'profile' && (
 <form onSubmit={handleSaveProfile} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-text-primary mb-2">
 معاينة الصورة الشخصية (أول حرف من الاسم)
 </label>
 <div className="flex items-center gap-3">
 <div className="size-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-2xs">
 {name?.trim() ? name.trim().charAt(0).toUpperCase() : 'م'}
 </div>
 <p className="text-xs text-text-muted">
 يتم عرض أول حرف من اسمك كصورة رمزية شخصية.
 </p>
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-text-primary mb-1.5">
 الاسم المستعار أو الشهرة
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="مثال: ملاحق الذات"
 className="w-full px-3.5 py-2.5 rounded-xl border border-border-medium bg-bg-app text-sm text-text-primary focus:outline-none focus:border-emerald-600 transition-colors"
 required
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-text-primary mb-1.5">
 عبارة أو هدف الشخصي في رحلة التعافي
 </label>
 <textarea
 value={bio}
 onChange={(e) => setBio(e.target.value)}
 rows={3}
 placeholder="اكتب نبذة قصيرة تلهمك في رحلتك..."
 className="w-full px-3.5 py-2.5 rounded-xl border border-border-medium bg-bg-app text-sm text-text-primary focus:outline-none focus:border-emerald-600 transition-colors resize-none"
 />
 </div>

 <div className="pt-2 flex items-center justify-between">
 {savedSuccess ? (
 <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 px-3 py-1.5 rounded-xl">
 <Check size={16} />
 <span>تم حفظ البيانات بنجاح!</span>
 </span>
 ) : <div />}

 <button
 type="submit"
 className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-2xs"
 >
 حفظ التغييرات
 </button>
 </div>
 </form>
 )}

 {/* TAB 2: Appearance & Language */}
 {activeTab === 'appearance' && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle flex items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
 {isDark ? <Moon size={20} /> : <Sun size={20} />}
 </div>
 <div>
 <h4 className="text-sm font-bold text-text-primary">المظهر والنمط</h4>
 <p className="text-xs text-slate-500 ">
 {isDark ? 'الوضع الداكن المريح للعين' : 'الوضع الفاتح الهادئ'}
 </p>
 </div>
 </div>

 <button
 onClick={toggleTheme}
 className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all"
 >
 {isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
 </button>
 </div>

 <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle space-y-3">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-teal-100 dark:bg-[#1d3a33] text-teal-800 dark:text-teal-300 flex items-center justify-center">
 <Globe size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-text-primary">لغة التطبيق</h4>
 <p className="text-xs text-slate-500 ">اختر لغة العرض المفضلة لديك</p>
 </div>
 </div>

 <div className="flex gap-2">
 {availableLanguages.map((lang) => (
 <button
 key={lang.code}
 onClick={() => changeLanguage(lang.code)}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 language === lang.code 
 ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' 
 : 'bg-bg-surface text-text-secondary border-border-medium hover:bg-bg-surface-hover dark:hover:bg-[#1f382f]'
 }`}
 >
 {lang.name}
 </button>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* TAB 3: Notifications & Music */}
 {activeTab === 'notifications' && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
 <Bell size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-text-primary">تذكير التدوين اليومي</h4>
 <p className="text-xs text-slate-500 ">إشعار لطيف لمساعدتك على الحضور اليومي</p>
 </div>
 </div>

 <input
 type="checkbox"
 checked={dailyReminder}
 onChange={toggleDailyReminder}
 className="size-5 accent-emerald-600 rounded cursor-pointer"
 />
 </div>

 <div className="flex items-center justify-between border-t border-[#f0f7f4] pt-2">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center">
 <Sparkles size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-text-primary">تذكير الامتنان</h4>
 <p className="text-xs text-slate-500 ">تذكير بكتابة إشراقة امتنان يومية</p>
 </div>
 </div>

 <input
 type="checkbox"
 checked={gratitudeReminder}
 onChange={toggleGratitudeReminder}
 className="size-5 accent-emerald-600 rounded cursor-pointer"
 />
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 flex items-center justify-center">
 <Music size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-text-primary">الموسيقى الخلفية والسكينة</h4>
 <p className="text-xs text-slate-500 ">تفعيل النغمات الهادئة للتأريض</p>
 </div>
 </div>

 <button
 onClick={toggleMusic}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
 musicEnabled 
 ? 'bg-emerald-700 text-white' 
 : 'bg-bg-surface-hover text-text-secondary hover:bg-slate-300 dark:hover:bg-[#2f4f44]'
 }`}
 >
 {musicEnabled ? 'مفعلة ✓' : 'معطلة'}
 </button>
 </div>
 </div>
 )}

 {/* TAB 4: Privacy & Data Management */}
 {activeTab === 'privacy' && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
 <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
 <ShieldCheck size={18} />
 <span>خصوصيتك وبياناتك النفسية آمنة 100%</span>
 </div>
 <p className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed pt-1">
 جميع بياناتك المدوّنة وأحداث الحديقة يتم حفظها محلياً بأمان تام على جهازك الخاص. لا نقوم بمشاركة أي بيانات مع أي طرف آخر.
 </p>
 </div>

 <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle flex items-center justify-between gap-4">
 <div>
 <h4 className="text-sm font-bold text-text-primary">تصدير سجل الحديقة والتقدم</h4>
 <p className="text-xs text-slate-500 ">تحميل نسخة احتياطية من جميع إنجازاتك بتنسيق JSON</p>
 </div>

 <button
 onClick={exportUserData}
 className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all shrink-0"
 >
 <Download size={15} />
 <span>تصدير البيانات</span>
 </button>
 </div>

 <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">إعادة تعيين الحديقة بالكامل</h4>
 <p className="text-xs text-rose-800/80 dark:text-rose-300/80">مسح كافة السجلات والبدء بحديقة جديدة من الصفر</p>
 </div>

 {!confirmReset ? (
 <button
 onClick={() => setConfirmReset(true)}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold hover:bg-rose-200 dark:hover:bg-rose-800 transition-all shrink-0"
 >
 <RotateCcw size={14} />
 <span>إعادة ضبط</span>
 </button>
 ) : (
 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 resetUserProgress();
 setConfirmReset(false);
 window.location.reload();
 }}
 className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all"
 >
 تأكيد المسح
 </button>
 <button
 onClick={() => setConfirmReset(false)}
 className="px-2.5 py-1.5 rounded-xl bg-bg-surface-hover text-text-secondary text-xs font-bold"
 >
 إلغاء
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 </div>

 {/* Modal Footer */}
 <div className="p-4 border-t border-border-subtle bg-bg-app flex justify-end">
 <button
 onClick={onClose}
 className="px-5 py-2 rounded-xl bg-bg-surface-hover hover:bg-slate-300 dark:hover:bg-emerald-900 text-text-primary font-bold text-xs transition-all"
 >
 إغلاق الإعدادات
 </button>
 </div>
 </div>
 </div>
 );
}
