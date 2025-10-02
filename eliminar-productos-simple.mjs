import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'backend_definitivo', 'database.sqlite');

async function eliminarProductosTest() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error conectando a la base de datos:', err.message);
                reject(err);
                return;
            }
            console.log('✅ Conectado a la base de datos SQLite');
        });

        // Buscar productos que contengan "Test Producto con Variante"
        db.all("SELECT id_producto, descripcion, stock, precio_venta FROM productos WHERE descripcion LIKE '%Test Producto con Variante%'", (err, productos) => {
            if (err) {
                console.error('❌ Error buscando productos:', err.message);
                db.close();
                reject(err);
                return;
            }

            console.log(`🔍 Productos encontrados: ${productos.length}`);

            if (productos.length === 0) {
                console.log('❌ No se encontraron productos con "Test Producto con Variante"');
                db.close();
                resolve();
                return;
            }

            productos.forEach(producto => {
                console.log(`📦 ID: ${producto.id_producto}, Descripción: ${producto.descripcion}, Stock: ${producto.stock}`);
            });

            // Función para eliminar productos uno por uno
            let index = 0;

            function eliminarSiguienteProducto() {
                if (index >= productos.length) {
                    // Verificar que se eliminaron
                    db.get("SELECT COUNT(*) as count FROM productos WHERE descripcion LIKE '%Test Producto con Variante%'", (err, result) => {
                        if (err) {
                            console.error('❌ Error verificando eliminación:', err.message);
                        } else {
                            console.log(`🔍 Productos restantes con "Test Producto con Variante": ${result.count}`);
                        }
                        db.close();
                        resolve();
                    });
                    return;
                }

                const producto = productos[index];
                console.log(`🗑️ Eliminando producto ID: ${producto.id_producto} - ${producto.descripcion}`);

                // Eliminar en orden: variantes, imágenes, detalles de pedidos, producto
                db.serialize(() => {
                    // Eliminar variantes
                    db.run("DELETE FROM producto_variante WHERE id_producto = ?", [producto.id_producto], function (err) {
                        if (err) {
                            console.error(`❌ Error eliminando variantes:`, err.message);
                        } else {
                            console.log(`🗑️ Variantes eliminadas: ${this.changes}`);
                        }
                    });

                    // Eliminar imágenes
                    db.run("DELETE FROM imagenes WHERE id_productos = ?", [producto.id_producto], function (err) {
                        if (err) {
                            console.error(`❌ Error eliminando imágenes:`, err.message);
                        } else {
                            console.log(`🖼️ Imágenes eliminadas: ${this.changes}`);
                        }
                    });

                    // Eliminar detalles de pedidos
                    db.run("DELETE FROM detalle_pedidos WHERE id_producto = ?", [producto.id_producto], function (err) {
                        if (err) {
                            console.error(`❌ Error eliminando detalles de pedidos:`, err.message);
                        } else {
                            console.log(`📋 Detalles de pedidos eliminados: ${this.changes}`);
                        }
                    });

                    // Eliminar producto principal
                    db.run("DELETE FROM productos WHERE id_producto = ?", [producto.id_producto], function (err) {
                        if (err) {
                            console.error(`❌ Error eliminando producto:`, err.message);
                        } else {
                            console.log(`✅ Producto eliminado: ${this.changes}`);
                        }

                        index++;
                        setTimeout(eliminarSiguienteProducto, 100); // Pequeña pausa entre eliminaciones
                    });
                });
            }

            eliminarSiguienteProducto();
        });
    });
}

eliminarProductosTest()
    .then(() => {
        console.log('✅ Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error en el proceso:', error);
        process.exit(1);
    });





