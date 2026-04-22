import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UpdateUserDTO } from "../../domain/dto/UpdateUserDTO";
import { User } from "../../domain/entities/User";

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return null;

    return new User(
      usuario.id,
      usuario.nombre,
      usuario.correo,
      usuario.contrasena,
      usuario.edad
    );
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.edad && { edad: data.edad }),
      },
    });

    return new User(
      usuario.id,
      usuario.nombre,
      usuario.correo,
      usuario.contrasena,
      usuario.edad
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.usuario.delete({ where: { id } });
  }
}
