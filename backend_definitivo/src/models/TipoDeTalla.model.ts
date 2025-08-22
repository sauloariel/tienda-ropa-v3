import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Tallas } from './Talle.model';

@Table({ tableName: 'tipo_talle', timestamps: false })
export class TipoTalle extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_tipo_talle!: number;

  @Column(DataType.STRING(30))
  nombre!: string;

  @HasMany(() => Tallas)
  tallas!: Tallas[];
}
export default TipoTalle;