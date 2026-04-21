"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prismaClient_1 = require("../../prismaClient");
class UserRepository {
    // Alterado para receber 3 argumentos, conforme chamado na rota
    async create(name, email, password) {
        return await prismaClient_1.prisma.users.create({
            data: {
                name,
                email,
                password,
            },
        });
    }
    async findByEmail(email) {
        return await prismaClient_1.prisma.users.findUnique({
            where: { email },
        });
    }
}
exports.UserRepository = UserRepository;
