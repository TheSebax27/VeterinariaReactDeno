// src/pages/Propietarios/Propietarios.tsx

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { apiService } from '../../services/api';
import { Propietario, FormErrors } from '../../types';
import './Propietarios.css';

const initialPropietario: Omit<Propietario, 'id_propietario'> = {
  nombre: '',
  apellidos: '',
  telefono: '',
  email: '',
  direccion: ''
};

const validatePropietario = (values: Omit<Propietario, 'id_propietario'>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!values.nombre.trim()) {
    errors.nombre = 'El nombre es requerido';
  }
  
  if (!values.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son requeridos';
  }
  
  if (!values.telefono.trim()) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!/^\d{9,}$/.test(values.telefono.replace(/[-\s]/g, ''))) {
    errors.telefono = 'El teléfono debe tener al menos 9 dígitos';
  }
  
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'El email debe tener un formato válido';
  }
  
  return errors;
};

export const Propietarios: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropietario, setEditingPropietario] = useState<Propietario | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: propietarios, refetch } = useApi<Propietario[]>(
    () => apiService.getPropietarios(),
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
  } = useForm(initialPropietario, validatePropietario);

  const openModal = (propietario?: Propietario) => {
    if (propietario) {
      setEditingPropietario(propietario);
      setValues({
        nombre: propietario.nombre,
        apellidos: propietario.apellidos,
        telefono: propietario.telefono,
        email: propietario.email || '',
        direccion: propietario.direccion || ''
      });
    } else {
      setEditingPropietario(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPropietario(null);
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
      
      if (editingPropietario) {
        response = await apiService.updatePropietario({
          ...values,
          id_propietario: editingPropietario.id_propietario
        });
      } else {
        response = await apiService.createPropietario(values);
      }

      if (response.success) {
        closeModal();
        refetch();
      } else {
        alert(response.message || 'Error al guardar el propietario');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (propietario: Propietario) => {
    if (!window.confirm(`¿Está seguro de eliminar al propietario ${propietario.nombre} ${propietario.apellidos}?`)) {
      return;
    }

    try {
      const response = await apiService.deletePropietario(propietario.id_propietario!);
      
      if (response.success) {
        refetch();
      } else {
        alert(response.message || 'Error al eliminar el propietario');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const columns = [
    {
      key: 'nombre',
      title: 'Nombre',
      render: (value: string, record: Propietario) => (
        <strong>{`${record.nombre} ${record.apellidos}`}</strong>
      )
    },
    {
      key: 'telefono',
      title: 'Teléfono'
    },
    {
      key: 'email',
      title: 'Email',
      render: (value: string) => value || '-'
    },
    {
      key: 'fecha_registro',
      title: 'Fecha Registro',
      render: (value: string) => value ? new Date(value).toLocaleDateString('es-ES') : '-'
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: any, record: Propietario) => (
        <div className="table-actions">
          <Button
            size="small"
            variant="secondary"
            onClick={() => openModal(record)}
          >
            Editar
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(record)}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="propietarios-page">
      <div className="page-header">
        <div>
          <h1>Propietarios</h1>
          <p>Gestión de propietarios de mascotas</p>
        </div>
        <Button onClick={() => openModal()}>
          Nuevo Propietario
        </Button>
      </div>

      <Card>
        <Table
          data={propietarios || []}
          columns={columns}
          emptyMessage="No hay propietarios registrados"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPropietario ? 'Editar Propietario' : 'Nuevo Propietario'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="propietario-form">
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

          <div className="form-row">
            <Input
              label="Teléfono *"
              value={values.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              onBlur={() => handleBlur('telefono')}
              error={errors.telefono}
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
            label="Dirección"
            value={values.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Ingrese la dirección"
          />

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingPropietario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};