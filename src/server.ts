console.log("URL DO BANCO NO SERVIDOR:", process.env.DATABASE_URL ? "Carregada com sucesso" : "VARIÁVEL VAZIA!");

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes = require('./routes/user.routes');
import videoRoutes = require('./routes/video.routes');


config(); // Carrega as variáveis do arquivo .env

console.log("DEBUG - DATABASE_URL carregada:", process.env.DATABASE_URL);

const app = express();

// Middlewares padrão
app.use(cors());

app.use(express.json());

// Rotas
app.use('/users', userRoutes.userRoutes);
app.use('/videos', videoRoutes.videoRoutes);

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
})