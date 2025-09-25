import { Table, Column, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import Clientes from './Clientes.model';
import DetalleFactura from './DetalleFactura.model';
import Empleados from './Empleados.model';

@Table({ tableName: 'facturas', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Factura extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING(20))
    numeroFactura!: string;

    @Column(DataType.DATE)
    fecha!: Date;

    @Column(DataType.DECIMAL(10, 2))
    total!: number;

    @ForeignKey(() => Clientes)
    @Column(DataType.INTEGER)
    cliente_id?: number;

    @BelongsTo(() => Clientes)
    cliente?: Clientes;

    @ForeignKey(() => Empleados)
    @Column(DataType.INTEGER)
    id_empleado?: number;

    @BelongsTo(() => Empleados)
    empleado?: Empleados;

    @Column(DataType.STRING(20))
    estado!: string; // 'activa', 'anulada'

    @Column(DataType.STRING(50))
    metodo_pago!: string;

    @HasMany(() => DetalleFactura)
    detalles!: DetalleFactura[];
}

export default Factura;
