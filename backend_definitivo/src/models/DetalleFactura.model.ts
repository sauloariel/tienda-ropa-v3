import { Table, Column, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import Factura from './Factura.model';
import Productos from './Productos.model';

@Table({ tableName: 'detalle_facturas', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class DetalleFactura extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Factura)
    @Column(DataType.INTEGER)
    factura_id!: number;

    @BelongsTo(() => Factura)
    factura!: Factura;

    @ForeignKey(() => Productos)
    @Column(DataType.INTEGER)
    producto_id!: number;

    @BelongsTo(() => Productos)
    producto!: Productos;

    @Column(DataType.INTEGER)
    cantidad!: number;

    @Column(DataType.DECIMAL(10, 2))
    precio_unitario!: number;

    @Column(DataType.DECIMAL(10, 2))
    subtotal!: number;
}

export default DetalleFactura;
