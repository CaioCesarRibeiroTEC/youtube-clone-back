import { prisma } from '../../prismaClient'; 

class UserRepository {
  async create(data: any) {

    return await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
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