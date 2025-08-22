// models/Categorias.model.ts
import { Table, Column, Model, DataType, Unique, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Productos } from './Productos.model';

@Table({
  tableName: 'categorias',
  timestamps: false,
})
export class Categorias extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_categoria!: number;

  @Unique
  @Column(DataType.STRING(50))
  nombre_categoria!: string;

  @Column(DataType.STRING(50))
  descripcion!: string;

  @Column(DataType.STRING(8))
  estado?: string;

  @HasMany(() => Productos)
  productos!: Productos[];
}
export default Categorias;