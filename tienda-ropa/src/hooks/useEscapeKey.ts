import { useEffect } from 'react';

/**
 * Hook personalizado para manejar la tecla Escape
 * @param onEscape - Función a ejecutar cuando se presiona Escape
 * @param dependencies - Dependencias del useEffect
 */
export const useEscapeKey = (onEscape: () => void, dependencies: any[] = []) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                console.log('🔙 Tecla Escape presionada');
                onEscape();
            }
        };

        // Agregar el event listener
        document.addEventListener('keydown', handleKeyDown);

        // Limpiar el event listener al desmontar
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, dependencies);
};

export default useEscapeKey;
