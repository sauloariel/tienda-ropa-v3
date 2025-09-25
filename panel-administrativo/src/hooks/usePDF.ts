import { useCallback } from 'react'
import { Producto } from '../services/productos'

export interface PDFOptions {
    title: string
    includeImages?: boolean
    includeVariants?: boolean
    filterByStock?: boolean
    minStock?: number
}

export const usePDF = () => {
    const generateProductsPDF = useCallback(async (
        productos: Producto[],
        options: PDFOptions
    ) => {
        try {
            // Importar librerías dinámicamente
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas')
            ])

            // Filtrar productos según las opciones
            let filteredProductos = productos

            if (options.filterByStock && options.minStock !== undefined) {
                filteredProductos = productos.filter(p => p.stock >= options.minStock!)
            }

            // Crear un elemento temporal para el PDF
            const tempDiv = document.createElement('div')
            tempDiv.style.position = 'absolute'
            tempDiv.style.left = '-9999px'
            tempDiv.style.top = '0'
            tempDiv.style.width = '800px'
            tempDiv.style.backgroundColor = 'white'
            tempDiv.style.padding = '20px'
            tempDiv.style.fontFamily = 'Arial, sans-serif'

            // Generar HTML para el PDF
            const htmlContent = generateProductsHTML(filteredProductos, options)
            tempDiv.innerHTML = htmlContent

            document.body.appendChild(tempDiv)

            // Generar canvas del HTML
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            })

            // Crear PDF
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')

            const imgWidth = 210
            const pageHeight = 295
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight

            let position = 0

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            // Limpiar elemento temporal
            document.body.removeChild(tempDiv)

            // Descargar PDF
            const fileName = `listado-productos-${new Date().toISOString().split('T')[0]}.pdf`
            pdf.save(fileName)

            return true
        } catch (error) {
            console.error('Error generando PDF:', error)
            throw error
        }
    }, [])

    const generateProductsHTML = (productos: Producto[], options: PDFOptions): string => {
        const formatPrice = (price: number): string =>
            new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

        const getStatusText = (estado: string) =>
            estado.toUpperCase() === 'ACTIVO' ? 'Activo' : 'Inactivo'

        const getStockColor = (stock: number, stockSeguridad: number) => {
            if (stock <= stockSeguridad) return '#ffebee'
            if (stock <= stockSeguridad * 2) return '#fff3e0'
            return '#e8f5e8'
        }

        return `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h1 style="margin: 0; color: #333; font-size: 24px;">${options.title}</h1>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
            Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
            Total de productos: ${productos.length}
          </p>
        </div>

        <!-- Tabla de productos -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
          <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #333;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">ID</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Categoría</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Proveedor</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Precio Venta</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Precio Compra</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Stock</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Stock Seg.</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Estado</th>
              ${options.includeVariants ? '<th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Variantes</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${productos.map((producto, index) => `
              <tr style="border-bottom: 1px solid #eee; ${index % 2 === 0 ? 'background-color: #fafafa;' : ''}">
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${producto.id_producto}</td>
                <td style="padding: 6px; border: 1px solid #ddd; max-width: 200px;">
                  <div style="font-weight: bold; margin-bottom: 2px;">${producto.descripcion}</div>
                </td>
                <td style="padding: 6px; border: 1px solid #ddd;">
                  ${producto.categoria?.nombre_categoria || 'Sin categoría'}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd;">
                  ${producto.proveedor?.nombre || 'Sin proveedor'}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #2e7d32;">
                  ${formatPrice(producto.precio_venta)}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right; color: #666;">
                  ${formatPrice(producto.precio_compra)}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; background-color: ${getStockColor(producto.stock, producto.stock_seguridad)}; font-weight: bold;">
                  ${producto.stock}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                  ${producto.stock_seguridad}
                </td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                  <span style="padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; 
                    ${producto.estado.toUpperCase() === 'ACTIVO' ? 'background-color: #e8f5e8; color: #2e7d32;' : 'background-color: #ffebee; color: #c62828;'}">
                    ${getStatusText(producto.estado)}
                  </span>
                </td>
                ${options.includeVariants ? `
                  <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                    ${producto.variantes?.length || 0}
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Resumen al final -->
        <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Resumen</h3>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <strong>Total Productos:</strong> ${productos.length}
            </div>
            <div>
              <strong>Productos Activos:</strong> ${productos.filter(p => p.estado.toUpperCase() === 'ACTIVO').length}
            </div>
            <div>
              <strong>Valor Total Inventario:</strong> ${formatPrice(
            productos.reduce((sum, p) => sum + (p.precio_venta * p.stock), 0)
        )}
            </div>
            <div>
              <strong>Stock Total:</strong> ${productos.reduce((sum, p) => sum + p.stock, 0)} unidades
            </div>
          </div>
        </div>
      </div>
    `
    }

    return {
        generateProductsPDF
    }
}
