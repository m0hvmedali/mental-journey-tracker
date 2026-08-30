-- Migration: create notification_settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  push_enabled boolean NOT NULL DEFAULT false,
  player_id text,
  daily_enabled boolean NOT NULL DEFAULT false,
  daily_time varchar(5),            -- format "HH:MM"
  gratitude_enabled boolean NOT NULL DEFAULT false,
  gratitude_time varchar(5),       -- format "HH:MM"
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
