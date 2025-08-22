import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { TipoTalle } from './TipoDeTalla.model';
import { ProductoVariante } from './ProductoVariante.model';

@Table({ tableName: 'tallas', timestamps: false })
export class Tallas extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_talla!: number;

  @Column(DataType.STRING(20))
  nombre!: string;

  @ForeignKey(() => TipoTalle)
  @Column(DataType.INTEGER)
  id_tipo_talle!: number;

  @BelongsTo(() => TipoTalle)
  tipoTalle!: TipoTalle;

  @HasMany(() => ProductoVariante)
  variantes!: ProductoVariante[];
}
export default Tallas;