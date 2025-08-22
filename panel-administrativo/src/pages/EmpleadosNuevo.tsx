import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useNavigate } from 'react-router-dom';
import { object, string, optional, minLength, maxLength, email, transform, pipe } from 'valibot';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { crearEmpleado, EmpleadoCreate } from '../services/empleados';
import { useAuth } from '../contexts/AuthContext';

const SoloDigitos = (s: string) => s.replace(/\D+/g, '');

export const empleadoSchema = object({
  cuil: pipe(
    string([minLength(11, 'CUIL debe tener 11 dígitos'), maxLength(11, 'CUIL debe tener 11 dígitos')]),
    transform((v) => SoloDigitos(v))
  ),
  nombre: pipe(string(), minLength(1, 'Nombre requerido')),
  apellido: pipe(string(), minLength(1, 'Apellido requerido')),
  domicilio: pipe(string(), minLength(1, 'Domicilio requerido')),
  telefono: pipe(string(), minLength(1, 'Teléfono requerido')),
  mail: pipe(string(), email('Email inválido')),
  sueldo: optional(
    pipe(
      string(),
      transform((v) => (v.trim() === '' ? undefined : Number(v.replace(',', '.')))),
    )
  ),
  puesto: optional(string()),
  estado: optional(pipe(string(), maxLength(8, 'Máximo 8 caracteres')))
});

type FormData = {
  cuil: string;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
  mail: string;
  sueldo: string;
  puesto: string;
  estado: string;
};

const EmpleadosNuevo: React.FC = () => {
  const { canAccessModule } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: valibotResolver(empleadoSchema),
    defaultValues: {
      cuil: '',
      nombre: '',
      apellido: '',
      domicilio: '',
      telefono: '',
      mail: '',
      sueldo: '',
      puesto: '',
      estado: 'activo'
    }
  });

  // Solo permitir acceso a administradores
  if (!canAccessModule('empleados')) {
    navigate('/');
    return null;
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);

      // Normalizar datos según especificaciones
      const payload: EmpleadoCreate = {
        ...values,
        cuil: values.cuil.replace(/\D+/g, ''),
        telefono: values.telefono.replace(/[^0-9()+\- ]+/g, '').trim(),
        sueldo: typeof values.sueldo === 'number' ? values.sueldo : undefined,
        nombre: values.nombre.trim(),
        apellido: values.apellido.trim(),
        domicilio: values.domicilio.trim(),
        mail: values.mail.trim(),
        puesto: values.puesto?.trim() || undefined,
        estado: values.estado || undefined,
      };

      await crearEmpleado(payload);
      
      toast.success('Empleado creado exitosamente');
      navigate('/empleados');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear empleado';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/empleados');
  };

  // Formatear CUIL mientras se escribe
  const handleCuilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D+/g, '');
    setValue('cuil', value);
  };

  // Formatear teléfono mientras se escribe
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9()+\- ]+/g, '');
    setValue('telefono', value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Empleado</h1>
          <p className="text-gray-600 mt-2">Complete los datos del nuevo empleado</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CUIL */}
            <div>
              <label htmlFor="cuil" className="block text-sm font-medium text-gray-700 mb-1">
                CUIL *
              </label>
              <input
                {...register('cuil')}
                type="text"
                id="cuil"
                placeholder="12345678901"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={handleCuilChange}
                maxLength={11}
                aria-invalid={errors.cuil ? 'true' : 'false'}
                aria-describedby={errors.cuil ? 'cuil-error' : undefined}
              />
              <p className="text-sm text-gray-500 mt-1">11 dígitos, sin guiones</p>
              {errors.cuil && (
                <p id="cuil-error" className="text-sm text-red-600 mt-1">
                  {errors.cuil.message}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                {...register('nombre')}
                type="text"
                id="nombre"
                placeholder="Juan"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.nombre ? 'true' : 'false'}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
              />
              {errors.nombre && (
                <p id="nombre-error" className="text-sm text-red-600 mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                {...register('apellido')}
                type="text"
                id="apellido"
                placeholder="Pérez"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.apellido ? 'true' : 'false'}
                aria-describedby={errors.apellido ? 'apellido-error' : undefined}
              />
              {errors.apellido && (
                <p id="apellido-error" className="text-sm text-red-600 mt-1">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            {/* Domicilio */}
            <div>
              <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700 mb-1">
                Domicilio *
              </label>
              <input
                {...register('domicilio')}
                type="text"
                id="domicilio"
                placeholder="Av. San Martín 123"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.domicilio ? 'true' : 'false'}
                aria-describedby={errors.domicilio ? 'domicilio-error' : undefined}
              />
              {errors.domicilio && (
                <p id="domicilio-error" className="text-sm text-red-600 mt-1">
                  {errors.domicilio.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                {...register('telefono')}
                type="text"
                id="telefono"
                placeholder="+54 11 1234-5678"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={handleTelefonoChange}
                aria-invalid={errors.telefono ? 'true' : 'false'}
                aria-describedby={errors.telefono ? 'telefono-error' : undefined}
              />
              <p className="text-sm text-gray-500 mt-1">Permitir 0-9 + ( ) -</p>
              {errors.telefono && (
                <p id="telefono-error" className="text-sm text-red-600 mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                {...register('mail')}
                type="email"
                id="mail"
                placeholder="juan.perez@empresa.com"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.mail ? 'true' : 'false'}
                aria-describedby={errors.mail ? 'mail-error' : undefined}
              />
              {errors.mail && (
                <p id="mail-error" className="text-sm text-red-600 mt-1">
                  {errors.mail.message}
                </p>
              )}
            </div>

            {/* Sueldo */}
            <div>
              <label htmlFor="sueldo" className="block text-sm font-medium text-gray-700 mb-1">
                Sueldo
              </label>
              <input
                {...register('sueldo')}
                type="number"
                id="sueldo"
                placeholder="3500.00"
                step="0.01"
                min="0"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.sueldo ? 'true' : 'false'}
                aria-describedby={errors.sueldo ? 'sueldo-error' : undefined}
              />
              {errors.sueldo && (
                <p id="sueldo-error" className="text-sm text-red-600 mt-1">
                  {errors.sueldo.message}
                </p>
              )}
            </div>

            {/* Puesto */}
            <div>
              <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-1">
                Puesto
              </label>
              <input
                {...register('puesto')}
                type="text"
                id="puesto"
                placeholder="Vendedor"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.puesto ? 'true' : 'false'}
                aria-describedby={errors.puesto ? 'puesto-error' : undefined}
              />
              {errors.puesto && (
                <p id="puesto-error" className="text-sm text-red-600 mt-1">
                  {errors.puesto.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                {...register('estado')}
                id="estado"
                className="block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                aria-invalid={errors.estado ? 'true' : 'false'}
                aria-describedby={errors.estado ? 'estado-error' : undefined}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="baja">Baja</option>
              </select>
              {errors.estado && (
                <p id="estado-error" className="text-sm text-red-600 mt-1">
                  {errors.estado.message}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container como fallback */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EmpleadosNuevo;

