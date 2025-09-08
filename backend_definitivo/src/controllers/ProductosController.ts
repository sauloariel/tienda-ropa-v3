import { Request, Response } from "express";
import { Op } from "sequelize";
import { Productos } from "../models/Productos.model";
import { Categorias } from "../models/Categorias.model";
import { Proveedores } from "../models/Proveedores.model";
import { ProductoVariante } from "../models/ProductoVariante.model";
import { Imagenes } from "../models/Imagenes.model";

// Crear producto
export const createProducto = async (req: Request, res: Response) => {
  try {
    const { variantes, imagenes, ...productoData } = req.body;

    console.log('📦 Creando producto con datos:', productoData);
    console.log('🎨 Variantes recibidas:', variantes);

    // Crear el producto principal
    const producto = await Productos.create(productoData);
    console.log('✅ Producto creado con ID:', producto.id_producto);

    // Crear variantes si se proporcionan
    if (variantes && Array.isArray(variantes)) {
      console.log(`🔄 Creando ${variantes.length} variantes...`);

      for (const variante of variantes) {
        console.log('📏 Creando variante:', variante);

        const varianteData = {
          id_producto: producto.id_producto,
          id_talle: parseInt(variante.id_talle),
          id_color: parseInt(variante.id_color),
          stock: parseInt(variante.stock),
          precio_venta: variante.precio_venta || producto.precio_venta
        };

        console.log('📊 Datos de variante a crear:', varianteData);

        const nuevaVariante = await ProductoVariante.create(varianteData);
        console.log('✅ Variante creada:', nuevaVariante.toJSON());
      }
    }

    // Crear imágenes si se proporcionan
    if (imagenes && Array.isArray(imagenes)) {
      console.log(`🖼️ Creando ${imagenes.length} imágenes...`);

      for (const imagen of imagenes) {
        await Imagenes.create({
          id_productos: producto.id_producto,
          nombre_archivo: imagen.nombre_archivo,
          ruta: imagen.ruta,
          descripcion: imagen.descripcion,
          imagen_bin: imagen.imagen_bin
        });
      }
    }

    // Obtener el producto con relaciones
    const productoConRelaciones = await Productos.findByPk(producto.id_producto, {
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Proveedores, as: 'proveedor' },
        {
          model: ProductoVariante,
          as: 'variantes',
          include: [
            { model: require('../models/Color.model').Colores, as: 'color' },
            { model: require('../models/Talle.model').Tallas, as: 'talla' }
          ]
        },
        { model: Imagenes, as: 'imagenes' }
      ]
    });

    console.log('🎯 Producto con relaciones obtenido:', {
      id: productoConRelaciones?.id_producto,
      descripcion: productoConRelaciones?.descripcion,
      variantes: productoConRelaciones?.variantes?.length || 0
    });

    res.status(201).json(productoConRelaciones);
  } catch (error: any) {
    console.error("❌ Error al crear producto", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los productos con relaciones
export const getProductos = async (req: Request, res: Response) => {
  try {
    const { buscar, categoria } = req.query;
    
    // Construir condiciones de búsqueda
    const whereConditions: any = {};
    
    // Filtro por categoría si se proporciona
    if (categoria) {
      whereConditions.id_categoria = categoria;
    }
    
    // Filtro de búsqueda por descripción si se proporciona
    if (buscar) {
      whereConditions.descripcion = {
        [Op.iLike]: `%${buscar}%`
      };
    }

    const productos = await Productos.findAll({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Proveedores, as: 'proveedor' },
        {
          model: ProductoVariante,
          as: 'variantes',
          include: [
            { model: require('../models/Color.model').Colores, as: 'color' },
            { model: require('../models/Talle.model').Tallas, as: 'talla' }
          ]
        },
        { model: Imagenes, as: 'imagenes' }
      ]
    });
    
    console.log(`🔍 Búsqueda de productos - Query: "${buscar}", Categoría: ${categoria}, Resultados: ${productos.length}`);
    res.status(200).json(productos);
  } catch (error: any) {
    console.error("Error al obtener productos", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID con relaciones
export const getProductoById = async (req: Request, res: Response) => {
  try {
    const producto = await Productos.findByPk(req.params.id, {
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Proveedores, as: 'proveedor' },
        {
          model: ProductoVariante,
          as: 'variantes',
          include: [
            { model: require('../models/Color.model').Colores, as: 'color' },
            { model: require('../models/Talle.model').Tallas, as: 'talla' }
          ]
        },
        { model: Imagenes, as: 'imagenes' }
      ]
    });
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener producto", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto por ID
export const updateProducto = async (req: Request, res: Response) => {
  try {
    const { variantes, imagenes, ...productoData } = req.body;
    const producto = await Productos.findByPk(req.params.id);

    if (producto) {
      console.log('🔄 Actualizando producto:', req.params.id);
      console.log('📊 Datos de actualización:', productoData);
      console.log('🎨 Variantes para actualizar:', variantes);

      // Actualizar el producto principal
      await producto.update(productoData);

      // Actualizar variantes si se proporcionan
      if (variantes && Array.isArray(variantes)) {
        console.log(`🔄 Actualizando ${variantes.length} variantes...`);

        // Eliminar variantes existentes
        const deletedVariantes = await ProductoVariante.destroy({ where: { id_producto: producto.id_producto } });
        console.log(`🗑️ Variantes eliminadas: ${deletedVariantes}`);

        // Crear nuevas variantes
        for (const variante of variantes) {
          console.log('📏 Creando variante:', variante);

          const varianteData = {
            id_producto: producto.id_producto,
            id_talle: parseInt(variante.id_talle),
            id_color: parseInt(variante.id_color),
            stock: parseInt(variante.stock),
            precio_venta: variante.precio_venta || producto.precio_venta
          };

          console.log('📊 Datos de variante a crear:', varianteData);

          const nuevaVariante = await ProductoVariante.create(varianteData);
          console.log('✅ Variante creada:', nuevaVariante.toJSON());
        }
      }

      // Actualizar imágenes si se proporcionan
      if (imagenes && Array.isArray(imagenes)) {
        // Eliminar imágenes existentes
        await Imagenes.destroy({ where: { id_productos: producto.id_producto } });

        // Crear nuevas imágenes
        for (const imagen of imagenes) {
          await Imagenes.create({
            id_productos: producto.id_producto,
            nombre_archivo: imagen.nombre_archivo,
            ruta: imagen.ruta,
            descripcion: imagen.descripcion,
            imagen_bin: imagen.imagen_bin
          });
        }
      }

      // Obtener el producto actualizado con relaciones
      const productoActualizado = await Productos.findByPk(req.params.id, {
        include: [
          { model: Categorias, as: 'categoria' },
          { model: Proveedores, as: 'proveedor' },
          {
            model: ProductoVariante,
            as: 'variantes',
            include: [
              { model: require('../models/Color.model').Colores, as: 'color' },
              { model: require('../models/Talle.model').Tallas, as: 'talla' }
            ]
          },
          { model: Imagenes, as: 'imagenes' }
        ]
      });

      console.log('✅ Producto actualizado con variantes:', {
        id: productoActualizado?.id_producto,
        variantes: productoActualizado?.variantes?.length || 0
      });

      res.status(200).json(productoActualizado);
    } else {
      res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }
  } catch (error: any) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar stock de producto
export const updateProductoStock = async (req: Request, res: Response) => {
  try {
    const { cantidad_vendida } = req.body;
    const producto = await Productos.findByPk(req.params.id);

    if (producto) {
      const nuevoStock = Math.max(0, producto.stock - parseInt(cantidad_vendida));
      await producto.update({ stock: nuevoStock });

      console.log(`📊 Stock actualizado para producto ${producto.id_producto}: ${producto.stock} -> ${nuevoStock}`);

      res.status(200).json({
        message: "Stock actualizado exitosamente",
        producto: {
          id_producto: producto.id_producto,
          stock_anterior: producto.stock,
          stock_actual: nuevoStock
        }
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al actualizar stock del producto", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto por ID
export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const deleted = await Productos.destroy({ where: { id_producto: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }
  } catch (error: any) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== FUNCIONES DE CATEGORÍAS ====================

// Crear categoría
export const createCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre_categoria, descripcion, estado } = req.body;

    const categoria = await Categorias.create({
      nombre_categoria,
      descripcion,
      estado,
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error });
  }
};

// Obtener todas las categorías
export const getCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await Categorias.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

// Obtener categoría por ID
export const getCategoriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

// Actualizar categoría
export const updateCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.update(req.body);

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría', error });
  }
};

// Eliminar categoría
export const deleteCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.destroy();

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};
