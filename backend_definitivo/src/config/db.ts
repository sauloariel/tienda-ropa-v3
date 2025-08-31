import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Usuario } from '../models/Usuario.model';

dotenv.config();

// Configuración directa para SQLite
const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    models: [Usuario],
    logging: false
});

export default db;
