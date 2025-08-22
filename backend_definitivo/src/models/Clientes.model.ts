// models/Clientes.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Pedidos } from './Pedidos.model';

@Table({ tableName: 'clientes', timestamps: false })
export class Clientes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_cliente!: number;

  @Unique
  @Column(DataType.STRING(10))
  dni!: string;

  @Column(DataType.STRING(13))
  cuit_cuil!: string;

  @Column(DataType.STRING(25))
  nombre!: string;

  @Column(DataType.STRING(25))
  apellido!: string;

  @Column(DataType.STRING(30))
  domicilio!: string;

  @Column(DataType.STRING(13))
  telefono!: string;

  @Column(DataType.STRING(35))
  mail!: string;

  @Column(DataType.STRING(8))
  estado?: string;

  @Column(DataType.STRING(255))
  password?: string;

  @HasMany(() => Pedidos)
  pedidos!: Pedidos[];
}
export default Clientes;