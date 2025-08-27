import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Clientes } from './Clientes.model';
import { Empleados } from './Empleados.model';
import { DetalleVentas } from './DetalleVentas.model';

@Table({ tableName: 'ventas', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Ventas extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id_venta!: number;

    @Column(DataType.DATE)
    fecha_venta!: Date;

    @Column(DataType.DECIMAL(10, 2))
    total!: number;

    @Column(DataType.STRING(50))
    metodo_pago!: string;

    @ForeignKey(() => Clientes)
    @Column(DataType.INTEGER)
    cliente_id?: number;

    @BelongsTo(() => Clientes)
    cliente?: Clientes;

    @ForeignKey(() => Empleados)
    @Column(DataType.INTEGER)
    empleado_id?: number;

    @BelongsTo(() => Empleados)
    empleado?: Empleados;

    @Column(DataType.STRING(20))
    estado!: string;

    @HasMany(() => DetalleVentas)
    detalles!: DetalleVentas[];
}

export default Ventas;
