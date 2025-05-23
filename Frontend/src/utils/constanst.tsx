export const ESTADO_CITA = {
  PROGRAMADA: 'Programada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  NO_ASISTIO: 'No asistió'
} as const;

export const SEXO_MASCOTA = {
  MACHO: 'Macho',
  HEMBRA: 'Hembra'
} as const;

export const TABLA_COLORES = {
  PRIMARY: '#007bff',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
} as const;

export const MENSAJES = {
  CONFIRMACION_ELIMINAR: '¿Está seguro de que desea eliminar este registro?',
  ERROR_CONEXION: 'Error de conexión con el servidor',
  ERROR_GENERICO: 'Ha ocurrido un error inesperado',
  GUARDADO_EXITOSO: 'Registro guardado exitosamente',
  ELIMINADO_EXITOSO: 'Registro eliminado exitosamente',
  CAMPOS_REQUERIDOS: 'Por favor complete todos los campos requeridos'
} as const;
