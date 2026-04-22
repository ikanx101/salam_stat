#!/bin/bash

# Script untuk menghentikan aplikasi As Salaam Finance Status
# Author: ikanx101.com
# Version: 1.0

echo "========================================="
echo "🛑 Menghentikan As Salaam Finance Status"
echo "========================================="

# Port yang digunakan aplikasi
PORT=2222

# Cari PID proses yang berjalan di port 2222
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
    echo "❌ Tidak ada aplikasi yang berjalan di port $PORT"
    echo "✅ Aplikasi sudah berhenti atau tidak berjalan"
    exit 0
fi

echo "📊 Informasi proses yang berjalan:"
echo "-----------------------------------------"
ps -p $PID -o pid,user,command

echo ""
echo "⚠️  Menghentikan proses dengan PID: $PID"

# Hentikan proses dengan SIGTERM (graceful shutdown)
kill $PID

# Tunggu 3 detik untuk proses shutdown
sleep 3

# Cek apakah proses masih berjalan
if ps -p $PID > /dev/null 2>&1; then
    echo "⚠️  Proses masih berjalan, menggunakan SIGKILL..."
    kill -9 $PID
    sleep 1
fi

# Verifikasi proses sudah berhenti
if ps -p $PID > /dev/null 2>&1; then
    echo "❌ Gagal menghentikan proses dengan PID: $PID"
    echo "💡 Coba jalankan perintah manual:"
    echo "   sudo kill -9 $PID"
    exit 1
else
    echo "✅ Aplikasi berhasil dihentikan"
    echo "✅ Port $PORT sekarang tersedia"
    
    # Cek apakah port sudah benar-benar bebas
    if lsof -ti:$PORT > /dev/null 2>&1; then
        echo "⚠️  Port $PORT masih digunakan oleh proses lain"
        echo "   PID baru: $(lsof -ti:$PORT)"
    else
        echo "✅ Port $PORT sudah bebas"
    fi
fi

echo ""
echo "========================================="
echo "📋 Status akhir:"
echo "-----------------------------------------"

# Tampilkan proses Node.js yang masih berjalan
NODE_PROCESSES=$(ps aux | grep -E "node.*server\.js" | grep -v grep)
if [ -n "$NODE_PROCESSES" ]; then
    echo "⚠️  Masih ada proses Node.js yang berjalan:"
    echo "$NODE_PROCESSES"
else
    echo "✅ Tidak ada proses Node.js yang berjalan"
fi

# Tampilkan port yang digunakan oleh Node.js
echo ""
echo "🔍 Port yang digunakan oleh Node.js:"
netstat -tulpn 2>/dev/null | grep -E ":(2222|3000|8080|8000)" | grep -E "LISTEN.*node" || echo "   Tidak ada port Node.js yang aktif"

echo ""
echo "✨ Aplikasi As Salaam Finance Status telah dihentikan"
echo "💡 Untuk menjalankan kembali: ./start.sh atau node server.js"
echo "========================================="