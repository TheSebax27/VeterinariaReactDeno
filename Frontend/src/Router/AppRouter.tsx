// src/router/AppRouter.tsx - VERSIÓN COMPLETA CON LAYOUT

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Propietarios } from '../pages/Propietarios/Propietarios';
import { Mascotas } from '../pages/Mascotas/Mascotas';
import { Veterinarios } from '../pages/Veterinarios/Veterinarios';
import { Citas } from '../pages/Citas/Citas';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/propietarios" element={<Propietarios />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/veterinarios" element={<Veterinarios />} />
          <Route path="/citas" element={<Citas />} />
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

// Componente para páginas no encontradas
const NotFound: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        Volver al inicio
      </a>
    </div>
  );
};