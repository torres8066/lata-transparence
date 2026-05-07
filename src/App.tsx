import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AtelierDashboard from './pages/AtelierDashboard';
import CreateReport from './pages/CreateReport';
import EditReport from './pages/EditReport';
import ClientReport from './pages/ClientReport';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Atelier (Workshop) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<AtelierDashboard />} />
          <Route path="nouveau" element={<CreateReport />} />
          <Route path="editer/:id" element={<EditReport />} />
        </Route>

        {/* Route Client (No layout, stand-alone view) */}
        <Route path="/rapport/:id" element={<ClientReport />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
