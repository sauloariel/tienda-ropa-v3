// models/Pedidos.model.ts
import { Table, Column, Model, DataType, PrimaryKey, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Clientes } from './Clientes.model';
import { Empleados } from './Empleados.model';
import { DetallePedidos } from './DetallePedidos.model';

@Table({
  tableName: 'pedidos',
  timestamps: false,
  freezeTableName: true
})
export class Pedidos extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_pedido!: number;

  @ForeignKey(() => Clientes)
  @Column(DataType.INTEGER)
  id_cliente!: number;

  @BelongsTo(() => Clientes)
  cliente!: Clientes;

  @ForeignKey(() => Empleados)
  @Column(DataType.INTEGER)
  id_empleados!: number;

  @BelongsTo(() => Empleados)
  empleado!: Empleados;

  @Column(DataType.DATE)
  fecha_pedido!: Date;

  @Column(DataType.DECIMAL(10, 2))
  importe!: number;

  @Column(DataType.STRING(20))
  estado!: string;

  @Column(DataType.BOOLEAN)
  anulacion!: boolean;

  @Column(DataType.BOOLEAN)
  venta_web!: boolean;

  @Column(DataType.STRING(255))
  payment_id?: string;

  @HasMany(() => DetallePedidos)
  detalle!: DetallePedidos[];
}

export default Pedidos;