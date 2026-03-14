{
  "task": "fix_user_registration_and_auth_system",
  "project_name": "CareMe",
  "goal": "Memperbaiki bug dimana user yang mendaftar menggunakan email dan password tidak tersimpan di database dan login Google menyebabkan redirect loop.",
  "tech_stack": {
    "frontend": "React",
    "backend": "Supabase",
    "authentication": "Supabase Auth",
    "database": "PostgreSQL"
  },

  "instructions_for_ai": [
    "Scan project folder untuk menemukan file yang berhubungan dengan Supabase auth",
    "Jika belum ada, buat folder /lib untuk konfigurasi Supabase",
    "Pastikan Supabase client dibuat satu kali dan digunakan global",
    "Perbaiki fungsi signup agar data user juga disimpan ke database table profiles",
    "Tambahkan sistem pengecekan session setelah login",
    "Tambahkan auth state listener untuk menangani login redirect"
  ],

  "files_to_create": [
    {
      "path": "lib/supabaseClient.js",
      "description": "File untuk inisialisasi Supabase client",
      "code": "import { createClient } from '@supabase/supabase-js'; const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; export const supabase = createClient(supabaseUrl, supabaseKey);"
    },

    {
      "path": "lib/auth.js",
      "description": "Helper functions untuk login dan signup",
      "code": "import { supabase } from './supabaseClient'; export const signUpUser = async (name, email, password) => { const { data, error } = await supabase.auth.signUp({ email, password }); if (error) return { error }; if (data.user) { await supabase.from('profiles').insert([{ id: data.user.id, name: name, email: email }]); } return { data }; }; export const loginWithGoogle = async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); };"
    }
  ],

  "database_tasks": [
    "Buat tabel profiles jika belum ada",
    "Hubungkan profiles.id dengan auth.users.id"
  ],

  "sql_schema": "create table if not exists profiles ( id uuid primary key references auth.users(id) on delete cascade, name text, email text, created_at timestamp default now() );",

  "rls_policies": [
    "enable row level security on profiles",
    "create policy \"Users can insert their own profile\" on profiles for insert with check (auth.uid() = id)",
    "create policy \"Users can view their own profile\" on profiles for select using (auth.uid() = id)"
  ],

  "session_handling": [
    "Tambahkan fungsi untuk mengecek session saat aplikasi load",
    "Jika session ada redirect ke dashboard",
    "Jika tidak ada tampilkan login page"
  ],

  "session_code": "const { data: { session } } = await supabase.auth.getSession(); if(session){ window.location.href='/dashboard'; }",

  "auth_listener": "supabase.auth.onAuthStateChange((event, session) => { console.log('[CareMe Auth]', event); if(session){ window.location.href='/dashboard'; } });",

  "expected_result": [
    "User signup email berhasil",
    "User tersimpan di auth.users",
    "User profile tersimpan di profiles table",
    "Google login tidak loop",
    "Session tetap ada setelah refresh"
  ]
}