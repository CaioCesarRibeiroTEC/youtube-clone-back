"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("URL DO BANCO NO SERVIDOR:", process.env.DATABASE_URL ? "Carregada com sucesso" : "VARIÁVEL VAZIA!");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const userRoutes = require("./routes/user.routes");
const videoRoutes = require("./routes/video.routes");
(0, dotenv_1.config)(); // Carrega as variáveis do arquivo .env
console.log("DEBUG - DATABASE_URL carregada:", process.env.DATABASE_URL);
const app = (0, express_1.default)();
// Middlewares padrão
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.use('/users', userRoutes.userRoutes);
app.use('/videos', videoRoutes.videoRoutes);
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
