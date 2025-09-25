// Script para cargar pedidos completos con productos en la base de datos
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Definir modelos
const Clientes = sequelize.define('clientes', {
  id_cliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dni: { type: DataTypes.STRING(10), unique: true },
  cuit_cuil: { type: DataTypes.STRING(13) },
  nombre: { type: DataTypes.STRING(25) },
  apellido: { type: DataTypes.STRING(25) },
  domicilio: { type: DataTypes.STRING(30) },
  telefono: { type: DataTypes.STRING(13) },
  mail: { type: DataTypes.STRING(35) },
  estado: { type: DataTypes.STRING(8), defaultValue: 'ACTIVO' },
  password: { type: DataTypes.STRING(255) }
}, { tableName: 'clientes', timestamps: false });

const Empleados = sequelize.define('empleados', {
  id_empleado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cuil: { type: DataTypes.STRING(11), unique: true },
  nombre: { type: DataTypes.STRING(25) },
  apellido: { type: DataTypes.STRING(30) },
  domicilio: { type: DataTypes.STRING(35) },
  telefono: { type: DataTypes.STRING(13) },
  mail: { type: DataTypes.STRING(45) },
  sueldo: { type: DataTypes.DECIMAL(12, 2) },
  puesto: { type: DataTypes.STRING(20) },
  estado: { type: DataTypes.STRING(8), defaultValue: 'ACTIVO' }
}, { tableName: 'empleados', timestamps: false });

const Categorias = sequelize.define('categorias', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_categoria: { type: DataTypes.STRING(50), unique: true },
  descripcion: { type: DataTypes.STRING(50) },
  estado: { type: DataTypes.STRING(8), defaultValue: 'ACTIVO' }
}, { tableName: 'categorias', timestamps: false });

const Proveedores = sequelize.define('proveedores', {
  id_proveedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50) },
  contacto: { type: DataTypes.STRING(50) },
  direccion: { type: DataTypes.STRING(100) },
  telefono: { type: DataTypes.STRING(20) }
}, { tableName: 'proveedores', timestamps: false });

const Productos = sequelize.define('productos', {
  id_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcion: { type: DataTypes.STRING(40), unique: true },
  id_proveedor: { type: DataTypes.INTEGER },
  id_categoria: { type: DataTypes.INTEGER },
  stock: { type: DataTypes.INTEGER },
  precio_venta: { type: DataTypes.DECIMAL(20, 2) },
  precio_compra: { type: DataTypes.DECIMAL(20, 2) },
  stock_seguridad: { type: DataTypes.INTEGER },
  estado: { type: DataTypes.STRING(8), defaultValue: 'ACTIVO' }
}, { tableName: 'productos', timestamps: false });

const Pedidos = sequelize.define('pedidos', {
  id_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.INTEGER },
  id_empleados: { type: DataTypes.INTEGER },
  fecha_pedido: { type: DataTypes.DATE },
  importe: { type: DataTypes.DECIMAL(10, 2) },
  estado: { type: DataTypes.STRING(20) },
  anulacion: { type: DataTypes.BOOLEAN, defaultValue: false },
  venta_web: { type: DataTypes.BOOLEAN, defaultValue: false },
  payment_id: { type: DataTypes.STRING(255) }
}, { tableName: 'pedidos', timestamps: false });

const DetallePedidos = sequelize.define('detalle_pedidos', {
  id_pedido: { type: DataTypes.INTEGER },
  id_producto: { type: DataTypes.INTEGER },
  precio_venta: { type: DataTypes.DECIMAL(10, 2) },
  cantidad: { type: DataTypes.INTEGER },
  descuento: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
}, { tableName: 'detalle_pedidos', timestamps: false });

// Definir relaciones
Clientes.hasMany(Pedidos, { foreignKey: 'id_cliente', as: 'pedidos' });
Pedidos.belongsTo(Clientes, { foreignKey: 'id_cliente', as: 'cliente' });

Empleados.hasMany(Pedidos, { foreignKey: 'id_empleados', as: 'pedidos' });
Pedidos.belongsTo(Empleados, { foreignKey: 'id_empleados', as: 'empleado' });

