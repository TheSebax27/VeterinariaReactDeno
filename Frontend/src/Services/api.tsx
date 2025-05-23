// src/services/api.tsx - SERVICIO API COMPLETO

import { ApiResponse, Propietario, Mascota, Veterinario, Cita, Especie, Raza } from '../types/index';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const config: RequestInit = {
        ...options,
      };

      // Solo añadir Content-Type para métodos que envían datos
      if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
        config.headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        errors: error,
      };
    }
  }

  // PROPIETARIOS
  async getPropietarios(): Promise<ApiResponse<Propietario[]>> {
    return this.request<Propietario[]>('/propietarios');
  }

  async getPropietarioById(id: number): Promise<ApiResponse<Propietario>> {
    return this.request<Propietario>(`/propietarios/${id}`);
  }

  async createPropietario(propietario: Omit<Propietario, 'id_propietario'>): Promise<ApiResponse<Propietario>> {
    return this.request<Propietario>('/propietarios', {
      method: 'POST',
      body: JSON.stringify(propietario),
    });
  }

  async updatePropietario(propietario: Propietario): Promise<ApiResponse<Propietario>> {
    return this.request<Propietario>('/propietarios', {
      method: 'PUT',
      body: JSON.stringify(propietario),
    });
  }

  async deletePropietario(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('/propietarios', {
      method: 'DELETE',
      body: JSON.stringify({ id_propietario: id }),
    });
  }

  // MASCOTAS
  async getMascotas(): Promise<ApiResponse<Mascota[]>> {
    return this.request<Mascota[]>('/mascotas');
  }

  async getMascotaById(id: number): Promise<ApiResponse<Mascota>> {
    return this.request<Mascota>(`/mascotas/${id}`);
  }

  async getMascotasByPropietario(idPropietario: number): Promise<ApiResponse<Mascota[]>> {
    return this.request<Mascota[]>(`/mascotas/propietario/${idPropietario}`);
  }

  async createMascota(mascota: Omit<Mascota, 'id_mascota'>): Promise<ApiResponse<Mascota>> {
    return this.request<Mascota>('/mascotas', {
      method: 'POST',
      body: JSON.stringify(mascota),
    });
  }

  async updateMascota(mascota: Mascota): Promise<ApiResponse<Mascota>> {
    return this.request<Mascota>('/mascotas', {
      method: 'PUT',
      body: JSON.stringify(mascota),
    });
  }

  async deleteMascota(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('/mascotas', {
      method: 'DELETE',
      body: JSON.stringify({ id_mascota: id }),
    });
  }

  // VETERINARIOS
  async getVeterinarios(): Promise<ApiResponse<Veterinario[]>> {
    return this.request<Veterinario[]>('/veterinarios');
  }

  async getVeterinarioById(id: number): Promise<ApiResponse<Veterinario>> {
    return this.request<Veterinario>(`/veterinarios/${id}`);
  }

  async getVeterinariosByEstado(activo: boolean): Promise<ApiResponse<Veterinario[]>> {
    return this.request<Veterinario[]>(`/veterinarios/estado/${activo}`);
  }

  async createVeterinario(veterinario: Omit<Veterinario, 'id_veterinario'>): Promise<ApiResponse<Veterinario>> {
    return this.request<Veterinario>('/veterinarios', {
      method: 'POST',
      body: JSON.stringify(veterinario),
    });
  }

  async updateVeterinario(veterinario: Veterinario): Promise<ApiResponse<Veterinario>> {
    return this.request<Veterinario>('/veterinarios', {
      method: 'PUT',
      body: JSON.stringify(veterinario),
    });
  }

  // CITAS
  async getCitas(): Promise<ApiResponse<Cita[]>> {
    return this.request<Cita[]>('/citas');
  }

  async getCitasByFecha(fecha: string): Promise<ApiResponse<Cita[]>> {
    return this.request<Cita[]>(`/citas/fecha/${fecha}`);
  }

  async getCitasByMascota(idMascota: number): Promise<ApiResponse<Cita[]>> {
    return this.request<Cita[]>(`/citas/mascota/${idMascota}`);
  }

  async getCitasByVeterinario(idVeterinario: number): Promise<ApiResponse<Cita[]>> {
    return this.request<Cita[]>(`/citas/veterinario/${idVeterinario}`);
  }

  async createCita(cita: Omit<Cita, 'id_cita'>): Promise<ApiResponse<Cita>> {
    return this.request<Cita>('/citas', {
      method: 'POST',
      body: JSON.stringify(cita),
    });
  }

  async updateEstadoCita(idCita: number, estado: string, notas?: string): Promise<ApiResponse<Cita>> {
    return this.request<Cita>('/citas/estado', {
      method: 'PUT',
      body: JSON.stringify({ id_cita: idCita, estado, notas }),
    });
  }

  async deleteCita(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('/citas', {
      method: 'DELETE',
      body: JSON.stringify({ id_cita: id }),
    });
  }

  // ESPECIES
  async getEspecies(): Promise<ApiResponse<Especie[]>> {
    return this.request<Especie[]>('/especies');
  }

  // RAZAS
  async getRazas(): Promise<ApiResponse<Raza[]>> {
    return this.request<Raza[]>('/razas');
  }

  async getRazasByEspecie(idEspecie: number): Promise<ApiResponse<Raza[]>> {
    return this.request<Raza[]>(`/razas/especie/${idEspecie}`);
  }
}

export const apiService = new ApiService();