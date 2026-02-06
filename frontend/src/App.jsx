import React from 'react';
// HAPUS 'BrowserRouter' dari import ini:
import { Routes, Route, Navigate } from 'react-router-dom';
import HitArg from './HitArg';

function App() {
  return (
    // JANGAN PAKAI <BrowserRouter> DI SINI LAGI
    <Routes>
      {/* Rute Utama */}
      <Route path="/hit-arg" element={<HitArg />} />

      {/* Redirect otomatis */}
      <Route path="/" element={<Navigate to="/hit-arg" replace />} />
    </Routes>
  );
}

export default App;