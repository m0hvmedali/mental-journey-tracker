// src/pages/LLMDebug.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Play, 
  RefreshCw, 
  Database, 
  Sparkles, 
  AlertTriangle,
  Server,
  Zap,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function LLMDebug() {
  const [statuses, setStatuses] = useState(null);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  
  // Single Provider Test
  const [testingProvider, setTestingProvider] = useState(null);
  const [providerResults, setProviderResults] = useState({});

  // Failover Test
  const [simulatedFailures, setSimulatedFailures] = useState({
    gemini: false,
    groq: false,
    deepseek: false,
    openrouter: false
  });
  const [failoverRunning, setFailoverRunning] = useState(false);
  const [failoverResult, setFailoverResult] = useState(null);

  // Database Integrity Test
  const [dbRunning, setDbRunning] = useState(false);
  const [dbResult, setDbResult] = useState(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoadingStatuses(true);
    try {
      const res = await fetch('/api/debug/llm/status');
      const data = await res.json();
      if (data.success) {
        setStatuses(data.status);
      }
    } catch (err) {
      console.error('Failed to fetch LLM statuses:', err);
    } finally {
      setLoadingStatuses(false);
    }
  };

  const testProvider = async (name) => {
    setTestingProvider(name);
    try {
      const res = await fetch('/api/debug/llm/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerName: name })
      });
      const data = await res.json();
      setProviderResults(prev => ({
        ...prev,
        [name]: data
      }));
    } catch (err) {
      setProviderResults(prev => ({
        ...prev,
        [name]: { success: false, error: 'Network communication error.' }
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const runFailoverTest = async () => {
    setFailoverRunning(true);
    setFailoverResult(null);

    // List of keys marked as true for simulation
    const simulateFailuresList = Object.keys(simulatedFailures).filter(
      k => simulatedFailures[k]
    );

    try {
      const res = await fetch('/api/debug/llm/test-failover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateFailures: simulateFailuresList })
      });
      const data = await res.json();
      setFailoverResult(data);
    } catch (err) {
      setFailoverResult({ success: false, error: 'Failed to run failover simulation.' });
    } finally {
      setFailoverRunning(false);
    }
  };

  const runDbTest = async () => {
    setDbRunning(true);
    setDbResult(null);
    try {
      const res = await fetch('/api/debug/llm/test-db');
      const data = await res.json();
      setDbResult(data);
    } catch (err) {
      setDbResult({ success: false, error: 'Failed to complete DB verification.' });
    } finally {
      setDbRunning(false);
    }
  };

  const toggleSimulatedFailure = (name) => {
    setSimulatedFailures(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Activity size={22} className="animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                لوحة فحص ومراقبة LLM & Intelligent Failover 🧠
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              بيئة تشخيص ذكية وآمنة بالكامل للتحقق من تكامل المخدم ومزودي الذكاء الاصطناعي الأربعة.
            </p>
          </div>

          <button
            onClick={fetchStatuses}
            disabled={loadingStatuses}
            className="self-start sm:self-center px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loadingStatuses ? 'animate-spin' : ''} />
            <span>تحديث الحالة</span>
          </button>
        </div>

        {/* Security Warning Badge */}
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-3">
          <ShieldAlert className="text-teal-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-teal-300">تأمين تام وحماية البيانات الحساسة</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              جميع عمليات فحص المفاتيح والاتصال تدار بالكامل في الخوادم السحابية (Vercel Serverless Functions). لا يتم إرسال أو تسريب أي مفاتيح API إلى واجهة المستخدم (Client-side) مطلقًا.
            </p>
          </div>
        </div>

        {/* Section 1: Providers Status */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="text-emerald-400" size={18} />
            <h3 className="text-sm font-bold text-slate-200">حالة تهيئة مزودي الخدمة (Providers Config)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['gemini', 'groq', 'deepseek', 'openrouter'].map((name) => {
              const info = statuses?.[name];
              const isConfigured = info?.configured;
              return (
                <div 
                  key={name} 
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                    isConfigured 
                      ? 'bg-emerald-950/15 border-emerald-500/20' 
                      : 'bg-rose-950/10 border-rose-500/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-300">{name}</span>
                      {isConfigured ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> مفعّل
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <XCircle size={10} /> غير مفعّل
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-1">
                      النموذج: {info?.model || 'جاري التحميل...'}
                    </p>
                  </div>

                  <button
                    onClick={() => testProvider(name)}
                    disabled={!isConfigured || testingProvider !== null}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {testingProvider === name ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Play size={10} />
                    )}
                    <span>فحص اتصال مباشر</span>
                  </button>

                  {/* Provider results display */}
                  {providerResults[name] && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                      {providerResults[name].success ? (
                        <div className="text-[11px] space-y-1 text-emerald-300">
                          <p className="font-bold">✓ نجح الاتصال ({providerResults[name].latencyMs}ms)</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-950 p-2 rounded-lg truncate max-h-12 overflow-hidden">
                            {providerResults[name].response}
                          </p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-rose-400 leading-normal bg-rose-950/10 p-2 rounded-lg border border-rose-500/10">
                          ✕ فشل: {providerResults[name].error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Intelligent Failover Test Simulator */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="text-teal-400" size={18} />
            <h3 className="text-sm font-bold text-slate-200">محاكي تعطل الخدمات وفشل الانتقال التلقائي (Failover Simulator)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                حدد مزودي الخدمات الذين ترغب في محاكاة تعطلهم (مثل محاكاة خطأ HTTP 429 أو Timeout). سيتجاوزهم النظام تلقائيًا لينتقل للمزود التالي في الترتيب الصارم:
              </p>
              
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold bg-slate-950/50 p-2.5 rounded-xl border border-slate-900">
                <span className="text-emerald-400">Gemini</span>
                <ArrowRight size={10} className="text-slate-600" />
                <span className="text-yellow-400">Groq</span>
                <ArrowRight size={10} className="text-slate-600" />
                <span className="text-purple-400">DeepSeek</span>
                <ArrowRight size={10} className="text-slate-600" />
                <span className="text-teal-400">OpenRouter</span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300">اختر المزودين المراد محاكاة تعطلهم:</label>
                <div className="space-y-1.5">
                  {['gemini', 'groq', 'deepseek', 'openrouter'].map((name) => (
                    <div 
                      key={name}
                      onClick={() => toggleSimulatedFailure(name)}
                      className={`px-3 py-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        simulatedFailures[name]
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="uppercase font-bold">{name}</span>
                      <span className="text-[10px] font-mono">
                        {simulatedFailures[name] ? 'محاكاة التعطل (429/Timeout)' : 'يعمل طبيعيًا'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={runFailoverTest}
                disabled={failoverRunning}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-98 cursor-pointer"
              >
                {failoverRunning ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>تشغيل محاكاة الاستجابة والتعطل</span>
              </button>
            </div>

            <div className="md:col-span-3 bg-slate-950/50 rounded-2xl border border-slate-900 p-4 space-y-3 min-h-[220px] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-300 border-b border-slate-900 pb-2 mb-2">تقرير مسار انتقال الطلب الحالي (Trace Report):</h4>
                
                {failoverResult ? (
                  <div className="space-y-3.5">
                    <div className="space-y-2">
                      {failoverResult.stepsTaken?.map((step, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono">#{i+1}</span>
                            <span className="uppercase font-bold text-slate-300">{step.provider}</span>
                          </div>
                          <div>
                            {step.status === 'success' && (
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">استجابة ناجحة ✓</span>
                            )}
                            {step.status === 'simulated_failure' && (
                              <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">تعطيل محاكاة (429/Timeout) ⚡</span>
                            )}
                            {step.status === 'failed' && (
                              <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-full">فشل حقيقي ✕</span>
                            )}
                            {step.status === 'skipped' && (
                              <span className="text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">غير مهيأ</span>
                            )}
                            {step.status === 'fallback_success' && (
                              <span className="text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full">المصنع المحلي (Fallback Mock) 🌟</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded-xl space-y-1 border border-slate-800">
                      <p className="text-[10px] text-emerald-400 font-black">الاستجابة النهائية المتلقاة:</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-serif select-all">
                        "{failoverResult.finalResponse?.content}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800 mt-1.5">
                        <span>المزود الفعلي: <strong className="text-slate-300 uppercase">{failoverResult.finalResponse?.provider}</strong></span>
                        <span>الزمن: <strong className="text-slate-300">{failoverResult.finalResponse?.latencyMs}ms</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-10">اضغط على زر التشغيل لرؤية المسار المتخذ للانتقال التلقائي بين الخدمات.</p>
                )}
              </div>

              {failoverResult && failoverResult.stepsTaken?.some(s => s.status === 'simulated_failure') && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1.5 leading-normal shrink-0">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span>توضيح: نجح نظام الـ Failover في تحويل الطلب تلقائيًا دون إزعاج المستخدم.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Database Storage Integrity Test */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="text-emerald-400" size={18} />
            <h3 className="text-sm font-bold text-slate-200">فحص سلامة حفظ وتخزين البيانات (Database Integrity)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                يقوم هذا الفحص بإنشاء محادثة تجريبية افتراضية كاملة في قاعدة بيانات Supabase الحقيقية، وإدخال رسالة مستخدم، ثم إدخال رسالة المساعد مع الـ metadata المتقدمة للذكاء الاصطناعي (مثل الـ provider وزمن الاستجابة والرموز المستخدمة)، ثم يستعلم عنها للتحقق من سلامة البيانات ومطابقتها قبل تنظيفها وحذف المحادثة للحفاظ على نظافة السجلات.
              </p>

              <button
                onClick={runDbTest}
                disabled={dbRunning}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {dbRunning ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                <span>بدء الفحص الآلي لقاعدة البيانات</span>
              </button>
            </div>

            <div className="bg-slate-950/50 rounded-2xl border border-slate-900 p-4 min-h-[140px] flex flex-col justify-center">
              {dbResult ? (
                dbResult.success ? (
                  <div className="space-y-2.5 text-xs text-emerald-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle size={15} />
                      <span>{dbResult.message}</span>
                    </div>
                    <div className="space-y-1 pl-4 border-r border-emerald-500/20 pr-4 mt-2">
                      <p>• حفظ الجلسة وتوافق العنوان: <strong className="text-emerald-400">ناجح ✓</strong></p>
                      <p>• حفظ ومزامنة رسالة المستخدم: <strong className="text-emerald-400">ناجح ✓</strong></p>
                      <p>• حفظ ومزامنة رد المساعد مع الـ metadata: <strong className="text-emerald-400">ناجح ✓</strong></p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-400 flex items-start gap-1.5 leading-normal">
                    <XCircle size={15} className="shrink-0 mt-0.5" />
                    <span>فشل الفحص: {dbResult.error}</span>
                  </div>
                )
              ) : (
                <p className="text-xs text-slate-500 text-center">اضغط على بدء الفحص لتشغيل اختبار التكامل والحفظ الآلي.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
