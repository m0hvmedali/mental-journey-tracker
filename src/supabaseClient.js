// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://urzxbbqelpnzitqvffhs.supabase.co'  // ← غيّره ببياناتك
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyenhiYnFlbHBueml0cXZmZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDE3MjAsImV4cCI6MjA2ODYxNzcyMH0._PQVKc-3lwovmGczX-rT0K0oHQVFktg0-0koEp3AM64'

export const supabase = createClient(supabaseUrl, supabaseKey)
