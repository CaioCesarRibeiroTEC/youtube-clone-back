import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const login = (request: Request, response: Response, next: NextFunction) => {
    try {
        // Pega o token do cabeçalho da requisição
        const decode = jwt.verify(
            request.headers.authorization?.split(' ')[1] as string, 
            process.env.SECRET as string
        );
        
        // Se der certo, injeta os dados do usuário na requisição e deixa passar
        request.user = decode as any; 
        next();
    } catch (error) {
        return response.status(401).json({ error: 'Não autorizado.' });
    }
}

export { login };