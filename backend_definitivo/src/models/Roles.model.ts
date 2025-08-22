// models/Roles.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Loguin } from './Loguin.model';

@Table({ tableName: 'roles', timestamps: false })
export class Roles extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_rol!: number;

  @Unique
  @Column(DataType.STRING(15))
  descripcion?: string;

  @HasMany(() => Loguin)
  logines!: Loguin[];
}
export default Roles;