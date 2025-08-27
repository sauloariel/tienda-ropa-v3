import React from 'react';
import { X, Download, Printer, CheckCircle } from 'lucide-react';
import { Factura } from '../types/factura.types';
import { generarPDFFactura } from '../services/facturaService';

interface FacturaModalProps {
    isOpen: boolean;
    onClose: () => void;
    factura: Factura | null;
    onFacturaCompletada: () => void;
}

const FacturaModal: React.FC<FacturaModalProps> = ({
    isOpen,
    onClose,
    factura,
    onFacturaCompletada
}) => {
    if (!isOpen || !factura) return null;

    const handleDownloadPDF = async () => {
        try {
            await generarPDFFactura(factura);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        onClose();
        onFacturaCompletada();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">¡Venta Completada!</h2>
                            <p className="text-gray-600">Factura generada exitosamente</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Contenido de la Factura */}
                <div className="p-6">
                    {/* Encabezado de la Factura */}
                    <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">FACTURA</h1>
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                            {factura.numeroFactura}
                        </h2>
                        <p className="text-gray-600">
                            Fecha: {new Date(factura.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Información del Cliente */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                            Información del Cliente
                        </h3>
                        {factura.cliente ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="font-medium text-gray-600">Nombre:</span>
                                    <p className="text-gray-800">{factura.cliente.nombre}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Email:</span>
                                    <p className="text-gray-800">{factura.cliente.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Teléfono:</span>
                                    <p className="text-gray-800">{factura.cliente.telefono || 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-800 font-medium">Cliente: Consumidor Final</p>
                        )}
                    </div>

                    {/* Detalle de Productos */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                            Detalle de Productos
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                            Producto
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                                            Cantidad
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                                            Precio Unit.
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {factura.detalles.map((detalle, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 px-4 py-3 text-gray-800">
                                                {detalle.producto?.nombre || 'Producto'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                                                {detalle.cantidad}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                                                ${detalle.precio_unitario.toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-right text-gray-800 font-medium">
                                                ${detalle.subtotal.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Resumen y Total */}
                    <div className="text-right border-t-2 border-gray-300 pt-6">
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                            Total: ${factura.total.toFixed(2)}
                        </div>
                        <div className="text-gray-600 space-y-1">
                            <p>Método de Pago: <span className="font-medium">{factura.metodo_pago}</span></p>
                            <p>Estado: <span className="font-medium text-green-600">{factura.estado}</span></p>
                        </div>
                    </div>

                    {/* Mensaje de agradecimiento */}
                    <div className="mt-8 text-center text-gray-600">
                        <p className="text-lg">¡Gracias por su compra!</p>
                        <p className="text-sm">Esta factura fue generada automáticamente por el sistema POS</p>
                    </div>
                </div>

                {/* Footer con Botones */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        <p>Factura #{factura.numeroFactura}</p>
                        <p>Generada el {new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Imprimir</span>
                        </button>
                        
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Descargar PDF</span>
                        </button>
                        
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacturaModal;
