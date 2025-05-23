// src/pages/Veterinarios/Veterinarios.tsx

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { apiService } from '../../services/api';
import { Veterinario, FormErrors } from '../../types';

const initialVeterinario: Omit<Veterinario, 'id_veterinario'> = {
  nombre: '',
  apellidos: '',
  especialidad: '',
  telefono: '',
  email: '',
  numero_licencia: '',
  activo: true
};

const validateVeterinario = (values: Omit<Veterinario, 'id_veterinario'>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!values.nombre.trim()) {
    errors.nombre = 'El nombre es requerido';
  }
  
  if (!values.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son requeridos';
  }
  
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'El email debe tener un formato válido';
  }
  
  return errors;
};

export const Veterinarios: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeterinario, setEditingVeterinario] = useState<Veterinario | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: veterinarios, refetch } = useApi<Veterinario[]>(
    () => apiService.getVeterinarios(),
    []
  );

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues
  } = useForm(initialVeterinario, validateVeterinario);

  const openModal = (veterinario?: Veterinario) => {
    if (veterinario) {
      setEditingVeterinario(veterinario);
      setValues({
        nombre: veterinario.nombre,
        apellidos: veterinario.apellidos,
        especialidad: veterinario.especialidad || '',
        telefono: veterinario.telefono || '',
        email: veterinario.email || '',
        numero_licencia: veterinario.numero_licencia || '',
        activo: veterinario.activo !== false
      });
    } else {
      setEditingVeterinario(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVeterinario(null);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let response;
      
      if (editingVeterinario) {
        response = await apiService.updateVeterinario({
          ...values,
          id_veterinario: editingVeterinario.id_veterinario
        });
      } else {
        response = await apiService.createVeterinario(values);
      }

      if (response.success) {
        closeModal();
        refetch();
      } else {
        alert(response.message || 'Error al guardar el veterinario');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'nombre',
      title: 'Nombre',
      render: (value: string, record: Veterinario) => (
        <strong>{`Dr. ${record.nombre} ${record.apellidos}`}</strong>
      )
    },
    {
      key: 'especialidad',
      title: 'Especialidad',
      render: (value: string) => value || '-'
    },
    {
      key: 'telefono',
      title: 'Teléfono',
      render: (value: string) => value || '-'
    },
    {
      key: 'email',
      title: 'Email',
      render: (value: string) => value || '-'
    },
    {
      key: 'activo',
      title: 'Estado',
      render: (value: boolean) => (
        <span className={`status ${value ? 'status-active' : 'status-inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: any, record: Veterinario) => (
        <div className="table-actions">
          <Button
            size="small"
            variant="secondary"
            onClick={() => openModal(record)}
          >
            Editar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="veterinarios-page">
      <div className="page-header">
        <div>
          <h1>Veterinarios</h1>
          <p>Gestión del personal veterinario</p>
        </div>
        <Button onClick={() => openModal()}>
          Nuevo Veterinario
        </Button>
      </div>

      <Card>
        <Table
          data={veterinarios || []}
          columns={columns}
          emptyMessage="No hay veterinarios registrados"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVeterinario ? 'Editar Veterinario' : 'Nuevo Veterinario'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="veterinario-form">
          <div className="form-row">
            <Input
              label="Nombre *"
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              onBlur={() => handleBlur('nombre')}
              error={errors.nombre}
              placeholder="Ingrese el nombre"
            />
            <Input
              label="Apellidos *"
              value={values.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              onBlur={() => handleBlur('apellidos')}
              error={errors.apellidos}
              placeholder="Ingrese los apellidos"
            />
          </div>

          <Input
            label="Especialidad"
            value={values.especialidad}
            onChange={(e) => handleChange('especialidad', e.target.value)}
            placeholder="Ingrese la especialidad"
          />

          <div className="form-row">
            <Input
              label="Teléfono"
              value={values.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="Ingrese el teléfono"
            />
            <Input
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              placeholder="Ingrese el email"
            />
          </div>

          <Input
            label="Número de Licencia"
            value={values.numero_licencia}
            onChange={(e) => handleChange('numero_licencia', e.target.value)}
            placeholder="Ingrese el número de licencia"
          />

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={values.activo}
                onChange={(e) => handleChange('activo', e.target.checked)}
              />
              Veterinario activo
            </label>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingVeterinario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};