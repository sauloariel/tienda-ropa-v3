// models/Loguin.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Empleados } from './Empleados.model';
import { Roles } from './Roles.model';

@Table({ tableName: 'loguin', timestamps: false })
export class Loguin extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_loguin!: number;

  @ForeignKey(() => Empleados)
  @Column(DataType.INTEGER)
  id_empleado!: number;

  @BelongsTo(() => Empleados)
  empleado!: Empleados;

  @ForeignKey(() => Roles)
  @Column(DataType.INTEGER)
  id_rol!: number;

  @BelongsTo(() => Roles)
  rol!: Roles;

  @Unique
  @Column(DataType.STRING(20))
  usuario!: string;

  @Column(DataType.STRING(500))
  passwd?: string;

  @Column(DataType.BOOLEAN)
  password_provisoria?: boolean;

  @Column(DataType.DATE)
  fecha_cambio_pass?: Date;

  @Column(DataType.DATE)
  ultimo_acceso?: Date;

  @Column(DataType.BOOLEAN)
  activo?: boolean;
}
export default Loguin;