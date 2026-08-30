// src/components/garden/DailyProgress.jsx
import { CheckCircle2, HeartHandshake, Sparkles, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DailyProgress({ timeline = [] }) {
 const nav = useNavigate();

 const todayStr = new Date().toISOString().split('T')[0];

 // Filter items logged today
 const todayItems = timeline.filter(item => {
 if (!item.date) return false;
 return new Date(item.date).toISOString().split('T')[0] === todayStr;
 });

 const hasTodayActivity = todayItems.length > 0;

  return (
    <div className="bg-bg-surface rounded-3xl p-5 border border-border-medium shadow-2xs space-y-3 transition-colors">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
        <div>
          <h3 className="text-base font-bold text-text-primary">نشاط اليوم</h3>
          <p className="text-xs text-text-muted">خطواتك المنجزة خلال الـ 24 ساعة الماضية</p>
        </div>

        {hasTodayActivity && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            {todayItems.length} {todayItems.length === 1 ? 'إنجاز' : 'إنجازات'}
          </span>
        )}
      </div>

      {/* Render Today's Items if any */}
      {hasTodayActivity ? (
        <div className="space-y-2.5">
          {todayItems.map((item, i) => (
            <div 
              key={item.id || i}
              className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-bg-app border border-border-subtle hover:border-emerald-300 transition-all"
            >
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {item.title || item.label}
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  {item.description || 'تم إكمال الخطوة وتسجيل أثرها في تقدمك.'}
                </p>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:text-emerald-300 shrink-0">
                نمو جديد
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Non-judgmental Therapeutic Empty State */
        <div className="p-4 rounded-2xl bg-bg-app border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-text-primary">
              تقدمك لا تحتاج إلى أن تكبر اليوم. وجودك هنا يكفي.
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              الراحة والهدوء جزء أساسي من النمو النفسي. خذ وقتك كاملاً دون أي استعجال.
            </p>
          </div>

          <button
            type="button"
            onClick={() => nav('/Breathing478')}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            تنفس دقيقة واحدة
          </button>
        </div>
      )}
    </div>
  );
}
