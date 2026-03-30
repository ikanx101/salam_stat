const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 2222;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// File untuk menyimpan transaksi
const TRANSACTIONS_FILE = 'transactions.json';

// Inisialisasi file transaksi jika belum ada
if (!fs.existsSync(TRANSACTIONS_FILE)) {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2));
}

// Baca transaksi dari file
function readTransactions() {
    try {
        const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions file:', error);
        return [];
    }
}

// Simpan transaksi ke file
function saveTransactions(transactions) {
    try {
        fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving transactions file:', error);
        return false;
    }
}

// Hitung total saldo
function calculateBalance(transactions) {
    let total = 0;
    transactions.forEach(transaction => {
        if (transaction.type === 'masuk') {
            total += transaction.amount;
        } else {
            total -= transaction.amount;
        }
    });
    return total;
}

// Routes

// Halaman utama
app.get('/', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>As Salaam Finance Status</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #1a5fb4 0%, #26a269 100%);
                    min-height: 100vh;
                    padding: 20px;
                    color: #333;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    overflow: hidden;
                }
                
                header {
                    background: linear-gradient(135deg, #1c71d8 0%, #2ec27e 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    font-family: 'Georgia', serif;
                }
                
                .subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }
                
                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    padding: 30px;
                }
                
                @media (max-width: 768px) {
                    .main-content {
                        grid-template-columns: 1fr;
                    }
                }
                
                .form-section, .transactions-section {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                h2 {
                    color: #1c71d8;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e9ecef;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #495057;
                }
                
                input, select, textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }
                
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #1c71d8;
                }
                
                .radio-group {
                    display: flex;
                    gap: 20px;
                    margin-top: 10px;
                }
                
                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .radio-option input[type="radio"] {
                    width: auto;
                }
                
                .btn {
                    background: linear-gradient(135deg, #1c71d8 0%, #2ec27e 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s, box-shadow 0.3s;
                    width: 100%;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(28, 113, 216, 0.3);
                }
                
                .btn-reset {
                    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                    margin-top: 10px;
                }
                
                .btn-export {
                    background: linear-gradient(135deg, #f6c343 0%, #e5a50a 100%);
                    margin-top: 10px;
                }
                
                .btn-delete {
                    background: linear-gradient(135deg, #a51d2d 0%, #7c1d2d 100%);
                    margin-top: 10px;
                }
                
                .balance-card {
                    background: linear-gradient(135deg, #26a269 0%, #2ec27e 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    text-align: center;
                    margin-bottom: 25px;
                    box-shadow: 0 10px 20px rgba(38, 162, 105, 0.3);
                }
                
                .balance-amount {
                    font-size: 3rem;
                    font-weight: bold;
                    margin: 10px 0;
                }
                
                .transaction-item {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    border-left: 5px solid #1c71d8;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                }
                
                .transaction-masuk {
                    border-left-color: #26a269;
                }
                
                .transaction-keluar {
                    border-left-color: #e53e3e;
                }
                
                .transaction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .transaction-type {
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                
                .type-masuk {
                    background: #c6f6d5;
                    color: #22543d;
                }
                
                .type-keluar {
                    background: #fed7d7;
                    color: #742a2a;
                }
                
                .transaction-amount {
                    font-size: 1.3rem;
                    font-weight: bold;
                }
                
                .amount-masuk {
                    color: #26a269;
                }
                
                .amount-keluar {
                    color: #e53e3e;
                }
                
                .transaction-date {
                    color: #718096;
                    font-size: 0.9rem;
                }
                
                .transaction-description {
                    margin-top: 10px;
                    color: #4a5568;
                }
                
                .no-transactions {
                    text-align: center;
                    color: #718096;
                    padding: 40px;
                    font-style: italic;
                }
                
                .summary {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .summary-item {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                }
                
                .summary-label {
                    font-size: 0.9rem;
                    color: #718096;
                    margin-bottom: 5px;
                }
                
                .summary-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                
                .summary-masuk {
                    color: #26a269;
                }
                
                .summary-keluar {
                    color: #e53e3e;
                }
                
                .action-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                footer {
                    text-align: center;
                    padding: 20px;
                    background: #f8f9fa;
                    color: #718096;
                    border-top: 1px solid #e9ecef;
                }
                
                .message {
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-weight: 600;
                }
                
                .success {
                    background: #c6f6d5;
                    color: #22543d;
                    border: 1px solid #9ae6b4;
                }
                
                .error {
                    background: #fed7d7;
                    color: #742a2a;
                    border: 1px solid #fc8181;
                }
                
                .warning {
                    background: #feebc8;
                    color: #744210;
                    border: 1px solid #fbd38d;
                }
                
                .delete-confirm {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .delete-modal {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                
                .delete-modal h3 {
                    color: #a51d2d;
                    margin-bottom: 15px;
                }
                
                .delete-modal p {
                    margin-bottom: 20px;
                    color: #4a5568;
                }
                
                .modal-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                }
                
                .modal-btn {
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .modal-cancel {
                    background: #e2e8f0;
                    color: #4a5568;
                }
                
                .modal-delete {
                    background: #a51d2d;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>As Salaam Finance Status</h1>
                    <p class="subtitle">Kelola keuangan dengan berkah dan ketenangan</p>
                </header>
                
                <div class="main-content">
                    <div class="form-section">
                        <h2>➕ Tambah Transaksi Baru</h2>
                        <form id="transactionForm" method="POST" action="/add-transaction">
                            <div class="form-group">
                                <label for="description">Deskripsi Transaksi:</label>
                                <input type="text" id="description" name="description" required 
                                       placeholder="Contoh: Gaji bulanan, Belanja kebutuhan, dll">
                            </div>
                            
                            <div class="form-group">
                                <label for="amount">Jumlah (Rp):</label>
                                <input type="number" id="amount" name="amount" required 
                                       min="1" placeholder="100000">
                            </div>
                            
                            <div class="form-group">
                                <label>Jenis Transaksi:</label>
                                <div class="radio-group">
                                    <div class="radio-option">
                                        <input type="radio" id="type_masuk" name="type" value="masuk" checked>
                                        <label for="type_masuk">Uang Masuk 💰</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" id="type_keluar" name="type" value="keluar">
                                        <label for="type_keluar">Uang Keluar 💸</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="date">Tanggal:</label>
                                <input type="date" id="date" name="date" required 
                                       value="${today}">
                            </div>
                            
                            <div class="form-group">
                                <label for="category">Kategori:</label>
                                <select id="category" name="category">
                                    <option value="gaji">Gaji/Pendapatan</option>
                                    <option value="investasi">Investasi</option>
                                    <option value="hadiah">Hadiah/Bonus</option>
                                    <option value="makanan">Makanan & Minuman</option>
                                    <option value="transportasi">Transportasi</option>
                                    <option value="belanja">Belanja</option>
                                    <option value="hiburan">Hiburan</option>
                                    <option value="kesehatan">Kesehatan</option>
                                    <option value="pendidikan">Pendidikan</option>
                                    <option value="sedekah">Sedekah/Zakat</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="notes">Catatan (opsional):</label>
                                <textarea id="notes" name="notes" rows="3" 
                                          placeholder="Tambahkan catatan jika diperlukan..."></textarea>
                            </div>
                            
                            <button type="submit" class="btn">💾 Simpan Transaksi</button>
                            <button type="button" onclick="resetForm()" class="btn btn-reset">🔄 Reset Form</button>
                        </form>
                        
                        <div class="action-buttons">
                            <button type="button" onclick="exportToCSV()" class="btn btn-export">📥 Export ke CSV</button>
                            <button type="button" onclick="showDeleteConfirm()" class="btn btn-delete">🗑️ Hapus Semua Data</button>
                        </div>
                    </div>
                    
                    <div class="transactions-section">
                        <div class="balance-card">
                            <h3>Saldo Saat Ini</h3>
                            <div class="balance-amount" id="currentBalance">Rp 0</div>
                            <p>Total dari semua transaksi</p>
                        </div>
                        
                        <h2>📋 Riwayat Transaksi</h2>
                        <div id="transactionsList">
                            <!-- Transaksi akan dimuat di sini -->
                        </div>
                        
                        <div class="summary">
                            <div class="summary-item">
                                <div class="summary-label">Total Uang Masuk</div>
                                <div class="summary-value summary-masuk" id="totalMasuk">Rp 0</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">Total Uang Keluar</div>
                                <div class="summary-value summary-keluar" id="totalKeluar">Rp 0</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer>
                    <p>© 2026 As Salaam Finance Status | Kelola keuangan dengan berkah</p>
                    <p>Aplikasi ini berjalan di localhost:${PORT}</p>
                </footer>
            </div>
            
            <!-- Modal Konfirmasi Hapus -->
            <div id="deleteConfirmModal" class="delete-confirm" style="display: none;">
                <div class="delete-modal">
                    <h3>⚠️ Konfirmasi Hapus Semua Data</h3>
                    <p>Apakah Anda yakin ingin menghapus SEMUA data transaksi? Tindakan ini tidak dapat dibatalkan dan semua data akan hilang permanen.</p>
                    <div class="modal-buttons">
                        <button type="button" onclick="hideDeleteConfirm()" class="modal-btn modal-cancel">❌ Batal</button>
                        <button type="button" onclick="deleteAllTransactions()" class="modal-btn modal-delete">🗑️ Hapus Semua</button>
                    </div>
                </div>
            </div>
            
            <script>
                // Fungsi untuk memuat transaksi
                async function loadTransactions() {
                    try {
                        const response = await fetch('/api/transactions');
                        const data = await response.json();
                        updateUI(data);
                    } catch (error) {
                        console.error('Error loading transactions:', error);
                    }
                }
                
                // Fungsi untuk update UI
                function updateUI(data) {
                    const transactionsList = document.getElementById('transactionsList');
                    const currentBalance = document.getElementById('currentBalance');
                    const totalMasuk = document.getElementById('totalMasuk');
                    const totalKeluar = document.getElementById('totalKeluar');
                    
                    // Update saldo
                    currentBalance.textContent = formatCurrency(data.balance);
                    
                    // Update total masuk dan keluar
                    totalMasuk.textContent = formatCurrency(data.totalIncome);
                    totalKeluar.textContent = formatCurrency(data.totalExpense);
                    
                    // Update daftar transaksi
                    if (data.transactions.length === 0) {
                        transactionsList.innerHTML = '<div class="no-transactions">Belum ada transaksi. Mulai tambahkan transaksi pertama Anda!</div>';
                        return;
                    }
                    
                    let transactionsHTML = '';
                    data.transactions.forEach(transaction => {
                        const typeClass = transaction.type === 'masuk' ? 'transaction-masuk' : 'transaction-keluar';
                        const typeLabel = transaction.type === 'masuk' ? 'type-masuk' : 'type-keluar';
                        const amountClass = transaction.type === 'masuk' ? 'amount-masuk' : 'amount-keluar';
                        const typeText = transaction.type === 'masuk' ? 'UANG MASUK' : 'UANG KELUAR';
                        const categoryName = getCategoryName(transaction.category);
                        const formattedDate = formatDate(transaction.date);
                        const formattedAmount = formatCurrency(transaction.amount);
                        
                        let notesHTML = '';
                        if (transaction.notes && transaction.notes.trim() !== '') {
                            notesHTML = '<div class="transaction-description">' + transaction.notes + '</div>';
                        }
                        
                        transactionsHTML += 
                            '<div class="transaction-item ' + typeClass + '">' +
                                '<div class="transaction-header">' +
                                    '<div>' +
                                        '<strong>' + transaction.description + '</strong>' +
                                        '<div class="transaction-date">' + formattedDate + ' | ' + categoryName + '</div>' +
                                    '</div>' +
                                    '<span class="transaction-type ' + typeLabel + '">' + typeText + '</span>' +
                                '</div>' +
                                '<div class="transaction-amount ' + amountClass + '">' + formattedAmount + '</div>' +
                                notesHTML +
                            '</div>';
                    });
                    
                    transactionsList.innerHTML = transactionsHTML;
                }
                
                // Format currency
                function formatCurrency(amount) {
                    return 'Rp ' + amount.toLocaleString('id-ID');
                }
                
                // Format date
                function formatDate(dateString) {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
                
                // Get category name
                function getCategoryName(category) {
                    const categories = {
                        'gaji': 'Gaji/Pendapatan',
                        'investasi': 'Investasi',
                        'hadiah': 'Hadiah/Bonus',
                        'makanan': 'Makanan & Minuman',
                        'transportasi': 'Transportasi',
                        'belanja': 'Belanja',
                        'hiburan': 'Hiburan',
                        'kesehatan': 'Kesehatan',
                        'pendidikan': 'Pendidikan',
                        'sedekah': 'Sedekah/Zakat',
                        'lainnya': 'Lainnya'
                    };
                    return categories[category] || category;
                }
                
                // Reset form
                function resetForm() {
                    document.getElementById('transactionForm').reset();
                    document.getElementById('date').value = '${today}';
                    document.getElementById('type_masuk').checked = true;
                }
                
                // Handle form submission
                document.getElementById('transactionForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    data.amount = parseFloat(data.amount);
                    
                    try {
                        const response = await fetch('/add-transaction', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            // Tampilkan pesan sukses
                            showMessage('Transaksi berhasil disimpan!', 'success');
                            // Reset form
                            resetForm();
                            // Reload transaksi
                            loadTransactions();
                        } else {
                            showMessage('Gagal menyimpan transaksi: ' + result.message, 'error');
                        }
                    } catch (error) {
                        showMessage('Terjadi kesalahan: ' + error.message, 'error');
                    }
                });
                
                // Export to CSV
                async function exportToCSV() {
                    try {
                        const response = await fetch('/export-csv');
                        if (response.ok) {
                            // Create download link
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'as-salaam-transactions.csv';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                            
                            showMessage('Data berhasil diexport ke CSV!', 'success');
                        } else {
                            showMessage('Gagal mengexport data', 'error');
                        }
                    } catch (error) {
                        showMessage('Terjadi kesalahan: ' + error.message, 'error');
                    }
                }
                
                // Show delete confirmation modal
                function showDeleteConfirm() {
                    document.getElementById('deleteConfirmModal').style.display = 'flex';
                }
                
                // Hide delete confirmation modal
                function hideDeleteConfirm() {
                    document.getElementById('deleteConfirmModal').style.display = 'none';
                }
                
                // Delete all transactions
                async function deleteAllTransactions() {
                    try {
                        const response = await fetch('/delete-all-transactions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            showMessage('Semua data transaksi telah dihapus!', 'success');
                            hideDeleteConfirm();
                            loadTransactions();
                        } else {
                            showMessage('Gagal menghapus data: ' + result.message, 'error');
                            hideDeleteConfirm();
                        }
                    } catch (error) {
                        showMessage('Terjadi kesalahan: ' + error.message, 'error');
                        hideDeleteConfirm();
                    }
                }
                
                // Show message
                function showMessage(text, type) {
                    // Hapus pesan sebelumnya
                    const existingMessage = document.querySelector('.message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    // Buat pesan baru
                    const message = document.createElement('div');
                    message.className = 'message ' + type;
                    message.textContent = text;
                    
                    // Sisipkan setelah header
                    const header = document.querySelector('header');
                    header.parentNode.insertBefore(message, header.nextSibling);
                    
                    // Hapus otomatis setelah 5 detik
                    setTimeout(() => {
                        if (message.parentNode) {
                            message.remove();
                        }
                    }, 5000);
                }
                
                // Load transaksi saat halaman dimuat
                document.addEventListener('DOMContentLoaded', loadTransactions);
            </script>
        </body>
        </html>
    `);
});

// API untuk mendapatkan semua transaksi
app.get('/api/transactions', (req, res) => {
    const transactions = readTransactions();
    const totalIncome = transactions
        .filter(t => t.type === 'masuk')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'keluar')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    res.json({
        transactions: transactions.reverse(), // Tampilkan yang terbaru dulu
        totalIncome,
        totalExpense,
        balance
    });
});

// Endpoint untuk menambah transaksi
app.post('/add-transaction', (req, res) => {
    try {
        const { description, amount, type, date, category, notes } = req.body;
        
        // Validasi
        if (!description || !amount || !type || !date) {
            return res.json({ 
                success: false, 
                message: 'Data tidak lengkap' 
            });
        }
        
        const transactions = readTransactions();
        
        // Buat transaksi baru
        const newTransaction = {
            id: Date.now(), // ID unik berdasarkan timestamp
            description: description.trim(),
            amount: parseFloat(amount),
            type: type,
            date: date,
            category: category || 'lainnya',
            notes: notes ? notes.trim() : '',
            createdAt: new Date().toISOString()
        };
        
        // Tambahkan ke array
        transactions.push(newTransaction);
        
        // Simpan ke file
        if (saveTransactions(transactions)) {
            res.json({ 
                success: true, 
                message: 'Transaksi berhasil disimpan',
                transaction: newTransaction
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Gagal menyimpan ke file' 
            });
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan server' 
        });
    }
});

// Endpoint untuk menghapus semua transaksi
app.post('/delete-all-transactions', (req, res) => {
    try {
        if (saveTransactions([])) {
            res.json({ 
                success: true, 
                message: 'Semua transaksi telah dihapus' 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Gagal menghapus transaksi' 
            });
        }
    } catch (error) {
        console.error('Error deleting all transactions:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan server' 
        });
    }
});

// Endpoint untuk export data ke CSV
app.get('/export-csv', (req, res) => {
    try {
        const transactions = readTransactions();
        
        if (transactions.length === 0) {
            return res.status(400).send('Tidak ada data transaksi untuk diexport');
        }
        
        // Header CSV
        let csv = 'ID,Deskripsi,Jumlah,Jenis,Tanggal,Kategori,Catatan,Dibuat Pada\n';
        
        // Data transaksi
        transactions.forEach(t => {
            // Escape quotes in description and notes
            const desc = t.description.replace(/"/g, '""');
            const notes = t.notes ? t.notes.replace(/"/g, '""') : '';
            
            csv += `${t.id},"${desc}",${t.amount},${t.type},"${t.date}",${t.category},"${notes}","${t.createdAt}"\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('as-salaam-transactions.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).send('Error exporting data');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 As Salaam Finance Status berjalan di http://localhost:${PORT}`);
    console.log(`📁 Data transaksi disimpan di: ${TRANSACTIONS_FILE}`);
    console.log('💡 Tekan Ctrl+C untuk menghentikan server');
    console.log('✨ Fitur baru: Export CSV & Hapus Semua Data');
});