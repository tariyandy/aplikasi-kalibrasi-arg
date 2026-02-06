package main

import (
	"bw2/config"
	"bw2/controllers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Konek Database
	config.ConnectDatabase()

	// 2. Setup Gin
	r := gin.Default()

	// 3. Pasang CORS (Agar Frontend bisa masuk)
	r.Use(cors.Default())

	// ==========================================
	// BAGIAN INI YANG HILANG (ROUTING)
	// ==========================================

	// Kalau ada yang akses GET /data -> Panggil Controller AmbilData
	r.GET("/data", controllers.AmbilData) // <--- PENTING!

	// Kalau ada yang akses POST /hitung -> Panggil Controller HitungKalibrasi
	r.POST("/hitung", controllers.HitungKalibrasi) // <--- PENTING!
	r.DELETE("/data/:id", controllers.HapusData)
	// ...
	// ==========================================

	// 4. Jalankan Server
	// Cek apakah ada environment variable bernama "PORT"
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Kalau di laptop (gak ada env), pake 8080
	}

	// Jalankan di port yang ditentukan
	r.Run(":" + port)
}
