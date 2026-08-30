import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ------------------------------------------------------------------
// Supabase client (edge function)
const supabaseUrl = Deno.env.get('SUPABASE_DB_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SSSUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// OneSignal credentials
const ONE_SIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID') ?? '';
const ONE_SIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY') ?? '';

async function sendOneSignalNotification(
  playerId: string,
  title: string,
  body: string,
) {
  const payload = {
    app_id: ONE_SIGNAL_APP_ID,
    include_player_ids: [playerId],
    headings: { en: title },
    contents: { en: body },
  };

  const resp = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error('OneSignal error:', resp.status, txt);
    throw new Error('OneSignal request failed');
  }
}

function shouldFire(timeStr: string, now: Date): boolean {
  const [h, m] = timeStr.split(':').map(Number);
  const scheduled = new Date(now);
  scheduled.setHours(h, m, 0, 0);
  const diff = Math.abs(now.getTime() - scheduled.getTime());
  return diff < 60_000; // 1 minute window
}

// نقطة البداية لتشغيل الدالة
Deno.serve(async (_req) => {
  try {
    const now = new Date();

    // 1️⃣ جلب جميع القوالب المجدولة
    const { data: templates, error: tempError } = await supabase
      .from('notification_templates')
      .select('title, body, send_time');

    if (tempError) {
      console.error('Failed to fetch templates:', tempError);
      return new Response(JSON.stringify({ error: tempError.message }), { status: 500 });
    }

    // 2️⃣ تصفية القوالب المطلوبة في هذا التوقيت فقط
    const activeTemplates = (templates || []).filter(t => shouldFire(t.send_time, now));

    if (activeTemplates.length === 0) {
      return new Response(JSON.stringify({ message: 'No notifications scheduled for this minute' }), { status: 200 });
    }

    // 3️⃣ جلب المستخدمين المفعلين لاستقبال الإشعارات
    const { data: settings, error } = await supabase
      .from('notification_settings')
      .select('user_id, player_id')
      .eq('push_enabled', true);

    if (error) {
      console.error('Failed to fetch settings:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // 4️⃣ إرسال الإشعارات المستحقة
    for (const t of activeTemplates) {
      for (const s of settings as any[]) {
        if (!s.player_id) continue;

        try {
          await sendOneSignalNotification(s.player_id, t.title, t.body);
          
          // حفظ العملية في السجلات
          await supabase.from('notification_logs').insert({
            user_id: s.user_id,
            type: 'scheduled_alert',
            payload: { title: t.title, body: t.body, send_time: t.send_time },
          });
        } catch (sendErr) {
          console.error(`Failed to send notification to user ${s.user_id}:`, sendErr);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Notifications processed successfully' }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
