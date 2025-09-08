import { useEffect, useRef, useState, useCallback } from 'react'
import { obtenerSiguienteNumeroFactura } from '../services/factura'

export function useStableInvoiceNumber() {
    const [value, setValue] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNextNumber = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await obtenerSiguienteNumeroFactura()
            setValue(res?.numero ?? null)
        } catch (e: any) {
            setError(e?.message || 'No se pudo obtener el número')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNextNumber()
    }, [fetchNextNumber])

    return {
        value,
        loading,
        error,
        refresh: fetchNextNumber
    }
}
