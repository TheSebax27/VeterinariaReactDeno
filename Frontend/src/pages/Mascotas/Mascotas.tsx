// src/pages/Mascotas/Mascotas.tsx

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { apiService } from '../../services/api';
import { Mascota, Propietario, Especie, Raza, FormErrors } from '../../types';
import './Mascotas.css';

const initialMascota: Omit<Mascota, 'id_mascota'> = {
  id_propietario: 0,
  id_especie: 0,
  id_raza: null,
  nombre: '',
  fecha_nacimiento: '',
  sexo: 'Macho',
  color: '',
  peso: null
};

const validateMascota = (values: Omit<Mascota, 'id_mascota'>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!values.nombre.trim()) {
    errors.nombre = 'El nombre es requerido';
  }
  
  if (!values.id_propietario) {
    errors.id_propietario = 'El propietario es requerido';
  }
  
  if (!values.id_especie) {
    errors.id_especie = 'La especie es requerida';
  }
  
  if (values.peso && values.peso <= 0) {
    errors.peso = 'El peso debe ser mayor a 0';
  }
  
  return errors;
};

export const Mascotas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razasDisponibles, setRazasDisponibles] = useState<Raza[]>([]);

  const { data: mascotas, refetch } = useApi<Mascota[]>(
    () => apiService.getMascotas(),
    []
  );

  const { data: propietarios } = useApi<Propietario[]>(
    () => apiService.getPropietarios(),
    []
  );

  const { data: especies } = useApi<Especie[]>(
    () => apiService.getEspecies(),
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
  } = useForm(initialMascota, validateMascota);

  // Cargar razas cuando cambia la especie
  useEffect(() => {
    const loadRazas = async () => {
      if (values.id_especie) {
        try {
          const response = await apiService.getRazasByEspecie(values.id_especie);
          if (response.success && response.data) {
            setRazasDisponibles(response.data);
          }
        } catch (error) {
          console.error('Error al cargar razas:', error);
        }
      } else {
        setRazasDisponibles([]);
      }
    };

    loadRazas();
  }, [values.id_especie]);

  const openModal = (mascota?: Mascota) => {
    if (mascota) {
      setEditingMascota(mascota);
      setValues({
        id_propietario: mascota.id_propietario,
        id_especie: mascota.id_especie,
        id_raza: mascota.id_raza,
        nombre: mascota.nombre,
        fecha_nacimiento: mascota.fecha_nacimiento || '',
        sexo: mascota.sexo,
        color: mascota.color || '',
        peso: mascota.peso
      });
    } else {
      setEditingMascota(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMascota(null);
    reset();
    setRazasDisponibles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let response;
      
      const mascotaData = {
        ...values,
        peso: values.peso ? Number(values.peso) : null
      };
      
      if (editingMascota) {
        response = await apiService.updateMascota({
          ...mascotaData,
          id_mascota: editingMascota.id_mascota
        });
      } else {
        response = await apiService.createMascota(mascotaData);
      }

      if (response.success) {
        closeModal();
        refetch();
      } else {
        alert(response.message || 'Error al guardar la mascota');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (mascota: Mascota) => {
    if (!window.confirm(`¿Está seguro de eliminar a la mascota ${mascota.nombre}?`)) {
      return;
    }

    try {
      const response = await apiService.deleteMascota(mascota.id_mascota!);
      
      if (response.success) {
        refetch();
      } else {
        alert(response.message || 'Error al eliminar la mascota');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const propietarioOptions = propietarios?.map(p => ({
    value: p.id_propietario!,
    label: `${p.nombre} ${p.apellidos}`
  })) || [];

  const especieOptions = especies?.map(e => ({
    value: e.id_especie,
    label: e.nombre
  })) || [];

  const razaOptions = razasDisponibles.map(r => ({
    value: r.id_raza,
    label: r.nombre
  }));

  const sexoOptions = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Hembra', label: 'Hembra' }
  ];

  const columns = [
    {
      key: 'nombre',
      title: 'Nombre',
      render: (value: string) => <strong>{value}</strong>
    },
    {
      key: 'nombre_propietario',
      title: 'Propietario',
      render: (value: string, record: Mascota) => 
        `${record.nombre_propietario} ${record.apellidos_propietario}`
    },
    {
      key: 'nombre_especie',
      title: 'Especie'
    },
    {
      key: 'nombre_raza',
      title: 'Raza',
      render: (value: string) => value || '-'
    },
    {
      key: 'sexo',
      title: 'Sexo'
    },
    {
      key: 'peso',
      title: 'Peso',
      render: (value: number) => value ? `${value} kg` : '-'
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: any, record: Mascota) => (
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
    <div className="mascotas-page">
      <div className="page-header">
        <div>
          <h1>Mascotas</h1>
          <p>Gestión de mascotas registradas</p>
        </div>
        <Button onClick={() => openModal()}>
          Nueva Mascota
        </Button>
      </div>

      <Card>
        <Table
          data={mascotas || []}
          columns={columns}
          emptyMessage="No hay mascotas registradas"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMascota ? 'Editar Mascota' : 'Nueva Mascota'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="mascota-form">
          <div className="form-row">
            <Input
              label="Nombre *"
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              onBlur={() => handleBlur('nombre')}
              error={errors.nombre}
              placeholder="Ingrese el nombre de la mascota"
            />
            <Select
              label="Propietario *"
              value={values.id_propietario}
              onChange={(e) => handleChange('id_propietario', Number(e.target.value))}
              onBlur={() => handleBlur('id_propietario')}
              error={errors.id_propietario}
              options={propietarioOptions}
              placeholder="Seleccione un propietario"
            />
          </div>

          <div className="form-row">
            <Select
              label="Especie *"
              value={values.id_especie}
              onChange={(e) => {
                const especieId = Number(e.target.value);
                handleChange('id_especie', especieId);
                handleChange('id_raza', null); // Reset raza when especie changes
              }}
              onBlur={() => handleBlur('id_especie')}
              error={errors.id_especie}
              options={especieOptions}
              placeholder="Seleccione una especie"
            />
            <Select
              label="Raza"
              value={values.id_raza || ''}
              onChange={(e) => handleChange('id_raza', e.target.value ? Number(e.target.value) : null)}
              options={razaOptions}
              placeholder="Seleccione una raza"
              disabled={!values.id_especie}
            />
          </div>

          <div className="form-row">
            <Select
              label="Sexo *"
              value={values.sexo}
              onChange={(e) => handleChange('sexo', e.target.value as 'Macho' | 'Hembra')}
              options={sexoOptions}
            />
            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={values.fecha_nacimiento}
              onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
            />
          </div>

          <div className="form-row">
            <Input
              label="Color"
              value={values.color}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder="Ingrese el color"
            />
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              min="0"
              value={values.peso || ''}
              onChange={(e) => handleChange('peso', e.target.value ? Number(e.target.value) : null)}
              onBlur={() => handleBlur('peso')}
              error={errors.peso}
              placeholder="Ingrese el peso"
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingMascota ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};