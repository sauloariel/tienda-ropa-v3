// models/Productos.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Categorias } from './Categorias.model';
import { Proveedores } from './Proveedores.model';
import { Temporadas } from './Temporadas.model';
import { DetallePedidos } from './DetallePedidos.model';
import { Imagenes } from './Imagenes.model';
import { ProductoVariante } from './ProductoVariante.model';

@Table({ tableName: 'productos', timestamps: false })
export class Productos extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_producto!: number;

  @Unique
  @Column(DataType.STRING(40))
  descripcion!: string;

  @ForeignKey(() => Proveedores)
  @Column(DataType.INTEGER)
  id_proveedor!: number;

  @BelongsTo(() => Proveedores, 'id_proveedor')
  proveedor!: Proveedores;

  @ForeignKey(() => Categorias)
  @Column(DataType.INTEGER)
  id_categoria!: number;

  @BelongsTo(() => Categorias, 'id_categoria')
  categoria!: Categorias;

  @ForeignKey(() => Temporadas)
  @Column(DataType.INTEGER)
  id_temporada!: number;

  @BelongsTo(() => Temporadas, 'id_temporada')
  temporada!: Temporadas;

  @Column(DataType.INTEGER)
  stock!: number;

  @Column(DataType.DECIMAL(20, 2))
  precio_venta!: number;

  @Column(DataType.DECIMAL(20, 2))
  precio_compra!: number;

  @Column(DataType.INTEGER)
  stock_seguridad!: number;

  @Column(DataType.STRING(8))
  estado!: string;

  @HasMany(() => ProductoVariante)
  variantes!: ProductoVariante[];

  @HasMany(() => DetallePedidos)
  detallePedidos!: DetallePedidos[];

  @HasMany(() => Imagenes, 'id_productos')
  imagenes!: Imagenes[];
}
export default Productos;