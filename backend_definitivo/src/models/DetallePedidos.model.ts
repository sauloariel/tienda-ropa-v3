// models/DetallePedidos.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Pedidos } from './Pedidos.model';
import { Productos } from './Productos.model';

@Table({ tableName: 'detalle_pedidos', timestamps: false })
export class DetallePedidos extends Model {
  @ForeignKey(() => Pedidos)
  @Column(DataType.INTEGER({ unsigned: true }))
  id_pedido!: number;

  @BelongsTo(() => Pedidos)
  pedido!: Pedidos;

  @ForeignKey(() => Productos)
  @Column(DataType.INTEGER)
  id_producto!: number;

  @BelongsTo(() => Productos)
  producto!: Productos;

  @Column(DataType.DECIMAL(10,2))
  precio_venta!: number;

  @Column(DataType.INTEGER)
  cantidad!: number;

  @Column(DataType.DECIMAL(10,2))
  descuento?: number;
}
export default DetallePedidos;