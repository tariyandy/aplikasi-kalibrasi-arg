# 🌧️ Sistem Kalibrasi & Monitoring ARG (Automatic Rain Gauge)

![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go)
![React Version](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)

> **Platform modern untuk menghitung, memantau, dan menganalisis akurasi alat penakar hujan tipe Tipping Bucket.**

---

## 📸 Preview Aplikasi

<img width="1351" height="865" alt="image" src="https://github.com/user-attachments/assets/96c05585-e79c-49e2-9fdf-b1e41d809eee" />

---

## 🚀 Fitur Utama

Sistem ini dibangun untuk menggantikan metode perhitungan manual dengan solusi digital yang presisi.

### 📊 Monitoring & Statistik
- **Real-time Calculation:** Menghitung volume curah hujan berdasarkan *tipping count*.
- **Analisis Presisi:** Menghitung otomatis **Mean (Rata-rata)** dan **Standar Deviasi (StDev)** untuk mengukur kestabilan alat.
- **Visualisasi Data:** Grafik garis interaktif (menggunakan `Recharts`) untuk memantau tren koreksi nilai error.

### 🛠️ Manajemen Data (CRUD)
- **Input Fleksibel:** Mendukung input nama Site/Lokasi, Diameter Corong (mm), dan Resolusi.
- **Custom UI:** Stepper input yang diperbesar untuk kemudahan penggunaan di lapangan.
- **Data Protection:** Fitur hapus data aman dengan konfirmasi ganda (tanpa popup browser).

### 📄 Pelaporan
- **Export to Excel:** Download laporan kalibrasi lengkap (.xlsx) dengan sekali klik.
- **Error Calculation:** Kolom otomatis untuk menghitung persentase error alat.

---

## 🏗️ Tech Stack

Aplikasi ini menggunakan arsitektur **MVC (Model-View-Controller)** pada Backend dan **Component-Based** pada Frontend.

### Backend (Golang)
- **Framework:** [Gin Gonic](https://gin-gonic.com/) (High Performance HTTP Web Framework)
- **ORM:** [GORM](https://gorm.io/) (Object Relational Mapping)
- **Database:** PostgreSQL (via Supabase)
- **Structure:** Modular MVC (`controllers`, `models`, `config`)

### Frontend (React)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Data Export:** SheetJS (XLSX)

---

## 📂 Struktur Project

```bash
monitoring-arg/
├── backend/
│   ├── config/         # Koneksi Database (Supabase)
│   ├── controllers/    # Logika Bisnis & Kalkulasi Rumus
│   ├── models/         # Definisi Struktur Data (Struct)
│   └── main.go         # Entry Point & Router (Gin)
├── frontend/
│   ├── src/
│   │   ├── HitArg.jsx  # Main Dashboard Component
│   │   └── App.jsx     # Routing Setup
│   └── package.json
└── README.md
```


##⚡ Cara Menjalankan (Local)

Ikuti langkah ini untuk menjalankan aplikasi di komputer lokal.
**1. Setup Backend**

Masuk ke folder backend, install dependencies, dan jalankan server.
```bash
cd backend
go mod tidy
go run main.go
```
Server akan berjalan di http://localhost:8080

**2. Setup Frontend**

Buka terminal baru, masuk ke folder frontend, dan jalankan React.
```bash
cd frontend
npm install
npm run dev
```

Aplikasi bisa diakses di http://localhost:5173

🔌 API Reference
Method	Endpoint	Deskripsi

GET	/data	Mengambil seluruh riwayat kalibrasi

POST	/hitung	Mengirim data uji & kalkulasi otomatis

DELETE	/data/:id	Menghapus data berdasarkan ID


🤝 Kontribusi

Project ini dikembangkan untuk kebutuhan kalibrasi presisi instrumentasi meteorologi. Saran dan masukan sangat diterima!

Created with ❤️ by [tariyandy]


---
