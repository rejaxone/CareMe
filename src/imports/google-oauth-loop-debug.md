{
  "task": "debug_google_oauth_login_loop",
  "project_name": "CareMe",
  "problem_description": "User berhasil login menggunakan Google OAuth melalui Supabase, tetapi setelah login halaman kembali ke login page dan terjadi login loop.",
  "tech_stack": {
    "frontend": "React / Figma generated site",
    "backend": "Supabase Auth",
    "authentication": "Google OAuth",
    "database": "Supabase PostgreSQL"
  },
  "expected_behavior": [
    "User klik login dengan Google",
    "Google OAuth muncul",
    "User login berhasil",
    "Supabase membuat session",
    "User diarahkan ke dashboard",
    "User tetap login ketika refresh halaman"
  ],
  "current_behavior": [
    "Google login berhasil",
    "Setelah redirect user kembali ke halaman login",
    "Hal ini terjadi terus menerus (login loop)"
  ],
  "debug_tasks": [
    "Periksa apakah Supabase session tersimpan setelah login",
    "Tambahkan fungsi untuk mengecek session saat halaman dimuat",
    "Gunakan supabase.auth.getSession() untuk membaca session",
    "Gunakan supabase.auth.onAuthStateChange() untuk mendeteksi perubahan login",
    "Pastikan redirect setelah login menuju halaman dashboard",
    "Pastikan halaman login tidak otomatis redirect jika session sudah ada",
    "Tambahkan console log untuk memeriksa session dan user"
  ],
  "required_code_checks": [
    "Cek implementasi supabase.auth.signInWithOAuth",
    "Cek apakah redirectTo sudah benar",
    "Cek apakah frontend membaca session dari Supabase",
    "Cek apakah session disimpan di local storage atau cookie",
    "Cek apakah login page memeriksa session sebelum redirect"
  ],
  "recommended_solution": {
    "login_function": "Gunakan supabase.auth.signInWithOAuth dengan redirectTo ke domain aplikasi",
    "session_check": "Gunakan supabase.auth.getSession saat halaman dimuat",
    "auth_listener": "Gunakan supabase.auth.onAuthStateChange untuk mendeteksi login",
    "redirect_logic": "Jika session ada redirect ke dashboard"
  },
  "example_fix_code": {
    "check_session_on_load": "const { data: { session } } = await supabase.auth.getSession(); if(session){ window.location.href='/dashboard'; }",
    "auth_listener": "supabase.auth.onAuthStateChange((event, session) => { if(session){ window.location.href='/dashboard'; } })",
    "google_login": "await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://invite-patch-27950517.figma.site' }})"
  },
  "expected_result_after_fix": [
    "User login hanya sekali",
    "Session tersimpan",
    "User langsung masuk ke dashboard",
    "Tidak ada login loop"
  ]
}