// src/pages/Dashboard/Dashboard.tsx

import React from 'react';
import { Card } from '../../components/ui/Card';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { Propietario, Mascota, Veterinario, Cita } from '../../types';
import './Dashboard.css';

interface DashboardStats {
  totalPropietarios: number;
  totalMascotas: number;
  totalVeterinarios: number;
  citasHoy: number;
  citasPendientes: number;
}

export const Dashboard: React.FC = () => {
  const { data: propietarios } = useApi<Propietario[]>(() => apiService.getPropietarios());
  const { data: mascotas } = useApi<Mascota[]>(() => apiService.getMascotas());
  const { data: veterinarios } = useApi<Veterinario[]>(() => apiService.getVeterinarios());
  const { data: citas } = useApi<Cita[]>(() => apiService.getCitas());

  const today = new Date().toISOString().split('T')[0];
  
  const stats: DashboardStats = {
    totalPropietarios: propietarios?.length || 0,
    totalMascotas: mascotas?.length || 0,
    totalVeterinarios: veterinarios?.filter(v => v.activo)?.length || 0,
    citasHoy: citas?.filter(c => c.fecha_hora.startsWith(today))?.length || 0,
    citasPendientes: citas?.filter(c => c.estado === 'Programada')?.length || 0,
  };

  const citasRecientes = citas?.slice(0, 5) || [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de la clínica veterinaria</p>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card stat-card-primary">
          <div className="stat-content">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalPropietarios}</div>
              <div className="stat-label">Propietarios</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-card-success">
          <div className="stat-content">
            <div className="stat-icon">🐕</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalMascotas}</div>
              <div className="stat-label">Mascotas</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-card-info">
          <div className="stat-content">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalVeterinarios}</div>
              <div className="stat-label">Veterinarios</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-card-warning">
          <div className="stat-content">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-number">{stats.citasHoy}</div>
              <div className="stat-label">Citas Hoy</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-card-danger">
          <div className="stat-content">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <div className="stat-number">{stats.citasPendientes}</div>
              <div className="stat-label">Citas Pendientes</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <Card title="Citas Recientes" className="recent-appointments">
          {citasRecientes.length > 0 ? (
            <div className="appointments-list">
              {citasRecientes.map((cita) => (
                <div key={cita.id_cita} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-pet">
                      <strong>{cita.nombre_mascota}</strong>
                    </div>
                    <div className="appointment-owner">
                      {cita.nombre_propietario} {cita.apellidos_propietario}
                    </div>
                    <div className="appointment-vet">
                      Dr. {cita.nombre_veterinario} {cita.apellidos_veterinario}
                    </div>
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-date">
                      {new Date(cita.fecha_hora).toLocaleDateString('es-ES')}
                    </div>
                    <div className="appointment-time">
                      {new Date(cita.fecha_hora).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className={`appointment-status status-${cita.estado?.toLowerCase()}`}>
                      {cita.estado}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              No hay citas recientes
            </div>
          )}
        </Card>

        <Card title="Acciones Rápidas" className="quick-actions">
          <div className="actions-grid">
            <a href="/citas" className="action-item">
              <div className="action-icon">📅</div>
              <div className="action-label">Nueva Cita</div>
            </a>
            <a href="/mascotas" className="action-item">
              <div className="action-icon">🐕</div>
              <div className="action-label">Registrar Mascota</div>
            </a>
            <a href="/propietarios" className="action-item">
              <div className="action-icon">👥</div>
              <div className="action-label">Nuevo Propietario</div>
            </a>
            <a href="/veterinarios" className="action-item">
              <div className="action-icon">👨‍⚕️</div>
              <div className="action-label">Ver Veterinarios</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};