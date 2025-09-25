import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table({ tableName: 'promociones', timestamps: true })
export class Promociones extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id_promocion!: number;

    @Column(DataType.STRING(100))
    nombre!: string;

    @Column(DataType.TEXT)
    descripcion?: string;

    @Column({
        type: DataType.ENUM('PORCENTAJE', 'MONTO_FIJO', '2X1', 'DESCUENTO_ESPECIAL'),
        allowNull: false
    })
    tipo!: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';

    @Column(DataType.DECIMAL(10, 2))
    valor!: number;

    @Unique
    @Column(DataType.STRING(50))
    codigo_descuento?: string;

    @Column(DataType.DATE)
    fecha_inicio!: Date;

    @Column(DataType.DATE)
    fecha_fin!: Date;

    @Column(DataType.DECIMAL(10, 2))
    minimo_compra?: number;

    @Column(DataType.INTEGER)
    uso_maximo?: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    uso_actual!: number;

    @Column({
        type: DataType.ENUM('ACTIVA', 'INACTIVA', 'EXPIRADA'),
        defaultValue: 'ACTIVA'
    })
    estado!: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA';

    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt?: Date;

    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt?: Date;
}

export default Promociones;


