#!/bin/bash

echo "==========================================="
echo "🚀 MENJALANKAN AS SALAAM FINANCE STATUS"
echo "==========================================="
echo ""

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js tidak ditemukan!"
    echo "Silakan install Node.js dari: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js terdeteksi: $(node --version)"
echo "✅ npm terdeteksi: $(npm --version)"
echo ""

# Cek apakah folder node_modules ada
if [ ! -d "node_modules" ]; then
    echo "📦 Menginstall dependensi..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Gagal menginstall dependensi!"
        exit 1
    fi
    echo "✅ Dependensi berhasil diinstall"
else
    echo "✅ Dependensi sudah terinstall"
fi

echo ""
echo "==========================================="
echo "🌐 MENJALANKAN SERVER..."
echo "==========================================="
echo ""
echo "📊 Aplikasi akan berjalan di:"
echo "   🔗 http://localhost:2222"
echo ""
echo "📁 Data transaksi: transactions.json"
echo ""
echo "🛑 Tekan Ctrl+C untuk menghentikan server"
echo "==========================================="
echo ""

# Jalankan server
npm start