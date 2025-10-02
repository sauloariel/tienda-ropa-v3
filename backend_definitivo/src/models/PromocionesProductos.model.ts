import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { Promociones } from './Promociones.model';
import { Productos } from './Productos.model';

@Table({ tableName: 'promociones_productos', timestamps: true })
export class PromocionesProductos extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Promociones)
    @Column(DataType.INTEGER)
    id_promocion!: number;

    @BelongsTo(() => Promociones)
    promocion!: Promociones;

    @ForeignKey(() => Productos)
    @Column(DataType.INTEGER)
    id_producto!: number;

    @BelongsTo(() => Productos)
    producto!: Productos;

    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt?: Date;

    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt?: Date;
}

export default PromocionesProductos;

