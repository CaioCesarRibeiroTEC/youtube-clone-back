"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (request, response, next) => {
    try {
        // Pega o token do cabeçalho da requisição
        const decode = jsonwebtoken_1.default.verify(request.headers.authorization?.split(' ')[1], process.env.SECRET);
        // Se der certo, injeta os dados do usuário na requisição e deixa passar
        request.user = decode;
        next();
    }
    catch (error) {
        return response.status(401).json({ error: 'Não autorizado.' });
    }
};
exports.login = login;