Pedidos.hasMany(DetallePedidos, { foreignKey: 'id_pedido', as: 'detalle' });
DetallePedidos.belongsTo(Pedidos, { foreignKey: 'id_pedido', as: 'pedido' });

Productos.hasMany(DetallePedidos, { foreignKey: 'id_producto', as: 'detallePedidos' });
DetallePedidos.belongsTo(Productos, { foreignKey: 'id_producto', as: 'producto' });

Categorias.hasMany(Productos, { foreignKey: 'id_categoria', as: 'productos' });
Productos.belongsTo(Categorias, { foreignKey: 'id_categoria', as: 'categoria' });

Proveedores.hasMany(Productos, { foreignKey: 'id_proveedor', as: 'productos' });
Productos.belongsTo(Proveedores, { foreignKey: 'id_proveedor', as: 'proveedor' });

// Datos de ejemplo
const datosEjemplo = {
  clientes: [
    {
      dni: '12345678',
      cuit_cuil: '20-12345678-9',
      nombre: 'Juan',
      apellido: 'Pérez',
      domicilio: 'Calle Falsa 123',
      telefono: '1145678901',
      mail: 'juan.perez@email.com',
      estado: 'ACTIVO'
    },
    {
      dni: '87654321',
      cuit_cuil: '20-87654321-0',
      nombre: 'María',
      apellido: 'González',
      domicilio: 'Av. Siempre Viva 456',
      telefono: '1156789012',
      mail: 'maria.gonzalez@email.com',
      estado: 'ACTIVO'
    },
    {
      dni: '11223344',
      cuit_cuil: '20-11223344-5',
      nombre: 'Carlos',
      apellido: 'López',
      domicilio: 'Calle Principal 789',
      telefono: '1167890123',
      mail: 'carlos.lopez@email.com',
      estado: 'ACTIVO'
    },
    {
      dni: '55667788',
      cuit_cuil: '20-55667788-1',
      nombre: 'Ana',
      apellido: 'Martínez',
      domicilio: 'Boulevard Central 321',
      telefono: '1178901234',
      mail: 'ana.martinez@email.com',
      estado: 'ACTIVO'
    }
  ],

  empleados: [
    {
      cuil: '20-12345678-9',
      nombre: 'Luis',
      apellido: 'Vendedor',
      domicilio: 'Calle Empleado 100',
      telefono: '1189012345',
      mail: 'luis.vendedor@tienda.com',
      sueldo: 50000.00,
      puesto: 'Vendedor',
      estado: 'ACTIVO'
    },
    {
      cuil: '20-98765432-1',
      nombre: 'Sofia',
      apellido: 'Cajera',
      domicilio: 'Av. Trabajador 200',
      telefono: '1190123456',
      mail: 'sofia.cajera@tienda.com',
      sueldo: 45000.00,
      puesto: 'Cajera',
      estado: 'ACTIVO'
    }
  ],

  categorias: [
    { nombre_categoria: 'Ropa', descripcion: 'Vestimenta para todas las edades', estado: 'ACTIVO' },
    { nombre_categoria: 'Calzado', descripcion: 'Zapatos y zapatillas', estado: 'ACTIVO' },
    { nombre_categoria: 'Accesorios', descripcion: 'Complementos y accesorios', estado: 'ACTIVO' },
    { nombre_categoria: 'Deportes', descripcion: 'Ropa y calzado deportivo', estado: 'ACTIVO' }
  ],

  proveedores: [
    {
      nombre: 'Proveedor Textil S.A.',
      contacto: 'Roberto García',
      direccion: 'Av. Industrial 1000',
      telefono: '11-4000-0001'
    },
    {
      nombre: 'Calzados del Norte',
      contacto: 'Patricia Fernández',
      direccion: 'Calle Calzado 500',
      telefono: '11-4000-0002'
    },
    {
      nombre: 'Accesorios Moda',
      contacto: 'Diego Rodríguez',
      direccion: 'Boulevard Accesorios 300',
      telefono: '11-4000-0003'
    }
  ],

  productos: [
    {
      descripcion: 'Remera Básica Algodón',
      id_proveedor: 1,
      id_categoria: 1,
      stock: 50,
      precio_venta: 2500.00,
      precio_compra: 1500.00,
      stock_seguridad: 10,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Jean Clásico Azul',
      id_proveedor: 1,
      id_categoria: 1,
      stock: 30,
      precio_venta: 8500.00,
      precio_compra: 5000.00,
      stock_seguridad: 5,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Zapatillas Deportivas',
      id_proveedor: 2,
      id_categoria: 2,
      stock: 25,
      precio_venta: 12000.00,
      precio_compra: 8000.00,
      stock_seguridad: 5,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Campera de Cuero',
      id_proveedor: 1,
      id_categoria: 1,
      stock: 15,
      precio_venta: 25000.00,
      precio_compra: 15000.00,
      stock_seguridad: 3,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Bolso de Cuero',
      id_proveedor: 3,
      id_categoria: 3,
      stock: 20,
      precio_venta: 8000.00,
      precio_compra: 5000.00,
      stock_seguridad: 5,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Gorra Deportiva',
      id_proveedor: 3,
      id_categoria: 4,
      stock: 40,
      precio_venta: 3500.00,
      precio_compra: 2000.00,
      stock_seguridad: 10,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Pantalón Deportivo',
      id_proveedor: 1,
      id_categoria: 4,
      stock: 35,
      precio_venta: 6000.00,
      precio_compra: 3500.00,
      stock_seguridad: 8,
      estado: 'ACTIVO'
    },
    {
      descripcion: 'Zapatos de Vestir',
      id_proveedor: 2,
      id_categoria: 2,
      stock: 20,
      precio_venta: 15000.00,
      precio_compra: 9000.00,
      stock_seguridad: 4,
      estado: 'ACTIVO'
    }
  ],

  pedidos: [
    {
      id_cliente: 1,
      id_empleados: 1,
      fecha_pedido: new Date('2024-01-15T10:30:00'),
      importe: 11000.00,
      estado: 'completado',
      anulacion: false,
      venta_web: false,
      payment_id: null,
      productos: [
        { id_producto: 1, cantidad: 2, precio_venta: 2500.00, descuento: 0 },
        { id_producto: 2, cantidad: 1, precio_venta: 8500.00, descuento: 500.00 }
      ]
    },
    {
      id_cliente: 2,
      id_empleados: 2,
      fecha_pedido: new Date('2024-01-16T14:20:00'),
      importe: 12000.00,
      estado: 'completado',
      anulacion: false,
      venta_web: false,
      payment_id: null,
      productos: [
        { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 0 }
      ]
    },
    {
      id_cliente: 3,
      id_empleados: 1,
      fecha_pedido: new Date('2024-01-17T09:15:00'),
      importe: 33000.00,
      estado: 'procesando',
      anulacion: false,
      venta_web: false,
      payment_id: null,
      productos: [
        { id_producto: 4, cantidad: 1, precio_venta: 25000.00, descuento: 0 },
        { id_producto: 5, cantidad: 1, precio_venta: 8000.00, descuento: 0 }
      ]
    },
    {
      id_cliente: 4,
      id_empleados: 2,
      fecha_pedido: new Date('2024-01-18T16:45:00'),
      importe: 9500.00,
      estado: 'pendiente',
      anulacion: false,
      venta_web: false,
      payment_id: null,
      productos: [
        { id_producto: 6, cantidad: 2, precio_venta: 3500.00, descuento: 0 },
        { id_producto: 7, cantidad: 1, precio_venta: 6000.00, descuento: 500.00 }
      ]
    },
    {
      id_cliente: 1,
      id_empleados: 1,
      fecha_pedido: new Date('2024-01-19T11:30:00'),
      importe: 15000.00,
      estado: 'completado',
      anulacion: false,
      venta_web: true,
      payment_id: 'web_123456789',
      productos: [
        { id_producto: 8, cantidad: 1, precio_venta: 15000.00, descuento: 0 }
      ]
    },
    {
      id_cliente: 2,
      id_empleados: 2,
      fecha_pedido: new Date('2024-01-20T13:20:00'),
      importe: 17500.00,
      estado: 'completado',
      anulacion: false,
      venta_web: true,
      payment_id: 'web_987654321',
      productos: [
        { id_producto: 1, cantidad: 3, precio_venta: 2500.00, descuento: 0 },
        { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 2000.00 }
      ]
    },
    {
      id_cliente: 3,
      id_empleados: 1,
      fecha_pedido: new Date('2024-01-21T15:10:00'),
      importe: 22000.00,
      estado: 'cancelado',
      anulacion: true,
      venta_web: false,
      payment_id: null,
      productos: [
        { id_producto: 4, cantidad: 1, precio_venta: 25000.00, descuento: 3000.00 }
      ]
    },
    {
      id_cliente: 4,
      id_empleados: 2,
      fecha_pedido: new Date('2024-01-22T10:00:00'),
      importe: 12000.00,
      estado: 'completado',
      anulacion: false,
      venta_web: true,
      payment_id: 'web_456789123',
      productos: [
        { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 0 }
      ]
    }
  ]
};

