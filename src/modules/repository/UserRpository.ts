import { prisma } from '../../prismaClient'; 

class UserRepository {
  // Alterado para receber 3 argumentos, conforme chamado na rota
  async create(name: string, email: string, password: string) {
    return await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

export { UserRepository };