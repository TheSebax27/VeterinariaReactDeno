export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date: string | Date): string => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatWeight = (weight: number | null): string => {
  if (!weight) return '-';
  return `${weight} kg`;
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '-';
  
  // Format phone number (assuming Spanish format)
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
  }
  return phone;
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};