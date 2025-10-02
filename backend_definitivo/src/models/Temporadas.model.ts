// models/Temporadas.model.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Productos } from './Productos.model';

@Table({ tableName: 'temporadas', timestamps: false })
export class Temporadas extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id_temporada!: number;

    @Column(DataType.STRING(50))
    nombre!: string;

    @Column(DataType.TEXT)
    descripcion?: string;

    @Column(DataType.STRING(8))
    estado!: string;

    @Column(DataType.DATE)
    fecha_creacion?: Date;

    @HasMany(() => Productos, 'id_temporada')
    productos!: Productos[];
}

export default Temporadas;