async function cargarDatos() {
  try {
    console.log('🚀 Iniciando carga de datos en la base de datos...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Sincronizar modelos
    await sequelize.sync({ force: true });
    console.log('✅ Modelos sincronizados');

    // Cargar categorías
    console.log('📂 Cargando categorías...');
    await Categorias.bulkCreate(datosEjemplo.categorias);
    console.log(`✅ ${datosEjemplo.categorias.length} categorías cargadas`);

    // Cargar proveedores
    console.log('🏭 Cargando proveedores...');
    await Proveedores.bulkCreate(datosEjemplo.proveedores);
    console.log(`✅ ${datosEjemplo.proveedores.length} proveedores cargados`);

    // Cargar productos
    console.log('👕 Cargando productos...');
    await Productos.bulkCreate(datosEjemplo.productos);
    console.log(`✅ ${datosEjemplo.productos.length} productos cargados`);

    // Cargar clientes
    console.log('👥 Cargando clientes...');
    await Clientes.bulkCreate(datosEjemplo.clientes);
    console.log(`✅ ${datosEjemplo.clientes.length} clientes cargados`);

    // Cargar empleados
    console.log('👨‍💼 Cargando empleados...');
    await Empleados.bulkCreate(datosEjemplo.empleados);
    console.log(`✅ ${datosEjemplo.empleados.length} empleados cargados`);

    // Cargar pedidos y detalles
    console.log('🛒 Cargando pedidos y productos...');
    for (const pedidoData of datosEjemplo.pedidos) {
      const { productos, ...pedidoInfo } = pedidoData;
      
      // Crear pedido
      const pedido = await Pedidos.create(pedidoInfo);
      console.log(`  📦 Pedido #${pedido.id_pedido} creado - Cliente: ${pedido.id_cliente} - Total: $${pedido.importe}`);
      
      // Crear detalles del pedido
      for (const producto of productos) {
        await DetallePedidos.create({
          id_pedido: pedido.id_pedido,
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_venta: producto.precio_venta,
          descuento: producto.descuento
        });
        
        // Actualizar stock del producto
        const productoBD = await Productos.findByPk(producto.id_producto);
        if (productoBD) {
          await productoBD.update({
            stock: productoBD.stock - producto.cantidad
          });
        }
      }
      
      console.log(`    ✅ ${productos.length} productos agregados al pedido`);
    }

    console.log(`✅ ${datosEjemplo.pedidos.length} pedidos cargados exitosamente`);

    // Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS CARGADOS:');
    console.log(`👥 Clientes: ${datosEjemplo.clientes.length}`);
    console.log(`👨‍💼 Empleados: ${datosEjemplo.empleados.length}`);
    console.log(`📂 Categorías: ${datosEjemplo.categorias.length}`);
    console.log(`🏭 Proveedores: ${datosEjemplo.proveedores.length}`);
    console.log(`👕 Productos: ${datosEjemplo.productos.length}`);
    console.log(`🛒 Pedidos: ${datosEjemplo.pedidos.length}`);
    
    // Contar detalles de pedidos
    const totalDetalles = datosEjemplo.pedidos.reduce((sum, pedido) => sum + pedido.productos.length, 0);
    console.log(`📦 Detalles de pedidos: ${totalDetalles}`);

    console.log('\n🎉 ¡Datos cargados exitosamente!');
    console.log('💡 Ahora puedes usar el panel administrativo para ver los pedidos y productos.');

  } catch (error) {
    console.error('❌ Error cargando datos:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar carga de datos
cargarDatos();

