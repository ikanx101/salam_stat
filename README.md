# As Salaam Finance Status

Sistem Laporan Kas Musholla As Salaam Cluster Citra Residence Bekasi

## 📋 Deskripsi

Aplikasi web untuk mencatat dan melaporkan transaksi kas musholla dengan fitur autentikasi password.

## ✨ Fitur

- ✅ **Tambah Transaksi** dengan password autentikasi
- ✅ **Edit Transaksi** per baris dengan password yang sama
- ✅ **Hapus Semua Data** dengan password khusus
- ✅ **Export ke CSV** untuk backup data
- ✅ **Laporan Saldo** real-time
- ✅ **Riwayat Transaksi** dengan filter kategori
- ✅ **Responsive Design** untuk semua device

## 🔐 Password Autentikasi

- **Password Tambah/Edit Transaksi:** `Suntea101`
- **Password Hapus Semua Data:** `Suntea101` (sama)

## 🚀 Instalasi & Menjalankan

### Prasyarat
- Node.js v14 atau lebih baru
- npm (Node Package Manager)

### Cara 1: Menggunakan Script (Recommended)
```bash
# Berikan permission eksekusi
chmod +x start.sh stop.sh restart.sh

# Jalankan aplikasi
./start.sh

# Hentikan aplikasi
./stop.sh

# Restart aplikasi
./restart.sh
```

### Cara 2: Manual
```bash
# Install dependencies
npm install

# Jalankan server
node server.js

# Server akan berjalan di http://localhost:2222
```

## 📁 Struktur File

```
Aplikasi 1/
├── server.js              # Server utama (Node.js + Express)
├── transactions.json      # Database transaksi (auto-generated)
├── start.sh              # Script untuk menjalankan aplikasi
├── stop.sh               # Script untuk menghentikan aplikasi
├── restart.sh            # Script untuk restart aplikasi
├── server.log            # Log file (auto-generated)
├── server.pid            # PID file (auto-generated)
├── README.md             # Dokumentasi ini
└── node_modules/         # Dependencies (auto-generated)
```

## 🔧 Script Management

### `start.sh`
- Cek dependencies dan install jika diperlukan
- Jalankan server di background
- Simpan log ke `server.log`
- Simpan PID ke `server.pid`
- Tampilkan informasi akses

### `stop.sh`
- Hentikan server secara graceful
- Cek dan kill proses jika masih berjalan
- Verifikasi port sudah bebas
- Tampilkan status akhir

### `restart.sh`
- Hentikan dan jalankan kembali aplikasi
- Kombinasi dari `stop.sh` dan `start.sh`

## 🌐 Akses Aplikasi

Setelah server berjalan, akses melalui:
- **URL:** http://localhost:2222
- **Port:** 2222

## 📊 Fitur Edit Transaksi

### Cara Mengedit Transaksi:
1. Buka aplikasi di browser
2. Cari transaksi yang ingin diedit
3. Klik tombol **✏️ Edit** di kanan atas transaksi
4. Input password: `Suntea101`
5. Edit data yang diperlukan
6. Klik **💾 Simpan Perubahan**

### Data yang bisa diedit:
- Deskripsi transaksi
- Jumlah (Rp)
- Jenis (Masuk/Keluar)
- Tanggal
- Kategori
- Catatan tambahan

## 📈 Export Data

### Export ke CSV:
1. Klik tombol **📥 Export CSV** di halaman utama
2. File akan didownload dengan nama `kas-musholla-as-salaam.csv`
3. Format CSV dengan kolom lengkap termasuk timestamp edit

## 🛠️ Troubleshooting

### Port 2222 sudah digunakan:
```bash
# Cek proses yang menggunakan port 2222
lsof -ti:2222

# Hentikan proses
kill -9 $(lsof -ti:2222)

# Atau gunakan script stop.sh
./stop.sh
```

### Node.js tidak ditemukan:
```bash
# Install Node.js
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# MacOS
brew install node

# Windows: Download dari nodejs.org
```

### Dependencies error:
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

## 📝 Logging

- **Log file:** `server.log` (auto-generated)
- **Monitor log:** `tail -f server.log`
- **PID file:** `server.pid` (menyimpan PID proses)

## 🔒 Keamanan

- Password disimpan di server-side (tidak di client-side)
- Validasi input untuk mencegah injection
- Audit trail dengan timestamp create/update
- Hanya untuk penggunaan internal

## 👥 Kontribusi

Dibuat oleh **ikanx101.com** untuk Musholla As Salaam Cluster Citra Residence Bekasi.

## 📄 Lisensi

Untuk penggunaan internal Musholla As Salaam Cluster Citra Residence Bekasi.

---

**💡 Tips:**
- Backup file `transactions.json` secara berkala
- Gunakan password yang kuat untuk produksi
- Monitor log untuk debugging
- Test fitur edit sebelum digunakan di produksi