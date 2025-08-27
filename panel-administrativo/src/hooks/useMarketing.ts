import { useState, useEffect, useCallback } from 'react'
import { PromocionResponse, PromocionStats } from '../types/marketing.types'
import { marketingAPI } from '../services/marketing'

export const useMarketing = () => {
    const [promociones, setPromociones] = useState<PromocionResponse[]>([])
    const [stats, setStats] = useState<PromocionStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEstado, setSelectedEstado] = useState<string>('TODOS')
    const [selectedTipo, setSelectedTipo] = useState<string>('TODOS')

    // Cargar promociones
    const cargarPromociones = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const [promocionesData, statsData] = await Promise.all([
                marketingAPI.getPromociones(),
                marketingAPI.getPromocionStats()
            ])

            setPromociones(promocionesData)
            setStats(statsData)
        } catch (err: any) {
            setError(err.message)
            console.error('Error cargando promociones:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar datos al montar el componente
    useEffect(() => {
        cargarPromociones()
    }, [cargarPromociones])

    // Filtrar promociones
    const promocionesFiltradas = promociones.filter(promocion => {
        const matchesSearch = promocion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promocion.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesEstado = selectedEstado === 'TODOS' || promocion.estado === selectedEstado
        const matchesTipo = selectedTipo === 'TODOS' || promocion.tipo === selectedTipo

        return matchesSearch && matchesEstado && matchesTipo
    })

    // Crear promoción
    const crearPromocion = useCallback(async (promocionData: any) => {
        try {
            const nuevaPromocion = await marketingAPI.crearPromocion(promocionData)
            setPromociones(prev => [...prev, nuevaPromocion])
            await cargarPromociones() // Recargar para actualizar stats
            return nuevaPromocion
        } catch (err: any) {
            throw new Error(err.message)
        }
    }, [cargarPromociones])

    // Actualizar promoción
    const actualizarPromocion = useCallback(async (id: number, promocionData: any) => {
        try {
            const promocionActualizada = await marketingAPI.actualizarPromocion(id, promocionData)
            setPromociones(prev => prev.map(p => p.id_promocion === id ? promocionActualizada : p))
            await cargarPromociones() // Recargar para actualizar stats
            return promocionActualizada
        } catch (err: any) {
            throw new Error(err.message)
        }
    }, [cargarPromociones])

    // Eliminar promoción
    const eliminarPromocion = useCallback(async (id: number) => {
        try {
            await marketingAPI.eliminarPromocion(id)
            setPromociones(prev => prev.filter(p => p.id_promocion !== id))
            await cargarPromociones() // Recargar para actualizar stats
        } catch (err: any) {
            throw new Error(err.message)
        }
    }, [cargarPromociones])

    // Cambiar estado de promoción
    const cambiarEstadoPromocion = useCallback(async (id: number, estado: 'ACTIVA' | 'INACTIVA') => {
        try {
            const promocionActualizada = await marketingAPI.cambiarEstadoPromocion(id, estado)
            setPromociones(prev => prev.map(p => p.id_promocion === id ? promocionActualizada : p))
            await cargarPromociones() // Recargar para actualizar stats
            return promocionActualizada
        } catch (err: any) {
            throw new Error(err.message)
        }
    }, [cargarPromociones])

    // Obtener promoción por ID
    const obtenerPromocion = useCallback((id: number) => {
        return promociones.find(p => p.id_promocion === id)
    }, [promociones])

    // Obtener tipos únicos
    const tiposPromocion = Array.from(new Set(promociones.map(p => p.tipo)))

    // Obtener estados únicos
    const estadosPromocion = Array.from(new Set(promociones.map(p => p.estado)))

    // Calcular promociones por vencer (7 días)
    const promocionesPorVencer = promociones.filter(promocion => {
        if (promocion.estado !== 'ACTIVA') return false

        const fechaFin = new Date(promocion.fecha_fin)
        const hoy = new Date()
        const diasRestantes = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

        return diasRestantes <= 7 && diasRestantes > 0
    })

    // Calcular promociones expiradas
    const promocionesExpiradas = promociones.filter(promocion => {
        const fechaFin = new Date(promocion.fecha_fin)
        const hoy = new Date()
        return fechaFin < hoy
    })

    return {
        // Estado
        promociones: promocionesFiltradas,
        stats,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedEstado,
        setSelectedEstado,
        selectedTipo,
        setSelectedTipo,

        // Funciones
        cargarPromociones,
        crearPromocion,
        actualizarPromocion,
        eliminarPromocion,
        cambiarEstadoPromocion,
        obtenerPromocion,

        // Datos calculados
        tiposPromocion,
        estadosPromocion,
        promocionesPorVencer,
        promocionesExpiradas
    }
}
