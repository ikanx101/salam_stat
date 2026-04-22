#!/bin/bash

# Script untuk restart aplikasi As Salaam Finance Status
# Author: ikanx101.com
# Version: 1.0

echo "========================================="
echo "🔄 Restart As Salaam Finance Status"
echo "========================================="

# Cek apakah script stop.sh dan start.sh ada
if [ ! -f "stop.sh" ] || [ ! -f "start.sh" ]; then
    echo "❌ Script stop.sh atau start.sh tidak ditemukan!"
    echo "💡 Pastikan Anda berada di direktori yang benar"
    exit 1
fi

# Berikan permission jika belum ada
if [ ! -x "stop.sh" ]; then
    chmod +x stop.sh
fi

if [ ! -x "start.sh" ]; then
    chmod +x start.sh
fi

# Hentikan aplikasi terlebih dahulu
echo "⏹️  Menghentikan aplikasi..."
./stop.sh

# Tunggu 2 detik untuk memastikan proses benar-benar berhenti
sleep 2

# Jalankan aplikasi kembali
echo ""
echo "▶️  Menjalankan aplikasi kembali..."
./start.sh

echo ""
echo "========================================="
echo "✅ Restart selesai!"
echo "🌐 Aplikasi berjalan di: http://localhost:2222"
echo "========================================="