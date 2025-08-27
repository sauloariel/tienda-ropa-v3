// models/Imagenes.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Productos } from './Productos.model';

@Table({ tableName: 'imagenes', timestamps: false })
export class Imagenes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_imagen!: number;

  @ForeignKey(() => Productos)
  @Column(DataType.INTEGER)
  id_productos!: number;

  @BelongsTo(() => Productos)
  producto!: Productos;

  @Column(DataType.STRING(255))
  nombre_archivo?: string;

  @Column(DataType.TEXT)
  ruta?: string;

  @Column(DataType.TEXT)
  descripcion?: string;

  @Column(DataType.BLOB('long'))
  imagen_bin?: Buffer;
}
export default Imagenes;