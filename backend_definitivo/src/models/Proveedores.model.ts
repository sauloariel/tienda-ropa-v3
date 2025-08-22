import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Productos } from './Productos.model';

@Table({ tableName: 'proveedores', timestamps: false })
export class Proveedores extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_proveedor!: number;

  @Column(DataType.STRING(50))
  nombre!: string;

  @Column(DataType.STRING(50))
  contacto!: string;

  @Column(DataType.STRING(100))
  direccion!: string;

  @Column(DataType.STRING(20))
  telefono!: string;

  @HasMany(() => Productos)
  productos!: Productos[];
}
export default Proveedores;