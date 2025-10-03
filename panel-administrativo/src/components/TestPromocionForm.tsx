import React, { useState } from 'react';

const TestPromocionForm: React.FC = () => {
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
        estado: 'ACTIVA' as 'ACTIVA' | 'INACTIVA' | 'EXPIRADA',
        productos: [] as number[]
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const data = {
                ...formData,
                valor: parseFloat(formData.valor),
                minimo_compra: formData.minimo_compra ? parseFloat(formData.minimo_compra) : undefined,
                uso_maximo: formData.uso_maximo ? parseInt(formData.uso_maximo) : undefined,
                codigo_descuento: formData.codigo_descuento || undefined,
                productos: formData.productos
            };

            console.log('Enviando datos:', data);

            const response = await fetch('http://localhost:4000/api/marketing/promociones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const nuevaPromocion = await response.json();
                setResult({ success: true, data: nuevaPromocion });
                console.log('✅ Promoción creada:', nuevaPromocion);
            } else {
                const error = await response.json();
                setResult({ success: false, error });
                console.error('❌ Error:', error);
            }
        } catch (error) {
            setResult({ success: false, error: error.message });
            console.error('❌ Error de conexión:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Test Crear Promoción</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre de la promoción"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descripción de la promoción"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo *
                        </label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="PORCENTAJE">Porcentaje</option>
                            <option value="MONTO_FIJO">Monto Fijo</option>
                            <option value="2X1">2x1</option>
                            <option value="DESCUENTO_ESPECIAL">Descuento Especial</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor *
                        </label>
                        <input
                            type="number"
                            value={formData.valor}
                            onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="20"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de Descuento
                    </label>
                    <input
                        type="text"
                        value={formData.codigo_descuento}
                        onChange={(e) => setFormData(prev => ({ ...prev, codigo_descuento: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="VERANO20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Inicio *
                        </label>
                        <input
                            type="date"
                            value={formData.fecha_inicio}
                            onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Fin *
                        </label>
                        <input
                            type="date"
                            value={formData.fecha_fin}
                            onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto Mínimo
                        </label>
                        <input
                            type="number"
                            value={formData.minimo_compra}
                            onChange={(e) => setFormData(prev => ({ ...prev, minimo_compra: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Uso Máximo
                        </label>
                        <input
                            type="number"
                            value={formData.uso_maximo}
                            onChange={(e) => setFormData(prev => ({ ...prev, uso_maximo: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="100"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creando...' : 'Crear Promoción'}
                </button>
            </form>

            {result && (
                <div className={`mt-6 p-4 rounded-md ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                    <h3 className={`font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {result.success ? '✅ Promoción Creada Exitosamente' : '❌ Error al Crear Promoción'}
                    </h3>
                    <pre className={`mt-2 text-sm ${
                        result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TestPromocionForm;





