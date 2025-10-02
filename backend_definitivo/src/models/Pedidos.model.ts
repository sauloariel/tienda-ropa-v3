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
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id_pedido!: number;

  @ForeignKey(() => Clientes)
  @Column(DataType.INTEGER)
  id_cliente!: number;

  @BelongsTo(() => Clientes, 'id_cliente')
  cliente!: Clientes;

  @ForeignKey(() => Empleados)
  @Column(DataType.INTEGER)
  id_empleados!: number;

  @BelongsTo(() => Empleados, { foreignKey: 'id_empleados', targetKey: 'id_empleado' })
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

  // Campos opcionales que pueden no existir en la base de datos
  // @Column(DataType.TEXT)
  // direccion_entrega?: string;

  // @Column(DataType.STRING(100))
  // horario_recepcion?: string;

  // @Column(DataType.TEXT)
  // descripcion_pedido?: string;

  // @Column(DataType.DECIMAL(10, 8))
  // latitud?: number;

  // @Column(DataType.DECIMAL(11, 8))
  // longitud?: number;

  // @Column(DataType.STRING(255))
  // telefono_contacto?: string;

  // @Column(DataType.TEXT)
  // notas_entrega?: string;

  @HasMany(() => DetallePedidos)
  detalle!: DetallePedidos[];
}

export default Pedidos;