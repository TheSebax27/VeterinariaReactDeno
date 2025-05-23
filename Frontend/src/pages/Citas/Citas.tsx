// src/pages/Citas/Citas.tsx

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { apiService } from '../../services/api';
import { Cita, Mascota, Veterinario, FormErrors } from '../../types';

const initialCita: Omit<Cita, 'id_cita'> = {
  id_mascota: 0,
  id_veterinario: 0,
  fecha_hora: '',
  motivo: '',
  estado: 'Programada',
  notas: ''
};

const validateCita = (values: Omit<Cita, 'id_cita'>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!values.id_mascota) {
    errors.id_mascota = 'La mascota es requerida';
  }
  
  if (!values.id_veterinario) {
    errors.id_veterinario = 'El veterinario es requerido';
  }
  
  if (!values.fecha_hora) {
    errors.fecha_hora = 'La fecha y hora son requeridas';
  }
  
  if (!values.motivo.trim()) {
    errors.motivo = 'El motivo es requerido';
  }
  
  return errors;
};

export const Citas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: citas, refetch } = useApi<Cita[]>(
    () => apiService.getCitas(),
    []
  );

  const { data: mascotas } = useApi<Mascota[]>(
    () => apiService.getMascotas(),
    []
  );

  const { data: veterinarios } = useApi<Veterinario[]>(
    () => apiService.getVeterinariosByEstado(true),
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
  } = useForm(initialCita, validateCita);

  const openModal = (cita?: Cita) => {
    if (cita) {
      setEditingCita(cita);
      setValues({
        id_mascota: cita.id_mascota,
        id_veterinario: cita.id_veterinario,
        fecha_hora: cita.fecha_hora.slice(0, 16), // Format for datetime-local input
        motivo: cita.motivo,
        estado: cita.estado || 'Programada',
        notas: cita.notas || ''
      });
    } else {
      setEditingCita(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCita(null);
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
      
      if (editingCita) {
        // Para actualizar solo usamos el endpoint de estado
        response = await apiService.updateEstadoCita(
          editingCita.id_cita!,
          values.estado!,
          values.notas
        );
      } else {
        response = await apiService.createCita(values);
      }

      if (response.success) {
        closeModal();
        refetch();
      } else {
        alert(response.message || 'Error al guardar la cita');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cita: Cita) => {
    if (!window.confirm(`¿Está seguro de eliminar la cita de ${cita.nombre_mascota}?`)) {
      return;
    }

    try {
      const response = await apiService.deleteCita(cita.id_cita!);
      
      if (response.success) {
        refetch();
      } else {
        alert(response.message || 'Error al eliminar la cita');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const mascotaOptions = mascotas?.map(m => ({
    value: m.id_mascota!,
    label: `${m.nombre} (${m.nombre_propietario} ${m.apellidos_propietario})`
  })) || [];

  const veterinarioOptions = veterinarios?.map(v => ({
    value: v.id_veterinario!,
    label: `Dr. ${v.nombre} ${v.apellidos}`
  })) || [];

  const estadoOptions = [
    { value: 'Programada', label: 'Programada' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'No asistió', label: 'No asistió' }
  ];

  const columns = [
    {
      key: 'fecha_hora',
      title: 'Fecha y Hora',
      render: (value: string) => (
        <div>
          <div>{new Date(value).toLocaleDateString('es-ES')}</div>
          <div className="text-small">
            {new Date(value).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      key: 'nombre_mascota',
      title: 'Mascota',
      render: (value: string, record: Cita) => (
        <div>
          <strong>{value}</strong>
          <div className="text-small">
            {record.nombre_propietario} {record.apellidos_propietario}
          </div>
        </div>
      )
    },
    {
      key: 'nombre_veterinario',
      title: 'Veterinario',
      render: (value: string, record: Cita) => 
        `Dr. ${value} ${record.apellidos_veterinario}`
    },
    {
      key: 'motivo',
      title: 'Motivo'
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (value: string) => (
        <span className={`status status-${value?.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: any, record: Cita) => (
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
    <div className="citas-page">
      <div className="page-header">
        <div>
          <h1>Citas</h1>
          <p>Gestión de citas veterinarias</p>
        </div>
        <Button onClick={() => openModal()}>
          Nueva Cita
        </Button>
      </div>

      <Card>
        <Table
          data={citas || []}
          columns={columns}
          emptyMessage="No hay citas registradas"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCita ? 'Editar Cita' : 'Nueva Cita'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="cita-form">
          {!editingCita && (
            <>
              <Select
                label="Mascota *"
                value={values.id_mascota}
                onChange={(e) => handleChange('id_mascota', Number(e.target.value))}
                onBlur={() => handleBlur('id_mascota')}
                error={errors.id_mascota}
                options={mascotaOptions}
                placeholder="Seleccione una mascota"
              />

              <Select
                label="Veterinario *"
                value={values.id_veterinario}
                onChange={(e) => handleChange('id_veterinario', Number(e.target.value))}
                onBlur={() => handleBlur('id_veterinario')}
                error={errors.id_veterinario}
                options={veterinarioOptions}
                placeholder="Seleccione un veterinario"
              />

              <Input
                label="Fecha y Hora *"
                type="datetime-local"
                value={values.fecha_hora}
                onChange={(e) => handleChange('fecha_hora', e.target.value)}
                onBlur={() => handleBlur('fecha_hora')}
                error={errors.fecha_hora}
              />

              <Input
                label="Motivo *"
                value={values.motivo}
                onChange={(e) => handleChange('motivo', e.target.value)}
                onBlur={() => handleBlur('motivo')}
                error={errors.motivo}
                placeholder="Ingrese el motivo de la cita"
              />
            </>
          )}

          <Select
            label="Estado"
            value={values.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            options={estadoOptions}
          />

          <Input
            label="Notas"
            value={values.notas}
            onChange={(e) => handleChange('notas', e.target.value)}
            placeholder="Notas adicionales"
          />

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingCita ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};