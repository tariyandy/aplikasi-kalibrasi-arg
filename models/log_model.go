package models

import "time"

type LogKalibrasi struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Timestamp    time.Time `json:"timestamp"`
	Lokasi       string    `json:"lokasi"` // <--- BARU: Nama Site
	JumlahTipUji int       `json:"jumlah_tip_uji"`
	Diameter     float64   `json:"diameter"` // Satuan sekarang dalam MM
	Resolusi     float64   `json:"resolusi"`
	SetpointMm   float64   `json:"setpoint_mm"`
	JumlahUji    float64   `json:"jumlah_uji"`
	Koreksi      float64   `json:"koreksi"`
}
