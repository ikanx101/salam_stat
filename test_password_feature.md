# Test Fitur Password Hapus Data

## Fitur yang Telah Ditambahkan

### 1. Password Khusus untuk Hapus Data
- **Password**: `Delete123!`
- **Lokasi**: Konstanta `DELETE_PASSWORD` di file `server.js` baris 19
- **Fungsi**: Melindungi operasi penghapusan semua data transaksi

### 2. Modifikasi Endpoint `/delete-all-transactions`
- **Sebelum**: Tidak ada autentikasi
- **Sesudah**: Memerlukan password yang valid
- **Validasi**: Password harus sama dengan `DELETE_PASSWORD`

### 3. Modifikasi Modal Konfirmasi Hapus
- **Tambahan**: Input field untuk password hapus data
- **Validasi client-side**: Memastikan password tidak kosong
- **Reset**: Password direset saat modal ditutup

### 4. Modifikasi Fungsi JavaScript
- **`deleteAllTransactions()`**: Mengambil password dari input dan mengirim ke server
- **`hideDeleteConfirm()`**: Mereset input password saat modal ditutup

### 5. Update Dokumentasi
- **readme.txt**: Menambahkan informasi password hapus data
- **CARA_PAKAI.txt**: Menambahkan catatan tentang password hapus data

## Cara Kerja Sistem

1. **User klik "Hapus Semua Data"** → Modal konfirmasi muncul
2. **User memasukkan password** → Di input field khusus
3. **User klik "Hapus Semua"** → 
   - Validasi client-side: password tidak boleh kosong
   - Password dikirim ke endpoint `/delete-all-transactions`
4. **Server memvalidasi password**:
   - Jika valid → hapus semua data → kembalikan sukses
   - Jika tidak valid → kembalikan error
5. **Client menampilkan pesan** sesuai hasil operasi

## Keamanan

1. **Password disimpan di server** (tidak di client)
2. **Validasi di kedua sisi**: client dan server
3. **Password tidak ditampilkan** di UI (input type="password")
4. **Reset otomatis** setelah modal ditutup

## Testing

### Test Case 1: Password Benar
1. Buka aplikasi di browser
2. Klik tombol "Hapus Semua Data"
3. Masukkan password: `Delete123!`
4. Klik "Hapus Semua"
5. **Expected**: Data terhapus, pesan sukses muncul

### Test Case 2: Password Salah
1. Buka aplikasi di browser
2. Klik tombol "Hapus Semua Data"
3. Masukkan password: `password_salah`
4. Klik "Hapus Semua"
5. **Expected**: Data tidak terhapus, pesan error muncul

### Test Case 3: Password Kosong
1. Buka aplikasi di browser
2. Klik tombol "Hapus Semua Data"
3. Biarkan password kosong
4. Klik "Hapus Semua"
5. **Expected**: Validasi client-side mencegah pengiriman, pesan error muncul

### Test Case 4: Batal Operasi
1. Buka aplikasi di browser
2. Klik tombol "Hapus Semua Data"
3. Masukkan password apapun
4. Klik "Batal"
5. **Expected**: Modal tertutup, password direset, data tidak terhapus

## Catatan Penting

1. **Password hapus data berbeda** dengan password tambah transaksi
2. **Operasi hapus tidak dapat dibatalkan** setelah berhasil
3. **Backup data** disarankan sebelum melakukan penghapusan
4. **Password dapat diubah** dengan mengedit konstanta `DELETE_PASSWORD` di `server.js`

## Troubleshooting

### Masalah: Password tidak diterima
- **Solusi**: Pastikan password yang dimasukkan tepat `Delete123!` (case-sensitive)
- **Solusi**: Restart server setelah mengubah password di kode

### Masalah: Modal tidak menampilkan input password
- **Solusi**: Clear cache browser
- **Solusi**: Pastikan file `server.js` sudah diperbarui

### Masalah: Error "Password hapus data tidak valid"
- **Solusi**: Periksa konsistensi password di client dan server
- **Solusi**: Pastikan tidak ada whitespace di input password

## Informasi Teknis

- **File yang dimodifikasi**: `server.js`, `readme.txt`, `CARA_PAKAI.txt`
- **Password default**: `Delete123!`
- **Endpoint**: `POST /delete-all-transactions`
- **Parameter**: `{ "deletePassword": "password" }`
- **Response sukses**: `{ "success": true, "message": "Semua transaksi telah dihapus" }`
- **Response error**: `{ "success": false, "message": "Password hapus data tidak valid" }`