===========================================
📋 README - AS SALAAM FINANCE STATUS
===========================================

📌 DESKRIPSI APLIKASI
Aplikasi web As Salaam Finance Status berbasis Node.js untuk mencatat dan mengelola 
transaksi kas Musholla As Salaam Cluster Citra Residence Bekasi.

🌟 FITUR UTAMA:
1. 📝 Input transaksi uang masuk/keluar
2. 💰 Perhitungan saldo otomatis
3. 📊 Riwayat transaksi dengan filter
4. 📈 Statistik keuangan (total masuk/keluar)
5. 💾 Penyimpanan data ke file JSON
6. 📤 Export data ke format CSV
7. 🗑️ Hapus semua data transaksi
8. 🎨 Interface user-friendly dengan desain Islami modern
9. 📥 Download laporan CSV
10. ⚠️ Konfirmasi sebelum hapus data
11. 🔐 Sistem autentikasi password
12. 🕌 Kategori khusus musholla

📁 STRUKTUR FILE:
- server.js          : File utama aplikasi Node.js
- package.json       : Konfigurasi dependensi Node.js
- transactions.json  : Database transaksi (JSON)
- readme.txt         : File panduan ini

🚀 CARA MENJALANKAN APLIKASI:

LANGKAH 1: INSTALASI NODE.JS
Pastikan Node.js sudah terinstall di komputer Anda.
Cek dengan perintah:
  node --version
  npm --version

Jika belum terinstall, download dari: https://nodejs.org/

LANGKAH 2: INSTALASI DEPENDENSI
Buka terminal/command prompt, masuk ke folder aplikasi:
  cd /home/ikanx101/Documents/Aplikasi\ 1

Kemudian install dependensi:
  npm install

LANGKAH 3: JALANKAN APLIKASI
Ada dua cara menjalankan aplikasi:

CARA 1: Mode produksi (standard)
  npm start
  atau
  node server.js

CARA 2: Mode development (dengan auto-restart)
  npm run dev
  (Pastikan nodemon sudah terinstall: npm install -g nodemon)

LANGKAH 4: AKSES APLIKASI
Buka browser dan kunjungi:
  http://localhost:2222

🎯 CARA PENGGUNAAN:

1. TAMBAH TRANSAKSI BARU:
   - Isi deskripsi transaksi
   - Masukkan jumlah uang (Rp)
   - Pilih jenis: Uang Masuk atau Uang Keluar
   - Pilih tanggal dan kategori
   - Tambahkan catatan (opsional)
   - Klik "Simpan Transaksi"

2. MELIHAT RIWAYAT:
   - Semua transaksi ditampilkan di panel kanan
   - Transaksi terbaru muncul di atas
   - Warna hijau = uang masuk, Merah = uang keluar

3. STATISTIK:
   - Saldo saat ini ditampilkan di kartu hijau
   - Total uang masuk dan keluar di bagian bawah

4. EKSPOR DATA:
   - Untuk export ke CSV, kunjungi:
     http://localhost:2222/export-csv

5. RESET DATA:
   - Untuk menghapus semua transaksi, gunakan endpoint:
     POST /reset-transactions
     (Bisa diakses via Postman atau curl)

🔧 API ENDPOINTS:

GET  /                         : Halaman utama aplikasi
GET  /api/transactions         : Mendapatkan semua transaksi (JSON)
POST /add-transaction          : Menambah transaksi baru (dengan autentikasi password)
POST /delete-all-transactions  : Menghapus semua transaksi (dengan autentikasi password)
GET  /export-csv               : Export data ke CSV (download file)

🔐 AUTENTIKASI:
- Password tambah transaksi: Suntea101
- Password hapus data: Delete123!
- Hanya untuk menambah transaksi baru dan menghapus semua data
- Tidak diperlukan untuk melihat data atau export

📊 FORMAT DATA TRANSAKSI:
Setiap transaksi memiliki format:
{
  "id": 1743370920000,           // ID unik (timestamp)
  "description": "Gaji Bulanan", // Deskripsi transaksi
  "amount": 5000000,             // Jumlah uang
  "type": "masuk",               // "masuk" atau "keluar"
  "date": "2026-03-30",          // Tanggal transaksi
  "category": "gaji",            // Kategori transaksi
  "notes": "Catatan tambahan",   // Catatan opsional
  "createdAt": "2026-03-30T12:42:00.000Z" // Waktu dibuat
}

🛠️ TROUBLESHOOTING:

1. PORT 2222 SUDAH DIGUNAKAN:
   - Ubah PORT di file server.js (baris 7)
   - Restart aplikasi

2. ERROR "MODULE NOT FOUND":
   - Pastikan sudah menjalankan: npm install
   - Hapus folder node_modules dan package-lock.json, lalu:
     npm install

3. DATA TIDAK TERSIMPAN:
   - Pastikan folder memiliki permission write
   - Cek file transactions.json bisa diakses

4. APLIKASI TIDAK BISA DIJALANKAN:
   - Pastikan Node.js versi 14 atau lebih baru
   - Cek error di terminal

🔐 KEAMANAN:
- Aplikasi ini hanya untuk penggunaan lokal (localhost)
- Tidak ada autentikasi (karena untuk demo)
- Data disimpan dalam file JSON lokal

📈 FITUR YANG BISA DITAMBAHKAN:
1. Autentikasi user
2. Grafik statistik (Chart.js)
3. Filter transaksi berdasarkan tanggal/kategori
4. Backup data otomatis
5. Multi-user support
6. Mobile app version

👨‍💻 TEKNOLOGI YANG DIGUNAKAN:
- Node.js (Runtime JavaScript)
- Express.js (Web framework)
- HTML5, CSS3, JavaScript (Frontend)
- JSON (Database sederhana)

📞 DUKUNGAN:
Jika mengalami masalah, cek:
1. Error message di terminal
2. Console browser (F12 → Console)
3. File log aplikasi

Atau buat issue di repository (jika menggunakan version control)

🎉 SELAMAT MENCOBA!
Aplikasi ini dibuat oleh mariBOT untuk membantu pengelolaan kas Musholla As Salaam.
Semoga bermanfaat dan membawa berkah! 💰📊🕌

===========================================
© 2026 As Salaam Finance Status | Dibuat oleh ikanx101.com
===========================================