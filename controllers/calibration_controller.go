package controllers

import (
	"math"
	"net/http"
	"time"

	"bw2/config" // Import config buat akses DB
	"bw2/models" // Import models buat akses Struct

	"github.com/gin-gonic/gin"
)

// GET Data
func AmbilData(c *gin.Context) {
	// Perubahan 1: Inisialisasi slice kosong (Anti Null)
	logs := []models.LogKalibrasi{}

	// Perubahan 2: Pakai config.DB
	config.DB.Order("timestamp desc").Limit(10).Find(&logs)

	c.JSON(http.StatusOK, logs)
}

// POST Hitung
func HitungKalibrasi(c *gin.Context) {
	// Struct input tetap lokal karena cuma dipakai di sini
	var input struct {
		Lokasi       string  `json:"lokasi"`
		JumlahTipUji int     `json:"jumlah_tip_uji"`
		Diameter     float64 `json:"diameter"`
		Resolusi     float64 `json:"resolusi"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// --- RUMUS BARU (Konversi mm ke cm) ---
	// Karena Volume 250ml = 250 cm^3, maka jari-jari harus dalam cm.
	diameterCm := input.Diameter / 10.0
	radiusCm := diameterCm / 2.0

	luas := math.Pi * math.Pow(radiusCm, 2) // Luas dalam cm2
	setpointMm := (250.0 / luas) * 10       // Tinggi (cm) * 10 = mm

	jumlahUji := float64(input.JumlahTipUji) * input.Resolusi
	koreksi := setpointMm - jumlahUji

	// Perubahan 3: Pakai models.LogKalibrasi
	data := models.LogKalibrasi{
		Timestamp:    time.Now(),
		Lokasi:       input.Lokasi, // Simpan Lokasi
		JumlahTipUji: input.JumlahTipUji,
		Diameter:     input.Diameter, // Simpan angka asli (mm)
		Resolusi:     input.Resolusi,
		SetpointMm:   setpointMm,
		JumlahUji:    jumlahUji,
		Koreksi:      koreksi,
	}

	// Simpan pakai config.DB
	config.DB.Create(&data)
	c.JSON(http.StatusOK, data)
}

// Fungsi Hapus Data (DELETE)
func HapusData(c *gin.Context) {
	id := c.Param("id")

	// Hapus berdasarkan ID
	if err := config.DB.Delete(&models.LogKalibrasi{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
}
