import { useState, useCallback } from 'react';
import { productosAPI } from '../services/api';
import type { Producto } from '../types/productos.types';

interface UseProductSearchReturn {
    query: string;
    setQuery: (query: string) => void;
    resultados: Producto[];
    cargando: boolean;
    buscarProductos: (searchQuery: string) => Promise<void>;
    limpiarBusqueda: () => void;
}

export const useProductSearch = (): UseProductSearchReturn => {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(false);

    const buscarProductos = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResultados([]);
            return;
        }

        try {
            setCargando(true);
            console.log('🔍 useProductSearch - Buscando productos:', searchQuery);

            const productos = await productosAPI.search(searchQuery);
            console.log('📦 useProductSearch - Productos encontrados:', productos);

            setResultados(productos);
        } catch (error) {
            console.error('❌ useProductSearch - Error en búsqueda:', error);
            setResultados([]);
        } finally {
            setCargando(false);
        }
    }, []);

    const limpiarBusqueda = useCallback(() => {
        setQuery('');
        setResultados([]);
    }, []);

    return {
        query,
        setQuery,
        resultados,
        cargando,
        buscarProductos,
        limpiarBusqueda
    };
};
