import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage: number;
    initialPage?: number;
}

interface PaginationResult<T> {
    currentItems: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    startIndex: number;
    endIndex: number;
}

export function usePagination<T>({
    items,
    itemsPerPage,
    initialPage = 1
}: UsePaginationProps<T>): PaginationResult<T> {
    const [currentPage, setCurrentPage] = useState(initialPage);

    // Memoizar la longitud de items para evitar re-renders infinitos
    const itemsLength = useMemo(() => items.length, [items.length]);
    const totalPages = Math.ceil(itemsLength / itemsPerPage);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, itemsLength);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const canGoNext = currentPage < totalPages;
    const canGoPrev = currentPage > 1;

    // Reset to page 1 when items length changes (not the items array itself)
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsLength]);

    return {
        currentItems,
        currentPage,
        totalPages,
        totalItems: itemsLength,
        goToPage,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev,
        startIndex,
        endIndex
    };
}
