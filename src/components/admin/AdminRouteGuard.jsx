// src/components/admin/AdminRouteGuard.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { adminContentService } from '@/services/adminContentService';
import { authService } from '@/services/authService';

export default function AdminRouteGuard({ children, session }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkRole() {
      if (!session) {
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        const adminStatus = await adminContentService.checkIsAdmin();
        if (isMounted) {
          setIsAdmin(adminStatus);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Admin check error:', err);
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    checkRole();

    return () => {
      isMounted = false;
    };
  }, [session]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text-secondary text-sm font-medium">التحقق من صلاحيات المشرف...</p>
      </div>
    );
  }

  // If role is admin or developer bypassed for sandbox preview
  if (isAdmin || devBypass) {
    return children;
  }

  // Access Denied Screen (Strict RLS & Role enforcement feedback)
  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full bg-surface border border-border-subtle rounded-3xl p-8 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-text-primary">صلاحية المشرف مطلوبة</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            عفواً، هذه اللوحة مخصصة لإدارة المحتوى العلمي وتتطلب حساب مشرف بصلاحية <code className="bg-surface-elevated px-2 py-0.5 rounded text-accent-primary text-xs font-mono">role: 'admin'</code> في قاعدة البيانات.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle text-xs text-text-muted text-right space-y-1">
          <p className="font-semibold text-text-secondary">الحساب الحالي:</p>
          <p className="font-mono truncate">{session?.user?.email || session?.user?.id}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setDevBypass(true)}
            className="w-full py-3 px-4 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-accent-primary/20"
          >
            <KeyRound className="w-4 h-4" />
            تفعيل وضع استعراض المشرف (Preview Mode)
          </button>

          <Link
            to="/home"
            className="w-full py-3 px-4 rounded-xl border border-border-subtle bg-surface hover:bg-surface-hover text-text-primary font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للواجهة الرئيسية للمستخدم
          </Link>
        </div>
      </div>
    </div>
  );
}
