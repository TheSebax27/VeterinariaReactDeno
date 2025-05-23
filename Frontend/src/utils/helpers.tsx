export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last;
};

// Función para obtener el color del estado
export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'programada':
      return TABLA_COLORES.PRIMARY;
    case 'completada':
      return TABLA_COLORES.SUCCESS;
    case 'cancelada':
      return TABLA_COLORES.DANGER;
    case 'no asistió':
      return TABLA_COLORES.WARNING;
    default:
      return TABLA_COLORES.LIGHT;
  }
};

// Función para calcular la edad de una mascota
export const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '-';
  
  const birth = new Date(birthDate);
  const now = new Date();
  
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years === 0) {
    return `${months + (months < 0 ? 12 : 0)} meses`;
  } else if (years === 1 && months < 0) {
    return `${12 + months} meses`;
  } else {
    return `${years} años`;
  }
};