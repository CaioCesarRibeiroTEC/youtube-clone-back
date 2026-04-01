import { pool } from '../../database';

class UserRepository {
    // Função para criar um novo utilizador
    async create(name: string, email: string, passwordHash: string) {
        const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at;
        `;
        const values = [name, email, passwordHash];
        
        // Executa a query e devolve o utilizador criado (sem a password por segurança)
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Função para procurar um utilizador pelo email (útil para login e para evitar emails duplicados)
    async findByEmail(email: string) {
        const query = `
            SELECT * FROM users WHERE email = $1;
        `;
        const { rows } = await pool.query(query, [email]);
        return rows[0]; // Devolve o utilizador ou 'undefined' se não encontrar
    }
}

export { UserRepository };