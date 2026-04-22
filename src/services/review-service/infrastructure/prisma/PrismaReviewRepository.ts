import { PrismaClient } from "@prisma/client";
import { IReviewRepository, CreateReviewDTO } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";

const prisma = new PrismaClient();

const toEntity = (r: any): Review =>
  new Review(r.id, r.contenido, r.fechaCreacion, r.idCapitulo, r.idUsuario);

export class PrismaReviewRepository implements IReviewRepository {
  async findById(id: number): Promise<Review | null> {
    const r = await prisma.resena.findUnique({ where: { id } });
    return r ? toEntity(r) : null;
  }

  async findByEpisode(idCapitulo: number): Promise<Review[]> {
    const resenas = await prisma.resena.findMany({
      where: { idCapitulo },
      orderBy: { fechaCreacion: "desc" },
      include: { usuario: { select: { id: true, nombre: true } } },
    });
    return resenas.map(toEntity);
  }

  async findByUser(idUsuario: number): Promise<Review[]> {
    const resenas = await prisma.resena.findMany({
      where: { idUsuario },
      orderBy: { fechaCreacion: "desc" },
    });
    return resenas.map(toEntity);
  }

  async create(data: CreateReviewDTO): Promise<Review> {
    const r = await prisma.resena.create({
      data: {
        contenido: data.contenido,
        idCapitulo: data.idCapitulo,
        idUsuario: data.idUsuario,
      },
    });
    return toEntity(r);
  }

  async delete(id: number): Promise<void> {
    await prisma.resena.delete({ where: { id } });
  }
}
