// models/Empleados.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Loguin } from './Loguin.model';
import { Pedidos } from './Pedidos.model';

@Table({ tableName: 'empleados', timestamps: false })
export class Empleados extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_empleado!: number;

  @Unique
  @Column(DataType.STRING(11))
  cuil!: string;

  @Column(DataType.STRING(25))
  nombre!: string;

  @Column(DataType.STRING(30))
  apellido!: string;

  @Column(DataType.STRING(35))
  domicilio!: string;

  @Column(DataType.STRING(13))
  telefono!: string;

  @Column(DataType.STRING(45))
  mail!: string;

  @Column(DataType.DECIMAL(60,2))
  sueldo?: number;

  @Column(DataType.STRING(20))
  puesto?: string;

  @Column(DataType.STRING(8))
  estado?: string;

  @HasMany(() => Pedidos)
  pedidos!: Pedidos[];

  @HasMany(() => Loguin)
  logines!: Loguin[];
}
export default Empleados;