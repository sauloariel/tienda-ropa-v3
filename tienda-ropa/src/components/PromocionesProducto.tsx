import React from 'react';
import { Percent, Gift, DollarSign, Target, Clock } from 'lucide-react';

interface Promocion {
    id_promocion: number;
    nombre: string;
    descripcion: string;
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';
    valor: number;
    codigo_descuento?: string;
    fecha_fin: string;
    minimo_compra?: number;
}

interface PromocionBadgeProps {
    promocion: Promocion;
    precioOriginal: number;
}

export const PromocionBadge: React.FC<PromocionBadgeProps> = ({ promocion, precioOriginal }) => {
    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'PORCENTAJE': return <Percent className="h-4 w-4" />;
            case 'MONTO_FIJO': return <DollarSign className="h-4 w-4" />;
            case '2X1': return <Gift className="h-4 w-4" />;
            case 'DESCUENTO_ESPECIAL': return <Target className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    const getTipoTexto = (tipo: string) => {
        switch (tipo) {
            case 'PORCENTAJE': return `${promocion.valor}% OFF`;
            case 'MONTO_FIJO': return `$${promocion.valor} OFF`;
            case '2X1': return '2x1';
            case 'DESCUENTO_ESPECIAL': return 'OFERTA ESPECIAL';
            default: return 'OFERTA';
        }
    };

    const calcularPrecioConDescuento = () => {
        switch (promocion.tipo) {
            case 'PORCENTAJE':
                return precioOriginal * (1 - promocion.valor / 100);
            case 'MONTO_FIJO':
                return Math.max(0, precioOriginal - promocion.valor);
            case '2X1':
                return precioOriginal; // El segundo es gratis
            default:
                return precioOriginal;
        }
    };

    const precioConDescuento = calcularPrecioConDescuento();
    const fechaFin = new Date(promocion.fecha_fin);
    const diasRestantes = Math.ceil((fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-3 mb-2 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    {getTipoIcon(promocion.tipo)}
                    <span className="font-bold text-sm">{getTipoTexto(promocion.tipo)}</span>
                </div>
                {diasRestantes > 0 && (
                    <div className="flex items-center space-x-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{diasRestantes}d restantes</span>
                    </div>
                )}
            </div>
            
            <div className="text-xs mb-1">
                <span className="line-through opacity-75">${precioOriginal.toFixed(2)}</span>
                <span className="ml-2 font-bold">${precioConDescuento.toFixed(2)}</span>
            </div>
            
            {promocion.codigo_descuento && (
                <div className="text-xs opacity-90">
                    Código: {promocion.codigo_descuento}
                </div>
            )}
            
            {promocion.minimo_compra && (
                <div className="text-xs opacity-75">
                    Mín. compra: ${promocion.minimo_compra}
                </div>
            )}
        </div>
    );
};

interface PromocionesProductoProps {
    productoId: number;
    precioOriginal: number;
}

export const PromocionesProducto: React.FC<PromocionesProductoProps> = ({ productoId, precioOriginal }) => {
    const [promociones, setPromociones] = React.useState<Promocion[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const cargarPromociones = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/marketing/promociones-activas?productos=${productoId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPromociones(data);
                }
            } catch (error) {
                console.error('Error cargando promociones:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarPromociones();
    }, [productoId]);

    if (loading) {
        return (
            <div className="bg-gray-100 rounded-lg p-2 mb-2">
                <div className="animate-pulse text-xs text-gray-500">Cargando promociones...</div>
            </div>
        );
    }

    if (promociones.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {promociones.map((promocion) => (
                <PromocionBadge
                    key={promocion.id_promocion}
                    promocion={promocion}
                    precioOriginal={precioOriginal}
                />
            ))}
        </div>
    );
};

export default PromocionesProducto;





