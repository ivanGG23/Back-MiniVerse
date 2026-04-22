import { PrismaClient } from "@prisma/client";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { RegisterRequest } from "../domain/dto/RegisterRequest";
import { User } from "../domain/entities/User";

const prisma = new PrismaClient();

export class PrismaAuthRepository implements IAuthRepository {
    async findByCorreo(correo: string): Promise<User | null> {
        const usuario = await prisma.usuario.findUnique({ where: { correo } });
        if (!usuario) return null;

        return new User(
            usuario.id,
            usuario.nombre,
            usuario.correo,
            usuario.contrasena,
            usuario.edad
        );
    }

    async create(data: RegisterRequest): Promise<User> {
        const usuario = await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                correo: data.correo,
                contrasena: data.contrasena,
                edad: data.edad,
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
}
