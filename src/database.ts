import { Pool } from 'pg';
import { config } from 'dotenv';

config();

// Configura a conexão usando a URL que está no seu .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Um pequeno teste para avisar no terminal quando conectar
pool.on('connect', () => {
    console.log('📦 Conectado ao banco de dados Supabase com sucesso!');
});

export { pool };