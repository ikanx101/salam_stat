#!/bin/bash

# Script untuk menjalankan aplikasi As Salaam Finance Status
# Author: ikanx101.com
# Version: 1.0

echo "========================================="
echo "🚀 Menjalankan As Salaam Finance Status"
echo "========================================="

# Port yang digunakan aplikasi
PORT=2222

# Cek apakah aplikasi sudah berjalan
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "⚠️  Aplikasi sudah berjalan di port $PORT"
    echo "💡 Gunakan ./stop.sh untuk menghentikan terlebih dahulu"
    exit 1
fi

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "💡 Install Node.js terlebih dahulu:"
    echo "   Ubuntu/Debian: sudo apt install nodejs npm"
    echo "   MacOS: brew install node"
    echo "   Windows: Download dari nodejs.org"
    exit 1
fi

# Cek apakah file server.js ada
if [ ! -f "server.js" ]; then
    echo "❌ File server.js tidak ditemukan!"
    echo "💡 Pastikan Anda berada di direktori yang benar"
    exit 1
fi

# Cek versi Node.js
NODE_VERSION=$(node -v)
echo "📦 Node.js version: $NODE_VERSION"

# Cek apakah dependencies sudah terinstall
if [ ! -d "node_modules" ]; then
    echo "📦 Menginstall dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Gagal menginstall dependencies"
        exit 1
    fi
    echo "✅ Dependencies berhasil diinstall"
fi

# Jalankan aplikasi di background
echo "▶️  Menjalankan server..."
nohup node server.js > server.log 2>&1 &

# Simpan PID
SERVER_PID=$!
echo $SERVER_PID > server.pid

# Tunggu 2 detik untuk server startup
sleep 2

# Cek apakah server berjalan
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Server berjalan dengan PID: $SERVER_PID"
    echo "✅ Log disimpan di: server.log"
    echo "✅ PID disimpan di: server.pid"
else
    echo "❌ Gagal menjalankan server"
    echo "💡 Cek file server.log untuk detail error"
    exit 1
fi

# Cek apakah port terbuka
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "✅ Port $PORT terbuka"
else
    echo "⚠️  Port $PORT belum terbuka, menunggu..."
    sleep 3
    if lsof -ti:$PORT > /dev/null 2>&1; then
        echo "✅ Port $PORT sekarang terbuka"
    else
        echo "❌ Port $PORT masih belum terbuka"
        echo "💡 Cek file server.log untuk detail error"
        exit 1
    fi
fi

echo ""
echo "========================================="
echo "🌐 Aplikasi berjalan di:"
echo "   http://localhost:$PORT"
echo ""
echo "🔐 Password autentikasi: Suntea101"
echo ""
echo "📋 Fitur yang tersedia:"
echo "   • Tambah transaksi dengan password"
echo "   • Edit transaksi per baris"
echo "   • Hapus semua transaksi"
echo "   • Export ke CSV"
echo "   • Laporan saldo real-time"
echo ""
echo "🛑 Untuk menghentikan: ./stop.sh"
echo "📝 Untuk melihat log: tail -f server.log"
echo "========================================="

# Tampilkan beberapa baris terakhir dari log
echo ""
echo "📄 Log terakhir:"
echo "-----------------------------------------"
tail -5 server.log