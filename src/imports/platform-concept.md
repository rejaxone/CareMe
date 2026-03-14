Konsep Platform

Platform ini harus bekerja seperti marketplace layanan.
Terdapat dua jenis pengguna utama:

Pencari jasa (Customer)
Orang yang ingin menyewa pendamping pasien.

Penyedia jasa (Caregiver)
Orang yang menyediakan jasa pendampingan pasien.

Selain itu terdapat Admin yang mengelola sistem.

Halaman Pendaftaran Akun

Ketika pengguna membuka halaman Sign Up, tampilkan pilihan jenis akun:

Pilihan jenis akun:

Saya mencari jasa pendamping pasien

Saya ingin menjadi penyedia jasa pendamping pasien

Setelah memilih jenis akun, pengguna melanjutkan ke form pendaftaran akun dasar.

Form Pendaftaran Akun Dasar

Field yang harus diisi:

Nama lengkap

Email

Nomor telepon

Password

Konfirmasi password

Setelah mendaftar:

kirim verifikasi email

kirim OTP ke nomor telepon

Akun baru aktif setelah verifikasi berhasil.

Proses Khusus Jika Mendaftar Sebagai Penyedia Jasa

Jika pengguna memilih penyedia jasa, maka setelah pendaftaran akun dasar mereka harus mengisi form pendaftaran penyedia jasa yang lebih lengkap.

Status akun penyedia jasa:

Pending Verification

Under Review

Approved

Rejected

Profil penyedia jasa hanya muncul di marketplace jika statusnya Approved.

Form Data Diri Penyedia Jasa

Field yang harus diisi:

Foto profil
Jenis kelamin
Tanggal lahir
Alamat lengkap
Kota domisili
Nomor KTP
Upload foto KTP

Form Informasi Profesional

Field:

Deskripsi diri
Pengalaman dalam merawat pasien
Keahlian atau kemampuan khusus (misalnya membantu makan, menemani ngobrol, membantu mobilitas pasien)
Bahasa yang dikuasai
Karakter atau kepribadian (misalnya ramah, sabar, komunikatif)

Informasi Tarif

Penyedia jasa menentukan tarif sendiri.

Field:

Tarif per jam
Jumlah jam maksimal kerja per hari

Jadwal Ketersediaan

Field:

Hari kerja yang tersedia
Jam mulai bekerja
Jam selesai bekerja

Area Layanan

Field:

Kota layanan
Preferensi rumah sakit tertentu (opsional)
Jarak maksimal layanan dalam kilometer

Verifikasi Identitas

Field tambahan:

Selfie dengan memegang KTP
Nomor rekening bank
Nomor kontak darurat

Surat Pernyataan Penyedia Jasa

Sebelum menyelesaikan pendaftaran, tampilkan surat pernyataan digital yang harus disetujui.

Isi pernyataan:

Saya menyatakan bahwa semua data yang saya berikan adalah benar dan dapat dipertanggungjawabkan. Saya bersedia menjalankan tugas sebagai pendamping pasien dengan penuh tanggung jawab, menjaga etika, tidak melakukan tindakan melanggar hukum, serta menjaga privasi pasien dan keluarga pasien.

Field:

Checkbox persetujuan
Tanda tangan digital
Tanggal

Persetujuan Syarat dan Ketentuan

Pengguna harus mencentang persetujuan terhadap:

Syarat dan ketentuan platform

Kode etik penyedia jasa

Halaman Marketplace

Halaman ini menampilkan daftar penyedia jasa dalam bentuk card layout.

Setiap card menampilkan:

Foto profil
Nama
Jenis kelamin
Kepribadian singkat
Kota
Rating
Tarif per jam
Status ketersediaan

Sistem Filter Marketplace

User dapat memfilter berdasarkan:

Lokasi
Jenis kelamin
Rating
Harga
Ketersediaan jadwal

Halaman Profil Penyedia Jasa

Ketika card diklik, tampil halaman profil lengkap.

Tampilkan:

Foto profil besar
Nama lengkap
Deskripsi diri
Pengalaman
Kepribadian
Bahasa yang dikuasai
Rating dan review dari pelanggan sebelumnya
Tarif per jam
Kalender ketersediaan

Terdapat tombol:

Book Now

Sistem Booking

Booking terdiri dari beberapa tahap.

Tahap 1

Pilih tanggal dan waktu layanan.

Field:

Tanggal booking
Jam mulai
Jam selesai

Sistem otomatis menghitung total jam.

Tahap 2

Isi informasi pasien.

Field:

Nama pasien
Nama rumah sakit
Alamat rumah sakit
Nomor kamar
Tujuan pendampingan
Instruksi khusus
Kontak darurat keluarga

Tahap 3

Halaman review booking.

Tampilkan ringkasan:

Nama caregiver
Tanggal
Jam
Total jam
Harga total

Status Booking

Booking memiliki status berikut:

Pending
Accepted
Rejected
Awaiting Payment
Paid
Completed
Cancelled

Alur Persetujuan Penyedia Jasa

Setelah customer membuat booking, caregiver menerima notifikasi.

Caregiver dapat memilih:

Accept booking
Reject booking

Jika caregiver menerima:

status booking berubah menjadi Awaiting Payment.

Jika caregiver menolak:

customer harus memilih caregiver lain.

Sistem Pembayaran

Pembayaran dilakukan melalui Mayar.

Ketika customer melanjutkan pembayaran, arahkan ke link berikut:

https://galaxy-guardian.myr.id/pl/careme

Metode pembayaran yang tersedia:

QRIS
Virtual Account
E-Wallet
Credit Card

Setelah pembayaran berhasil:

sistem menerima webhook dari payment gateway
status booking berubah menjadi Paid

Sistem Rating dan Review

Setelah layanan selesai, customer dapat memberikan:

Rating 1 sampai 5
Review teks

Rating akan mempengaruhi skor penyedia jasa di marketplace.

Sistem Notifikasi

Gunakan dua jenis notifikasi:

Email
In-app notification

Event notifikasi:

Booking request
Booking accepted
Booking rejected
Payment required
Payment success
Booking reminder

Dashboard Customer

Customer dapat melihat:

Riwayat booking
Status booking
Profil caregiver yang pernah disewa
Review yang telah diberikan

Dashboard Penyedia Jasa

Caregiver dapat melihat:

Permintaan booking baru
Jadwal kerja
Riwayat pekerjaan
Total penghasilan
Rating dan review

Admin Panel

Admin dapat:

Memverifikasi penyedia jasa
Menyetujui atau menolak pendaftaran caregiver
Melihat semua booking
Mengelola user
Menangani dispute
Melihat statistik pembayaran

Desain UI

Gunakan desain modern dengan tema kesehatan.

Warna utama:

Biru muda
Putih
Abu abu terang

Layout harus responsif untuk desktop dan mobile.

Fitur Keamanan yang Direkomendasikan

Tambahkan:

Verifikasi identitas caregiver
Moderasi review
Log aktivitas pengguna
Panic button untuk caregiver

Tujuan Platform

Tujuan utama platform ini adalah membantu keluarga yang tidak bisa menemani pasien secara langsung dengan menyediakan pendamping terpercaya yang dapat menemani pasien di rumah sakit.