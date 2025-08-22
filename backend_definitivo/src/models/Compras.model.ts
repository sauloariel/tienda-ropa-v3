import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Proveedores } from './Proveedores.model';
import { Productos } from './Productos.model';

@Table({ tableName: 'compras', timestamps: false })
export class Compras extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_compra!: number;

  @ForeignKey(() => Proveedores)
  @Column(DataType.INTEGER)
  id_proveedor!: number;

  @BelongsTo(() => Proveedores)
  proveedor!: Proveedores;

  @Column(DataType.STRING(50))
  nro_factura!: string;

  @Column(DataType.DATE)
  fecha!: Date;

  @ForeignKey(() => Productos)
  @Column(DataType.INTEGER)
  id_producto_stock!: number;

  @BelongsTo(() => Productos)
  producto!: Productos;
}
export default Compras;