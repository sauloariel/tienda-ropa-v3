import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table({ tableName: 'usuarios', timestamps: true })
export class Usuario extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Unique
    @Column(DataType.STRING(100))
    email!: string;

    @Column(DataType.STRING(500))
    password!: string;

    @Column(DataType.STRING(50))
    rol!: string;

    @Column(DataType.STRING(100))
    nombre!: string;

    @Column(DataType.BOOLEAN)
    activo!: boolean;
}

export default Usuario;
