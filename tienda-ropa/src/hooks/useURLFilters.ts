import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface URLFilters {
    categoria: number | null;
    busqueda: string;
    pagina: number;
}

export function useURLFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Estado inicial basado en la URL
    const [filters, setFilters] = useState<URLFilters>(() => ({
        categoria: searchParams.get('categoria') ? parseInt(searchParams.get('categoria')!) : null,
        busqueda: searchParams.get('busqueda') || '',
        pagina: searchParams.get('pagina') ? parseInt(searchParams.get('pagina')!) : 1
    }));

    // Función para actualizar la URL cuando cambian los filtros
    const updateURL = useCallback((newFilters: Partial<URLFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };

        // Construir nuevos parámetros de URL
        const newSearchParams = new URLSearchParams();

        if (updatedFilters.categoria) {
            newSearchParams.set('categoria', updatedFilters.categoria.toString());
        }

        if (updatedFilters.busqueda) {
            newSearchParams.set('busqueda', updatedFilters.busqueda);
        }

        if (updatedFilters.pagina > 1) {
            newSearchParams.set('pagina', updatedFilters.pagina.toString());
        }

        // Actualizar la URL sin recargar la página
        setSearchParams(newSearchParams);
    }, [filters, setSearchParams]);

    // Función para actualizar filtros
    const updateFilters = useCallback((newFilters: Partial<URLFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        updateURL({ ...filters, ...newFilters });
    }, [filters, updateURL]);

    // Función para limpiar todos los filtros
    const clearFilters = useCallback(() => {
        setFilters({
            categoria: null,
            busqueda: '',
            pagina: 1
        });
        setSearchParams({});
    }, [setSearchParams]);

    // Función para cambiar página
    const changePage = useCallback((page: number) => {
        updateFilters({ pagina: page });
    }, [updateFilters]);

    // Función para cambiar categoría
    const changeCategory = useCallback((categoria: number | null) => {
        updateFilters({ categoria, pagina: 1 }); // Reset a página 1 al cambiar categoría
    }, [updateFilters]);


    // Función para cambiar búsqueda
    const changeSearch = useCallback((busqueda: string) => {
        updateFilters({ busqueda, pagina: 1 }); // Reset a página 1 al buscar
    }, [updateFilters]);

    // Sincronizar con cambios en la URL (navegación del navegador)
    useEffect(() => {
        const newFilters: URLFilters = {
            categoria: searchParams.get('categoria') ? parseInt(searchParams.get('categoria')!) : null,
            busqueda: searchParams.get('busqueda') || '',
            pagina: searchParams.get('pagina') ? parseInt(searchParams.get('pagina')!) : 1
        };

        setFilters(newFilters);
    }, [searchParams]);

    return {
        filters,
        updateFilters,
        clearFilters,
        changePage,
        changeCategory,
        changeSearch
    };
}
