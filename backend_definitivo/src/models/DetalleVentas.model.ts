import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Ventas } from './Ventas.model';
import { Productos } from './Productos.model';

@Table({ tableName: 'detalle_ventas', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class DetalleVentas extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id_detalle_venta!: number;

    @ForeignKey(() => Ventas)
    @Column(DataType.INTEGER)
    id_venta!: number;

    @BelongsTo(() => Ventas)
    venta!: Ventas;

    @ForeignKey(() => Productos)
    @Column(DataType.INTEGER)
    id_producto!: number;

    @BelongsTo(() => Productos)
    producto!: Productos;

    @Column(DataType.INTEGER)
    cantidad!: number;

    @Column(DataType.DECIMAL(10, 2))
    precio_unitario!: number;

    @Column(DataType.DECIMAL(10, 2))
    subtotal!: number;
}

export default DetalleVentas;
