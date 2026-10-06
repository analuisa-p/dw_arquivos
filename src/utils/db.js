const pg = require('pg');   //Importa o drive

const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost', 
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',       //Usuário criado durante a instalação
    password: process.env.DB_PASS || 'ifc',       //Senha do usuário  
    database: process.env.DB_NAME || 'login_jwt',      //Nome do banco de dados criado
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;