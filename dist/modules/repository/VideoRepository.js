"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const prismaClient_1 = require("../../prismaClient");
class VideoRepository {
    // Função para salvar um novo vídeo no banco
    async create(user_id, title, description, url, thumbnail) {
        return await prismaClient_1.prisma.videos.create({
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
        return await prismaClient_1.prisma.videos.findMany({
            include: {
                users: true // Garante que os dados do autor sejam incluídos (equivalente ao JOIN)
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }
    async getVideosByUserId(user_id) {
        return await prismaClient_1.prisma.videos.findMany({
            where: {
                user_id: user_id
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }
    async searchVideos(search) {
        return await prismaClient_1.prisma.videos.findMany({
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
    async updateVideo(video_id, user_id, title, description) {
        // O Prisma requer o ID único para o update
        return await prismaClient_1.prisma.videos.update({
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
    async deleteVideo(video_id, user_id) {
        return await prismaClient_1.prisma.videos.delete({
            where: {
                id: video_id,
                user_id: user_id
            }
        });
    }
}
exports.VideoRepository = VideoRepository;
