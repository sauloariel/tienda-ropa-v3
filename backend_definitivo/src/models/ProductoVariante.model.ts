import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Productos } from './Productos.model';
import { Colores } from './Color.model';
import { Tallas } from './Talle.model';

@Table({ tableName: 'producto_variante', timestamps: false })
export class ProductoVariante extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_variante!: number;

  @ForeignKey(() => Productos)
  @Column(DataType.INTEGER)
  id_producto!: number;

  @BelongsTo(() => Productos)
  producto!: Productos;

  @ForeignKey(() => Colores)
  @Column(DataType.INTEGER)
  id_color!: number;

  @BelongsTo(() => Colores)
  color!: Colores;

  @ForeignKey(() => Tallas)
  @Column(DataType.INTEGER)
  id_talla!: number;

  @BelongsTo(() => Tallas)
  talla!: Tallas;

  @Column(DataType.INTEGER)
  stock!: number;
}
export default ProductoVariante;