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

// Password untuk autentikasi
const REQUIRED_PASSWORD = 'Suntea101';
const DELETE_PASSWORD = 'Delete123!'; // Password khusus untuk hapus data

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

                .btn-edit {
                    background: linear-gradient(135deg, #1c71d8 0%, #1a5fb4 100%);
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
                    position: relative;
                }

                .transaction-actions {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: flex;
                    gap: 8px;
                }

                .edit-btn {
                    background: #1c71d8;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 5px 10px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .edit-btn:hover {
                    background: #1a5fb4;
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
                    font-size: 0.9rem;
                }
                
                .footer-note {
                    margin-top: 10px;
                    font-style: italic;
                    color: #4a5568;
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
                
                .delete-confirm, .edit-confirm {
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

                .delete-modal, .edit-modal {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }

                .edit-modal h3 {
                    color: #1c71d8;
                    margin-bottom: 15px;
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
                
                .password-section {
                    background: #e6fffa;
                    border: 2px solid #81e6d9;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 25px;
                }
                
                .password-section h3 {
                    color: #234e52;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                }
                
                .password-note {
                    font-size: 0.9rem;
                    color: #4a5568;
                    margin-top: 10px;
                    font-style: italic;
                }

                .edit-password-section {
                    background: #e6f7ff;
                    border: 2px solid #91d5ff;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 25px;
                }

                .edit-password-section h3 {
                    color: #096dd9;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>As Salaam Finance Status</h1>
                    <p class="subtitle">Laporan Kas Musholla As Salaam Cluster Citra Residence Bekasi</p>
                </header>
                
                <div class="main-content">
                    <div class="form-section">
                        <div class="password-section">
                            <h3>🔐 Autentikasi Transaksi</h3>
                            <div class="form-group">
                                <label for="password">Password Transaksi:</label>
                                <input type="password" id="password" name="password" required 
                                       placeholder="Masukkan password untuk menyimpan transaksi">
                            </div>
                            <p class="password-note">Hanya pengguna terotorisasi yang dapat menambah transaksi</p>
                        </div>
                        
                        <h2>➕ Tambah Transaksi Baru</h2>
                        <form id="transactionForm" method="POST" action="/add-transaction">
                            <div class="form-group">
                                <label for="description">Deskripsi Transaksi:</label>
                                <input type="text" id="description" name="description" required 
                                       placeholder="Contoh: Iuran bulanan, Pembelian perlengkapan, dll">
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
                                    <option value="iuran">Iuran Bulanan</option>
                                    <option value="infak">Infak Jumat</option>
                                    <option value="sedekah">Sedekah Umum</option>
                                    <option value="zakat">Zakat</option>
                                    <option value="wakaf">Wakaf</option>
                                    <option value="perlengkapan">Pembelian Perlengkapan</option>
                                    <option value="listrik">Biaya Listrik/Air</option>
                                    <option value="kebersihan">Kebersihan Musholla</option>
                                    <option value="kegiatan">Kegiatan Keagamaan</option>
                                    <option value="perbaikan">Perbaikan Musholla</option>
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
                            <h3>Saldo Kas Musholla</h3>
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
                    <p>© 2026 As Salaam Finance Status | Sistem Laporan Kas Musholla As Salaam</p>
                    <p><strong>Dibuat oleh ikanx101.com</strong></p>
                    <p class="footer-note">Hanya untuk penggunaan internal Cluster Citra Residence Bekasi</p>
                </footer>
             </div>

             <!-- Modal Konfirmasi Hapus -->
             <div id="deleteConfirmModal" class="delete-confirm" style="display: none;">
                 <div class="delete-modal">
                     <h3>⚠️ Konfirmasi Hapus Semua Data</h3>
                     <p>Apakah Anda yakin ingin menghapus SEMUA data transaksi kas musholla? Tindakan ini tidak dapat dibatalkan dan semua data akan hilang permanen.</p>

                     <div class="form-group" style="margin-top: 20px;">
                         <label for="deletePassword">Password Hapus Data:</label>
                         <input type="password" id="deletePassword" placeholder="Masukkan password hapus data" style="margin-top: 5px;">
                         <p style="font-size: 0.8rem; color: #718096; margin-top: 5px;">Password khusus diperlukan untuk menghapus semua data</p>
                     </div>

                     <div class="modal-buttons">
                         <button type="button" onclick="hideDeleteConfirm()" class="modal-btn modal-cancel">❌ Batal</button>
                         <button type="button" onclick="deleteAllTransactions()" class="modal-btn modal-delete">🗑️ Hapus Semua</button>
                     </div>
                 </div>
             </div>

             <!-- Modal Edit Transaksi -->
             <div id="editTransactionModal" class="edit-confirm" style="display: none;">
                 <div class="edit-modal">
                     <h3>✏️ Edit Transaksi</h3>

                     <div class="edit-password-section">
                         <h3>🔐 Autentikasi Edit</h3>
                         <div class="form-group">
                             <label for="editPassword">Password Edit:</label>
                             <input type="password" id="editPassword" name="editPassword" required
                                    placeholder="Masukkan password untuk mengedit transaksi">
                         </div>
                         <p class="password-note">Password yang sama dengan menambah transaksi: "Suntea101"</p>
                     </div>

                     <form id="editTransactionForm">
                         <input type="hidden" id="editId" name="id">

                         <div class="form-group">
                             <label for="editDescription">Deskripsi Transaksi:</label>
                             <input type="text" id="editDescription" name="description" required
                                    placeholder="Contoh: Iuran bulanan, Pembelian perlengkapan, dll">
                         </div>

                         <div class="form-group">
                             <label for="editAmount">Jumlah (Rp):</label>
                             <input type="number" id="editAmount" name="amount" required
                                    min="1" placeholder="100000">
                         </div>

                         <div class="form-group">
                             <label>Jenis Transaksi:</label>
                             <div class="radio-group">
                                 <label class="radio-label">
                                     <input type="radio" id="edit_type_masuk" name="type" value="masuk" required>
                                     <span class="radio-text">Uang Masuk</span>
                                 </label>
                                 <label class="radio-label">
                                     <input type="radio" id="edit_type_keluar" name="type" value="keluar" required>
                                     <span class="radio-text">Uang Keluar</span>
                                 </label>
                             </div>
                         </div>

                         <div class="form-group">
                             <label for="editDate">Tanggal Transaksi:</label>
                             <input type="date" id="editDate" name="date" required>
                         </div>

                         <div class="form-group">
                             <label for="editCategory">Kategori:</label>
                             <select id="editCategory" name="category">
                                 <option value="iuran">Iuran Bulanan</option>
                                 <option value="infak">Infak Jumat</option>
                                 <option value="sedekah">Sedekah Umum</option>
                                 <option value="zakat">Zakat</option>
                                 <option value="wakaf">Wakaf</option>
                                 <option value="perlengkapan">Pembelian Perlengkapan</option>
                                 <option value="listrik">Biaya Listrik/Air</option>
                                 <option value="kebersihan">Kebersihan Musholla</option>
                                 <option value="kegiatan">Kegiatan Keagamaan</option>
                                 <option value="perbaikan">Perbaikan Musholla</option>
                                 <option value="lainnya">Lainnya</option>
                             </select>
                         </div>

                         <div class="form-group">
                             <label for="editNotes">Catatan Tambahan (opsional):</label>
                             <textarea id="editNotes" name="notes" rows="3" placeholder="Tambahkan catatan jika diperlukan..."></textarea>
                         </div>

                         <div class="modal-buttons">
                             <button type="button" onclick="hideEditModal()" class="modal-btn modal-cancel">❌ Batal</button>
                             <button type="submit" class="modal-btn" style="background: #1c71d8; color: white;">💾 Simpan Perubahan</button>
                         </div>
                     </form>
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

                        // Tambahkan tombol edit
                        const editButton = '<button class="edit-btn" onclick="showEditModal(' + transaction.id + ')">✏️ Edit</button>';

                        transactionsHTML +=
                            '<div class="transaction-item ' + typeClass + '">' +
                                '<div class="transaction-actions">' + editButton + '</div>' +
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
                        'iuran': 'Iuran Bulanan',
                        'infak': 'Infak Jumat',
                        'sedekah': 'Sedekah Umum',
                        'zakat': 'Zakat',
                        'wakaf': 'Wakaf',
                        'perlengkapan': 'Pembelian Perlengkapan',
                        'listrik': 'Biaya Listrik/Air',
                        'kebersihan': 'Kebersihan Musholla',
                        'kegiatan': 'Kegiatan Keagamaan',
                        'perbaikan': 'Perbaikan Musholla',
                        'lainnya': 'Lainnya'
                    };
                    return categories[category] || category;
                }
                
                // Reset form
                function resetForm() {
                    document.getElementById('transactionForm').reset();
                    document.getElementById('date').value = '${today}';
                    document.getElementById('type_masuk').checked = true;
                    document.getElementById('password').value = '';
                }
                
                // Handle form submission
                document.getElementById('transactionForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    data.amount = parseFloat(data.amount);
                    
                    // Validasi password
                    const password = document.getElementById('password').value;
                    if (!password) {
                        showMessage('Password harus diisi!', 'error');
                        return;
                    }
                    
                    try {
                        const response = await fetch('/add-transaction', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({...data, password: password})
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
                            a.download = 'kas-musholla-as-salaam.csv';
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
                    document.getElementById('deletePassword').value = ''; // Reset password input
                }
                
                // Delete all transactions
                async function deleteAllTransactions() {
                    const deletePassword = document.getElementById('deletePassword').value;
                    
                    // Validasi input password
                    if (!deletePassword) {
                        showMessage('Silakan masukkan password hapus data', 'error');
                        return;
                    }
                    
                    try {
                        const response = await fetch('/delete-all-transactions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ deletePassword })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            showMessage('Semua data transaksi telah dihapus!', 'success');
                            hideDeleteConfirm();
                            loadTransactions();
                        } else {
                            showMessage('Gagal menghapus data: ' + result.message, 'error');
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
                
                // Fungsi untuk menampilkan modal edit
                function showEditModal(transactionId) {
                    // Cari transaksi berdasarkan ID
                    fetch('/api/transactions')
                        .then(response => response.json())
                        .then(data => {
                            const transaction = data.transactions.find(t => t.id == transactionId);

                            if (transaction) {
                                // Isi form dengan data transaksi
                                document.getElementById('editId').value = transaction.id;
                                document.getElementById('editDescription').value = transaction.description;
                                document.getElementById('editAmount').value = transaction.amount;
                                document.getElementById('editDate').value = transaction.date;
                                document.getElementById('editCategory').value = transaction.category;
                                document.getElementById('editNotes').value = transaction.notes || '';

                                // Set radio button berdasarkan jenis transaksi
                                if (transaction.type === 'masuk') {
                                    document.getElementById('edit_type_masuk').checked = true;
                                } else {
                                    document.getElementById('edit_type_keluar').checked = true;
                                }

                                // Reset password field
                                document.getElementById('editPassword').value = '';

                                // Tampilkan modal
                                document.getElementById('editTransactionModal').style.display = 'flex';
                            } else {
                                showMessage('Transaksi tidak ditemukan', 'error');
                            }
                        })
                        .catch(error => {
                            console.error('Error loading transaction:', error);
                            showMessage('Gagal memuat data transaksi', 'error');
                        });
                }

                // Fungsi untuk menyembunyikan modal edit
                function hideEditModal() {
                    document.getElementById('editTransactionModal').style.display = 'none';
                    document.getElementById('editPassword').value = ''; // Reset password input
                }

                // Handle form edit submission
                document.getElementById('editTransactionForm').addEventListener('submit', async function(e) {
                    e.preventDefault();

                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    data.amount = parseFloat(data.amount);

                    // Tambahkan password dari modal
                    const password = document.getElementById('editPassword').value;
                    if (!password) {
                        showMessage('Password edit harus diisi!', 'error');
                        return;
                    }

                    try {
                        const response = await fetch('/edit-transaction', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({...data, password: password})
                        });

                        const result = await response.json();

                        if (result.success) {
                            // Tampilkan pesan sukses
                            showMessage('Transaksi berhasil diperbarui!', 'success');
                            // Sembunyikan modal
                            hideEditModal();
                            // Reload transaksi
                            loadTransactions();
                        } else {
                            showMessage('Gagal memperbarui transaksi: ' + result.message, 'error');
                        }
                    } catch (error) {
                        showMessage('Terjadi kesalahan: ' + error.message, 'error');
                    }
                });

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

// Endpoint untuk menambah transaksi dengan autentikasi
app.post('/add-transaction', (req, res) => {
    try {
        const { description, amount, type, date, category, notes, password } = req.body;
        
        // Validasi password
        if (!password || password !== REQUIRED_PASSWORD) {
            return res.json({ 
                success: false, 
                message: 'Password salah atau tidak valid' 
            });
        }
        
        // Validasi data
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
            createdAt: new Date().toISOString(),
            addedBy: 'Authorized User' // Bisa dikembangkan untuk multi-user
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

// Endpoint untuk menghapus semua transaksi (dengan autentikasi password)
app.post('/delete-all-transactions', (req, res) => {
    try {
        const { deletePassword } = req.body;
        
        // Validasi password
        if (!deletePassword || deletePassword !== DELETE_PASSWORD) {
            return res.json({ 
                success: false, 
                message: 'Password hapus data tidak valid' 
            });
        }
        
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

// Endpoint untuk edit transaksi per baris
app.post('/edit-transaction', (req, res) => {
    try {
        const { id, description, amount, type, date, category, notes, password } = req.body;

        // Validasi password
        if (!password || password !== REQUIRED_PASSWORD) {
            return res.json({
                success: false,
                message: 'Password salah atau tidak valid'
            });
        }

        // Validasi data
        if (!id || !description || !amount || !type || !date) {
            return res.json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }

        const transactions = readTransactions();

        // Cari transaksi berdasarkan ID
        const transactionIndex = transactions.findIndex(t => t.id == id);

        if (transactionIndex === -1) {
            return res.json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        // Update transaksi
        transactions[transactionIndex] = {
            ...transactions[transactionIndex],
            description: description.trim(),
            amount: parseFloat(amount),
            type: type,
            date: date,
            category: category || 'lainnya',
            notes: notes ? notes.trim() : '',
            updatedAt: new Date().toISOString(),
            updatedBy: 'Authorized User'
        };

        // Simpan ke file
        if (saveTransactions(transactions)) {
            res.json({
                success: true,
                message: 'Transaksi berhasil diperbarui',
                transaction: transactions[transactionIndex]
            });
        } else {
            res.json({
                success: false,
                message: 'Gagal menyimpan perubahan ke file'
            });
        }
    } catch (error) {
        console.error('Error editing transaction:', error);
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
        let csv = 'ID,Deskripsi,Jumlah,Jenis,Tanggal,Kategori,Catatan,Dibuat Pada,Diperbarui Pada\n';

        // Data transaksi
        transactions.forEach(t => {
            // Escape quotes in description and notes
            const desc = t.description.replace(/"/g, '""');
            const notes = t.notes ? t.notes.replace(/"/g, '""') : '';
            const updatedAt = t.updatedAt ? t.updatedAt : '';

            csv += `${t.id},"${desc}",${t.amount},${t.type},"${t.date}",${t.category},"${notes}","${t.createdAt}","${updatedAt}"\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('kas-musholla-as-salaam.csv');
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
    console.log(`🔐 Password autentikasi: ${REQUIRED_PASSWORD}`);
    console.log('💡 Tekan Ctrl+C untuk menghentikan server');
    console.log('✨ Sistem Laporan Kas Musholla As Salaam Cluster Citra Residence Bekasi');
});