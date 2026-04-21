import { prisma } from '../../prismaClient';

class VideoRepository {
    // Função para salvar um novo vídeo no banco
    async create(user_id: string, title: string, description: string, url: string, thumbnail: string) {
        return await prisma.videos.create({
            data: {
                user_id,
                title,
                description,
                url,
                thumbnail
            }
        });
    }

    async getVideos() {
        return await prisma.videos.findMany({
            include: {
                users: true // Garante que os dados do autor sejam incluídos (equivalente ao JOIN)
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    async getVideosByUserId(user_id: string) {
        return await prisma.videos.findMany({
            where: {
                user_id: user_id
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    async searchVideos(search: string) {
        return await prisma.videos.findMany({
            include: {
                users: true
            },
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive' // Equivalente ao ILIKE
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    // Função: Atualizar vídeo
    async updateVideo(video_id: string, user_id: string, title: string, description: string) {
        // O Prisma requer o ID único para o update
        return await prisma.videos.update({
            where: {
                id: video_id,
                user_id: user_id // Opcional, mas mantém a segurança de dono
            },
            data: {
                title,
                description
            }
        });
    }

    // Função: Deletar vídeo
    async deleteVideo(video_id: string, user_id: string) {
        return await prisma.videos.delete({
            where: {
                id: video_id,
                user_id: user_id
            }
        });
    }
}

export { VideoRepository };