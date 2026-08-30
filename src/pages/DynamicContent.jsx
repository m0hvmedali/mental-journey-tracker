// src/pages/DynamicContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RenderContentTemplate from '@/components/content/TemplateRegistry';
import { contentService } from '@/services/contentService';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function DynamicContent() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.getContentBySlug(slug);
      if (!data) {
        setError('المحتوى المطلوب غير موجود أو غير منشور حالياً.');
      } else {
        setItem(data);
      }
    } catch (err) {
      console.error('Error fetching dynamic content:', err);
      setError('حدث خطأ أثناء تحميل المحتوى. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-sm font-medium text-text-secondary">جاري تحميل المحتوى العلمي...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary mb-2 font-display">لم نتمكن من عرض المحتوى</h2>
        <p className="text-xs text-text-secondary mb-6 leading-relaxed">{error || 'المحتوى غير متوفر.'}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
          <Link
            to="/home"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-app pb-24 pt-6">
      <RenderContentTemplate content={item} />
    </div>
  );
}
