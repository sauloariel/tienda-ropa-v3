import { useState, useEffect, useMemo } from 'react';
import { marketingAPI, Promocion, MarketingStats, CreatePromocionData } from '../services/marketing';

export const useMarketing = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [stats, setStats] = useState<MarketingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('TODOS');
    const [selectedTipo, setSelectedTipo] = useState('TODOS');

    // Cargar datos iniciales
    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            const [promocionesData, statsData] = await Promise.all([
                marketingAPI.getPromociones(),
                marketingAPI.getMarketingStats()
            ]);

            setPromociones(promocionesData);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los datos de marketing');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Filtrar promociones
    const promocionesFiltradas = useMemo(() => {
        return promociones.filter(promocion => {
            const matchesSearch = !searchTerm ||
                promocion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promocion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promocion.codigo_descuento?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEstado = selectedEstado === 'TODOS' || promocion.estado === selectedEstado;
            const matchesTipo = selectedTipo === 'TODOS' || promocion.tipo === selectedTipo;

            return matchesSearch && matchesEstado && matchesTipo;
        });
    }, [promociones, searchTerm, selectedEstado, selectedTipo]);

    // Promociones por vencer (próximos 7 días)
    const promocionesPorVencer = useMemo(() => {
        const hoy = new Date();
        const en7Dias = new Date();
        en7Dias.setDate(hoy.getDate() + 7);

        return promociones.filter(promocion => {
            const fechaFin = new Date(promocion.fecha_fin);
            return promocion.estado === 'ACTIVA' &&
                fechaFin >= hoy &&
                fechaFin <= en7Dias;
        });
    }, [promociones]);

    // Promociones expiradas
    const promocionesExpiradas = useMemo(() => {
        const hoy = new Date();
        return promociones.filter(promocion => {
            const fechaFin = new Date(promocion.fecha_fin);
            return promocion.estado === 'ACTIVA' && fechaFin < hoy;
        });
    }, [promociones]);

    // Crear promoción
    const crearPromocion = async (data: CreatePromocionData): Promise<void> => {
        try {
            const nuevaPromocion = await marketingAPI.createPromocion(data);
            setPromociones(prev => [nuevaPromocion, ...prev]);

            // Actualizar estadísticas
            if (stats) {
                setStats(prev => prev ? {
                    ...prev,
                    total_promociones: prev.total_promociones + 1,
                    promociones_activas: data.estado === 'ACTIVA' ? prev.promociones_activas + 1 : prev.promociones_activas,
                    promociones_inactivas: data.estado === 'INACTIVA' ? prev.promociones_inactivas + 1 : prev.promociones_inactivas
                } : null);
            }
        } catch (err: any) {
            throw new Error(err.message || 'Error al crear la promoción');
        }
    };

    // Actualizar promoción
    const actualizarPromocion = async (id: number, data: Partial<CreatePromocionData>): Promise<void> => {
        try {
            const promocionActualizada = await marketingAPI.updatePromocion(id, data);
            setPromociones(prev => prev.map(p =>
                p.id_promocion === id ? promocionActualizada : p
            ));
        } catch (err: any) {
            throw new Error(err.message || 'Error al actualizar la promoción');
        }
    };

    // Eliminar promoción
    const eliminarPromocion = async (id: number): Promise<void> => {
        try {
            await marketingAPI.deletePromocion(id);
            setPromociones(prev => prev.filter(p => p.id_promocion !== id));

            // Actualizar estadísticas
            if (stats) {
                const promocionEliminada = promociones.find(p => p.id_promocion === id);
                if (promocionEliminada) {
                    setStats(prev => prev ? {
                        ...prev,
                        total_promociones: prev.total_promociones - 1,
                        promociones_activas: promocionEliminada.estado === 'ACTIVA' ? prev.promociones_activas - 1 : prev.promociones_activas,
                        promociones_inactivas: promocionEliminada.estado === 'INACTIVA' ? prev.promociones_inactivas - 1 : prev.promociones_inactivas,
                        promociones_expiradas: promocionEliminada.estado === 'EXPIRADA' ? prev.promociones_expiradas - 1 : prev.promociones_expiradas
                    } : null);
                }
            }
        } catch (err: any) {
            throw new Error(err.message || 'Error al eliminar la promoción');
        }
    };

    // Cambiar estado de promoción
    const cambiarEstadoPromocion = async (id: number, nuevoEstado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA'): Promise<void> => {
        try {
            const promocionActualizada = await marketingAPI.togglePromocionEstado(id, nuevoEstado);
            setPromociones(prev => prev.map(p =>
                p.id_promocion === id ? promocionActualizada : p
            ));

            // Actualizar estadísticas
            if (stats) {
                const promocionOriginal = promociones.find(p => p.id_promocion === id);
                if (promocionOriginal) {
                    setStats(prev => prev ? {
                        ...prev,
                        promociones_activas:
                            promocionOriginal.estado === 'ACTIVA' ? prev.promociones_activas - 1 :
                                nuevoEstado === 'ACTIVA' ? prev.promociones_activas + 1 : prev.promociones_activas,
                        promociones_inactivas:
                            promocionOriginal.estado === 'INACTIVA' ? prev.promociones_inactivas - 1 :
                                nuevoEstado === 'INACTIVA' ? prev.promociones_inactivas + 1 : prev.promociones_inactivas,
                        promociones_expiradas:
                            promocionOriginal.estado === 'EXPIRADA' ? prev.promociones_expiradas - 1 :
                                nuevoEstado === 'EXPIRADA' ? prev.promociones_expiradas + 1 : prev.promociones_expiradas
                    } : null);
                }
            }
        } catch (err: any) {
            throw new Error(err.message || 'Error al cambiar el estado de la promoción');
        }
    };

    // Validar código de descuento
    const validarCodigoDescuento = async (codigo: string, montoCompra?: number) => {
        try {
            return await marketingAPI.validateCodigoDescuento(codigo, montoCompra);
        } catch (err: any) {
            throw new Error(err.message || 'Error al validar el código de descuento');
        }
    };

    // Usar código de descuento
    const usarCodigoDescuento = async (codigo: string): Promise<void> => {
        try {
            await marketingAPI.usarCodigoDescuento(codigo);

            // Actualizar uso en la lista local
            setPromociones(prev => prev.map(p =>
                p.codigo_descuento === codigo
                    ? { ...p, uso_actual: p.uso_actual + 1 }
                    : p
            ));

            // Actualizar estadísticas
            if (stats) {
                setStats(prev => prev ? {
                    ...prev,
                    total_uso: prev.total_uso + 1
                } : null);
            }
        } catch (err: any) {
            throw new Error(err.message || 'Error al usar el código de descuento');
        }
    };

    // Recargar datos
    const recargarDatos = () => {
        cargarDatos();
    };

    return {
        // Estados
        promociones: promocionesFiltradas,
        stats,
        loading,
        error,

        // Filtros
        searchTerm,
        setSearchTerm,
        selectedEstado,
        setSelectedEstado,
        selectedTipo,
        setSelectedTipo,

        // Promociones especiales
        promocionesPorVencer,
        promocionesExpiradas,

        // Acciones
        crearPromocion,
        actualizarPromocion,
        eliminarPromocion,
        cambiarEstadoPromocion,
        validarCodigoDescuento,
        usarCodigoDescuento,
        recargarDatos
    };
};