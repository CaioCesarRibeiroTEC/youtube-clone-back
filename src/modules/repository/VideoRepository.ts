import { pool } from '../../database';

class VideoRepository {
    // Função para salvar um novo vídeo no banco
    async create(user_id: string, title: string, description: string, url: string, thumbnail: string) {
        const query = `
            INSERT INTO videos (user_id, title, description, url, thumbnail)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [user_id, title, description, url, thumbnail];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async getVideos() {
        const query = `
            SELECT v.*, u.name as author_name 
            FROM videos v 
            JOIN users u ON v.user_id = u.id 
            ORDER BY v.created_at DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async getVideosByUserId(user_id: string) {
        const query = `
            SELECT * FROM videos 
            WHERE user_id = $1 
            ORDER BY created_at DESC;
        `;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }

    async searchVideos(search: string) {
        const query = `
            SELECT v.*, u.name as author_name 
            FROM videos v 
            JOIN users u ON v.user_id = u.id 
            WHERE v.title ILIKE $1
            ORDER BY v.created_at DESC;
        `;
        const { rows } = await pool.query(query, [`%${search}%`]);
        return rows;
    }

    // NOVA FUNÇÃO: Atualizar vídeo
    async updateVideo(video_id: string, user_id: string, title: string, description: string) {
        const query = `
            UPDATE videos
            SET title = $1, description = $2
            WHERE id = $3 AND user_id = $4
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [title, description, video_id, user_id]);
        return rows[0];
    }

    // NOVA FUNÇÃO: Deletar vídeo
    async deleteVideo(video_id: string, user_id: string) {
        const query = `
            DELETE FROM videos
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [video_id, user_id]);
        return rows[0];
    }
}

export { VideoRepository };