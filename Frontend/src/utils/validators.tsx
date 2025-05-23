export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{9,}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

export const isValidWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 1000; // Reasonable weight range
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

export const isPastDate = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d < now;
};

// Validación de edad mínima para mascotas (no pueden nacer en el futuro)
export const isValidBirthDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  return isPastDate(date);
};

// Validación de citas (no pueden ser en el pasado)
export const isValidAppointmentDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  
  const appointmentDate = new Date(date);
  const now = new Date();
  
  // Allow appointments from current time onwards
  return appointmentDate >= now;
};