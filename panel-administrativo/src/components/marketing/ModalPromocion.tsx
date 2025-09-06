import React, { useState, useEffect } from 'react';
import { X, Calendar, Percent, DollarSign, Gift, Target, Hash, Users, Clock } from 'lucide-react';
import { PromocionResponse } from '../../types/marketing.types';

interface ModalPromocionProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    promocion?: PromocionResponse | null;
    loading?: boolean;
}

export const ModalPromocion: React.FC<ModalPromocionProps> = ({
    isOpen,
    onClose,
    onSave,
    promocion,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo: 'PORCENTAJE' as 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL',
        valor: '',
        codigo_descuento: '',
        fecha_inicio: '',
        fecha_fin: '',
        minimo_compra: '',
        uso_maximo: '',
        estado: 'ACTIVA' as 'ACTIVA' | 'INACTIVA' | 'EXPIRADA'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Cargar datos de la promoción si está editando
    useEffect(() => {
        if (promocion) {
            setFormData({
                nombre: promocion.nombre,
                descripcion: promocion.descripcion || '',
                tipo: promocion.tipo,
                valor: promocion.valor.toString(),
                codigo_descuento: promocion.codigo_descuento || '',
                fecha_inicio: promocion.fecha_inicio.split('T')[0],
                fecha_fin: promocion.fecha_fin.split('T')[0],
                minimo_compra: promocion.minimo_compra?.toString() || '',
                uso_maximo: promocion.uso_maximo?.toString() || '',
                estado: promocion.estado
            });
        } else {
            // Resetear formulario para nueva promoción
            setFormData({
                nombre: '',
                descripcion: '',
                tipo: 'PORCENTAJE',
                valor: '',
                codigo_descuento: '',
                fecha_inicio: '',
                fecha_fin: '',
                minimo_compra: '',
                uso_maximo: '',
                estado: 'ACTIVA'
            });
        }
        setErrors({});
    }, [promocion, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.tipo) {
            newErrors.tipo = 'El tipo es requerido';
        }

        if (!formData.valor.trim()) {
            newErrors.valor = 'El valor es requerido';
        } else {
            const valor = parseFloat(formData.valor);
            if (isNaN(valor) || valor < 0) {
                newErrors.valor = 'El valor debe ser un número positivo';
            }
            if (formData.tipo === 'PORCENTAJE' && valor > 100) {
                newErrors.valor = 'El porcentaje no puede ser mayor a 100%';
            }
        }

        if (!formData.fecha_inicio) {
            newErrors.fecha_inicio = 'La fecha de inicio es requerida';
        }

        if (!formData.fecha_fin) {
            newErrors.fecha_fin = 'La fecha de fin es requerida';
        }

        if (formData.fecha_inicio && formData.fecha_fin) {
            const inicio = new Date(formData.fecha_inicio);
            const fin = new Date(formData.fecha_fin);
            if (inicio >= fin) {
                newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
            }
        }

        if (formData.minimo_compra && parseFloat(formData.minimo_compra) < 0) {
            newErrors.minimo_compra = 'El monto mínimo debe ser positivo';
        }

        if (formData.uso_maximo && (parseInt(formData.uso_maximo) < 1 || parseInt(formData.uso_maximo) < (promocion?.uso_actual || 0))) {
            newErrors.uso_maximo = 'El uso máximo debe ser mayor a 0 y mayor al uso actual';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const data = {
            ...formData,
            valor: parseFloat(formData.valor),
            minimo_compra: formData.minimo_compra ? parseFloat(formData.minimo_compra) : undefined,
            uso_maximo: formData.uso_maximo ? parseInt(formData.uso_maximo) : undefined,
            codigo_descuento: formData.codigo_descuento || undefined
        };

        onSave(data);
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'PORCENTAJE': return <Percent className="h-4 w-4" />;
            case 'MONTO_FIJO': return <DollarSign className="h-4 w-4" />;
            case '2X1': return <Gift className="h-4 w-4" />;
            case 'DESCUENTO_ESPECIAL': return <Target className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {promocion ? 'Editar Promoción' : 'Nueva Promoción'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la promoción *
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ej: Descuento de Verano"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe la promoción..."
                            />
                        </div>
                    </div>

                    {/* Tipo y valor */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Tipo y Valor</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de promoción *
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.tipo ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="PORCENTAJE">Porcentaje de descuento</option>
                                    <option value="MONTO_FIJO">Monto fijo de descuento</option>
                                    <option value="2X1">2x1 (Segundo gratis)</option>
                                    <option value="DESCUENTO_ESPECIAL">Descuento especial</option>
                                </select>
                                {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {formData.tipo === 'PORCENTAJE' ? 'Porcentaje (%)' :
                                     formData.tipo === 'MONTO_FIJO' ? 'Monto ($)' :
                                     formData.tipo === '2X1' ? 'Valor (0 para 2x1)' : 'Valor'} *
                                </label>
                                <input
                                    type="number"
                                    name="valor"
                                    value={formData.valor}
                                    onChange={handleInputChange}
                                    min="0"
                                    max={formData.tipo === 'PORCENTAJE' ? '100' : undefined}
                                    step={formData.tipo === 'PORCENTAJE' ? '1' : '0.01'}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.valor ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder={formData.tipo === 'PORCENTAJE' ? '20' : '10.00'}
                                />
                                {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Código de descuento */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Código de Descuento</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código (opcional)
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    name="codigo_descuento"
                                    value={formData.codigo_descuento}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VERANO20"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Si no se especifica, se generará automáticamente
                            </p>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Fechas de Vigencia</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de inicio *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        value={formData.fecha_inicio}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.fecha_inicio && <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de fin *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="date"
                                        name="fecha_fin"
                                        value={formData.fecha_fin}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.fecha_fin && <p className="text-red-500 text-sm mt-1">{errors.fecha_fin}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Condiciones adicionales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Condiciones Adicionales</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monto mínimo de compra
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="number"
                                        name="minimo_compra"
                                        value={formData.minimo_compra}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.minimo_compra ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="100.00"
                                    />
                                </div>
                                {errors.minimo_compra && <p className="text-red-500 text-sm mt-1">{errors.minimo_compra}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Límite de uso
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="number"
                                        name="uso_maximo"
                                        value={formData.uso_maximo}
                                        onChange={handleInputChange}
                                        min="1"
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.uso_maximo ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="1000"
                                    />
                                </div>
                                {errors.uso_maximo && <p className="text-red-500 text-sm mt-1">{errors.uso_maximo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="ACTIVA">Activa</option>
                            <option value="INACTIVA">Inactiva</option>
                            <option value="EXPIRADA">Expirada</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            <span>{promocion ? 'Actualizar' : 'Crear'} Promoción</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};