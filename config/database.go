package config

import (
	"bw2/models" // Pastikan ini sesuai nama module di go.mod

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Masukkan String Koneksi Supabase Kamu di sini
	dsn := "postgresql://postgres.pdvavfctdcrjzotbmapz:Darynka2110!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
	// --- PERUBAHAN DI SINI ---
	// Kita pakai konfigurasi khusus agar tidak bentrok dengan Supabase
	dbConfig := postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // <--- INI SOLUSINYA! (Matikan cache statement)
	}

	database, err := gorm.Open(postgres.New(dbConfig), &gorm.Config{})
	// -------------------------

	if err != nil {
		panic("Gagal konek ke database!")
	}

	database.AutoMigrate(&models.LogKalibrasi{})

	DB = database
}
