-- Create notification settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  daily_reminder boolean NOT NULL DEFAULT false,
  gratitude_reminder boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
