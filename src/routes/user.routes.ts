// @ts-nocheck
import { Router } from 'express';
import bcrypt from 'bcrypt';
import UserRpository = require('../modules/repository/UserRpository');
import jwt from 'jsonwebtoken';

const userRoutes = Router();
const userRepository = new UserRpository.UserRepository();

// Rota de cadastro
userRoutes.post('/sign-up', async (request, response) => {
    console.log("LOG_DEBUG: Corpo da requisição recebido:", JSON.stringify(request.body));
    const { name, email, password } = request.body;
    console.log("LOG_DEBUG: Valores após desestruturação:", { name, email, password });

    if (!name || !email || !password) {
        return response.status(400).json({ error: "Dados incompletos enviados ao servidor." });
    }

    try {
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            return response.status(400).json({ error: 'Este email já está registado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await userRepository.create(name, email, passwordHash);

        return response.status(201).json({ 
            message: 'Utilizador criado com sucesso!', 
            user: newUser 
        });

    } catch (error) {
        console.error(error);
        console.log(request.body);
        return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota de Login
userRoutes.post('/sign-in', async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return response.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.SECRET as string, 
            { expiresIn: '1d' }
        );

        return response.status(200).json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// NOVA ROTA: Recuperar os dados do utilizador através do Token (Autenticação contínua)
userRoutes.get('/get-user', async (request, response) => {
    // 1. Pega no cabeçalho de autorização que o Front-end enviou
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ error: 'Token não fornecido.' });
    }

    // 2. Extrai apenas o token (ignora a palavra "Bearer" caso o front-end envie)
    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];

    try {
        // 3. Verifica se o token é válido e decodifica-o
        const decoded = jwt.verify(token, process.env.SECRET as string) as { id: string, email: string };

        // 4. Procura o utilizador na Base de Dados pelo email que estava dentro do token
        const user = await userRepository.findByEmail(decoded.email);

        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // 5. Devolve os dados com sucesso (sem a password)
        return response.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Falha na validação do token:', error);
        return response.status(401).json({ error: 'Token inválido ou expirado.' });
    }
});

export { userRoutes };