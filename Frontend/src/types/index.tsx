// src/types/index.ts

export interface Propietario {
  id_propietario: number | null;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string | null;
  direccion: string | null;
  fecha_registro?: string;
}

export interface Especie {
  id_especie: number;
  nombre: string;
  descripcion: string | null;
}

export interface Raza {
  id_raza: number;
  id_especie: number;
  nombre: string;
  descripcion: string | null;
  nombre_especie?: string;
}

export interface Mascota {
  id_mascota: number | null;
  id_propietario: number;
  id_especie: number;
  id_raza: number | null;
  nombre: string;
  fecha_nacimiento: string | null;
  sexo: 'Macho' | 'Hembra';
  color: string | null;
  peso: number | null;
  fecha_registro?: string;
  activo?: boolean;
  // Campos adicionales para mostrar información relacionada
  nombre_propietario?: string;
  apellidos_propietario?: string;
  nombre_especie?: string;
  nombre_raza?: string;
}

export interface Veterinario {
  id_veterinario: number | null;
  nombre: string;
  apellidos: string;
  especialidad: string | null;
  telefono: string | null;
  email: string | null;
  numero_licencia: string | null;
  activo?: boolean;
}

export interface Cita {
  id_cita: number | null;
  id_mascota: number;
  id_veterinario: number;
  fecha_hora: string;
  motivo: string;
  estado?: 'Programada' | 'Completada' | 'Cancelada' | 'No asistió';
  notas?: string | null;
  // Campos adicionales para mostrar información relacionada
  nombre_mascota?: string;
  nombre_propietario?: string;
  apellidos_propietario?: string;
  nombre_veterinario?: string;
  apellidos_veterinario?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface FormErrors {
  [key: string]: string;
}