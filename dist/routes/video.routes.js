"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoutes = void 0;
// @ts-nocheck
const express_1 = require("express");
const VideoRepository_1 = require("../modules/repository/VideoRepository");
const login_1 = require("../middleware/login");
const videoRoutes = (0, express_1.Router)();
exports.videoRoutes = videoRoutes;
const videoRepository = new VideoRepository_1.VideoRepository();
// Rota PROTEGIDA para criar um vídeo
videoRoutes.post('/create-video', login_1.login, async (request, response) => {
    try {
        const user_id = request.user.id;
        const { title, description, url, thumbnail } = request.body;
        const newVideo = await videoRepository.create(user_id, title, description, url, thumbnail);
        return response.status(201).json({ message: 'Vídeo postado com sucesso!', video: newVideo });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao postar o vídeo.' });
    }
});
videoRoutes.get('/get-videos', async (request, response) => {
    try {
        const videos = await videoRepository.getVideos();
        return response.status(200).json({ videos });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao buscar os vídeos.' });
    }
});
videoRoutes.get('/user-videos', login_1.login, async (request, response) => {
    try {
        const user_id = request.user.id;
        const videos = await videoRepository.getVideosByUserId(user_id);
        return response.status(200).json({ videos });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao buscar os seus vídeos.' });
    }
});
videoRoutes.get('/search', async (request, response) => {
    try {
        const search = request.query.q;
        if (!search) {
            return response.status(400).json({ error: 'Parâmetro de busca é obrigatório.' });
        }
        const videos = await videoRepository.searchVideos(search);
        return response.status(200).json({ videos });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao pesquisar vídeos.' });
    }
});
// NOVA ROTA: Editar
videoRoutes.put('/update-video/:id', login_1.login, async (request, response) => {
    try {
        const user_id = request.user.id;
        const video_id = request.params.id;
        const { title, description } = request.body;
        const updatedVideo = await videoRepository.updateVideo(video_id, user_id, title, description);
        if (!updatedVideo)
            return response.status(404).json({ error: 'Vídeo não encontrado ou permissão negada.' });
        return response.status(200).json({ message: 'Vídeo atualizado!', video: updatedVideo });
    }
    catch (error) {
        return response.status(500).json({ error: 'Erro ao atualizar.' });
    }
});
// NOVA ROTA: Deletar
videoRoutes.delete('/delete-video/:id', login_1.login, async (request, response) => {
    try {
        const user_id = request.user.id;
        const video_id = request.params.id;
        const deletedVideo = await videoRepository.deleteVideo(video_id, user_id);
        if (!deletedVideo)
            return response.status(404).json({ error: 'Vídeo não encontrado ou permissão negada.' });
        return response.status(200).json({ message: 'Vídeo deletado!' });
    }
    catch (error) {
        return response.status(500).json({ error: 'Erro ao deletar.' });
    }
});
