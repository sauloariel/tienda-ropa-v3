import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { ProductoVariante } from './ProductoVariante.model';

@Table({ tableName: 'colores', timestamps: false })
export class Colores extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_color!: number;

  @Column(DataType.STRING(30))
  nombre!: string;

  @HasMany(() => ProductoVariante)
  variantes!: ProductoVariante[];
}
export default Colores;