import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Droplets, Save, Trash2, Download, RefreshCw, MapPin, Calculator, Plus, Minus, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

function HitArg() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // State khusus untuk menangani ID mana yang sedang mau dihapus
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const [form, setForm] = useState({
    lokasi: '',
    jumlah_tip_uji: '',
    diameter: '200', 
    resolusi: '0.2'
  });

  const API_URL = "http://localhost:8080"; 

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/data`);
      const dataUrut = (res.data || []).sort((a, b) => a.id - b.id);
      setData(dataUrut);
    } catch (err) {
      console.error("Gagal konek:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- COUNTER ---
  const handlePlus = () => {
    const currentVal = parseInt(form.jumlah_tip_uji) || 0;
    setForm({ ...form, jumlah_tip_uji: currentVal + 1 });
  };

  const handleMin = () => {
    const currentVal = parseInt(form.jumlah_tip_uji) || 0;
    if (currentVal > 0) {
        setForm({ ...form, jumlah_tip_uji: currentVal - 1 });
    }
  };

  // --- HAPUS DATA (Updated: Tanpa window.confirm) ---
  const executeDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/data/${id}`);
      setDeleteConfirmId(null); // Reset tombol
      fetchData();
    } catch (err) { alert("Gagal hapus"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.lokasi) return alert("Mohon isi Nama Site/Lokasi!");

    setLoading(true);
    try {
      await axios.post(`${API_URL}/hitung`, {
        lokasi: form.lokasi,
        jumlah_tip_uji: parseInt(form.jumlah_tip_uji),
        diameter: parseFloat(form.diameter),
        resolusi: parseFloat(form.resolusi)
      });
      setForm({ ...form, jumlah_tip_uji: '' }); 
      fetchData();
    } catch (err) { alert("Gagal kirim data."); }
    setLoading(false);
  };

  const handleExportExcel = () => {
    const dataExcel = data.map(item => ({
      ID: item.id,
      Waktu: new Date(item.timestamp).toLocaleString(),
      "Lokasi Site": item.lokasi,
      "Diameter (mm)": item.diameter,
      "Resolusi (mm)": item.resolusi,
      "Setpoint (mm)": item.setpoint_mm,
      "Hasil Uji (mm)": item.jumlah_uji,
      "Koreksi (mm)": item.koreksi,
      "Error (%)": ((item.koreksi / item.setpoint_mm) * 100).toFixed(2) + "%"
    }));
    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kalibrasi ARG");
    XLSX.writeFile(wb, "Laporan_Kalibrasi.xlsx");
  };

  const calculateStats = () => {
    if (data.length === 0) return { mean: 0, stdev: 0 };
    const values = data.map(d => d.koreksi);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1 || 1);
    const stdev = Math.sqrt(avgSquaredDiff);
    return { mean, stdev };
  };

  const stats = calculateStats();
  const dataTabel = [...data].reverse();

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Droplets className="text-blue-600" /> Kalibrasi ARG
            </h1>
            <p className="text-slate-500 text-sm">Monitoring Presisi & Akurasi Tipping Bucket</p>
          </div>
          <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition">
            <Download size={18} /> Excel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-500"/> Input Data
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* INPUT LOKASI */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Site / Lokasi</label>
                  <div className="flex items-center border rounded-lg bg-slate-50 px-3 mt-1">
                    <MapPin size={18} className="text-slate-400" />
                    <input type="text" value={form.lokasi} onChange={(e)=>setForm({...form, lokasi:e.target.value})} className="w-full p-2 bg-transparent outline-none" placeholder="Contoh: Pos Bogor" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Corong (mm)</label>
                    <input type="number" value={form.diameter} onChange={(e)=>setForm({...form, diameter:e.target.value})} className="w-full p-2 border rounded-lg bg-slate-50 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Resolusi</label>
                    <input type="number" step="0.1" value={form.resolusi} onChange={(e)=>setForm({...form, resolusi:e.target.value})} className="w-full p-2 border rounded-lg bg-slate-50 mt-1" />
                  </div>
                </div>

                {/* COUNTER BUTTONS */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <p className="text-xs font-bold text-blue-500 uppercase mb-2">Jumlah Tip (Counter)</p>
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" onClick={handleMin} className="bg-white border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-xl transition shadow-sm active:scale-95">
                        <Minus size={28} strokeWidth={3} />
                    </button>
                    <input type="number" value={form.jumlah_tip_uji} onChange={(e)=>setForm({...form, jumlah_tip_uji:e.target.value})} className="w-full p-2 bg-transparent text-4xl font-bold text-center text-blue-900 outline-none placeholder-blue-200" placeholder="0" required />
                    <button type="button" onClick={handlePlus} className="bg-white border-2 border-green-200 text-green-500 hover:bg-green-500 hover:text-white p-4 rounded-xl transition shadow-sm active:scale-95">
                        <Plus size={28} strokeWidth={3} />
                    </button>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2">
                   {loading ? <RefreshCw className="animate-spin"/> : <Save size={18} />} Simpan Data
                </button>
              </form>
            </div>

            {/* KARTU STATISTIK */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
               <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                 <Calculator size={20} className="text-purple-500"/> Statistik Koreksi
               </h2>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-xs text-purple-400 font-bold uppercase">Rata-rata</p>
                    <p className="text-xl font-bold text-purple-700">{stats.mean.toFixed(3)}</p>
                 </div>
                 <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-xs text-orange-400 font-bold uppercase">St. Deviasi</p>
                    <p className="text-xl font-bold text-orange-700">{stats.stdev.toFixed(4)}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border min-h-[300px]">
               <h2 className="font-bold text-slate-700 mb-4">Grafik Kestabilan (Koreksi mm)</h2>
               {data.length > 0 ? (
                 <ResponsiveContainer width="100%" height={250}>
                   <LineChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                     <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} tick={{fontSize: 10}} />
                     <YAxis />
                     <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} labelFormatter={(t) => new Date(t).toLocaleString()} />
                     <Line type="monotone" dataKey="koreksi" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                     <Line type="monotone" dataKey="setpoint_mm" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
               ) : <div className="h-full flex justify-center items-center text-slate-300">Belum ada data</div>}
            </div>

            {/* TABEL DENGAN TOMBOL HAPUS BARU */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Waktu</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Lokasi</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Tip</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Hasil</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Koreksi</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Error</th>
                      <th className="p-3 text-center text-xs font-bold text-slate-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataTabel.map((item) => {
                      const errorVal = (item.koreksi / item.setpoint_mm) * 100;
                      const isConfirming = deleteConfirmId === item.id; // Cek apakah baris ini lagi dikonfirmasi

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-slate-700 text-sm">{item.lokasi}</td>
                          <td className="p-3 text-slate-700 font-bold">{item.jumlah_tip_uji}</td>
                          <td className="p-3 text-blue-600 font-bold">{item.jumlah_uji?.toFixed(2)}</td>
                          <td className={`p-3 font-bold ${item.koreksi < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {item.koreksi?.toFixed(3)}
                          </td>
                          <td className="p-3 font-mono font-bold text-purple-600 text-sm">{errorVal.toFixed(2)}%</td>
                          
                          {/* LOGIKA TOMBOL HAPUS BARU DI SINI */}
                          <td className="p-3 text-center">
                            {isConfirming ? (
                                <div className="flex items-center justify-center gap-1">
                                    <button 
                                        onClick={() => executeDelete(item.id)} 
                                        className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 shadow-sm"
                                        title="Ya, Hapus!"
                                    >
                                        <Check size={16} strokeWidth={3}/>
                                    </button>
                                    <button 
                                        onClick={() => setDeleteConfirmId(null)} 
                                        className="bg-slate-200 text-slate-500 p-1.5 rounded-md hover:bg-slate-300 shadow-sm"
                                        title="Batal"
                                    >
                                        <X size={16} strokeWidth={3}/>
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setDeleteConfirmId(item.id)} 
                                    className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HitArg;