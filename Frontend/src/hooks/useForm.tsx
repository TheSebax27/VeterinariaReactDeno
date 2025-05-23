import { useState } from 'react';
import { FormErrors } from '../types';

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => FormErrors
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({ ...prev, [name]: validationErrors[name as string] || '' }));
    }
  };

  const validateForm = () => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(touchedFields);
    
    return Object.keys(validationErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues
  };
}