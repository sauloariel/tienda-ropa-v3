import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

// Configuración directa para SQLite
const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    models: [__dirname + '/../models/**/*.ts'],
    logging: false
});

export default db;
