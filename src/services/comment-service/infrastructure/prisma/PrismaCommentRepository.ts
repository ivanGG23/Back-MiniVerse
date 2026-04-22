import { PrismaClient } from "@prisma/client";
import { ICommentRepository, CreateCommentDTO } from "../../domain/repositories/ICommentRepository";
import { Comment } from "../../domain/entities/Comment";

const prisma = new PrismaClient();

const toEntity = (c: any): Comment =>
  new Comment(c.id, c.contenido, c.fechaCreacion, c.idUsuario, c.idResena);

export class PrismaCommentRepository implements ICommentRepository {
  async findById(id: number): Promise<Comment | null> {
    const c = await prisma.comentario.findUnique({ where: { id } });
    return c ? toEntity(c) : null;
  }

  async findByReview(idResena: number): Promise<Comment[]> {
    const comentarios = await prisma.comentario.findMany({
      where: { idResena },
      orderBy: { fechaCreacion: "asc" },
      include: { usuario: { select: { id: true, nombre: true } } },
    });
    return comentarios.map(toEntity);
  }

  async create(data: CreateCommentDTO): Promise<Comment> {
    const c = await prisma.comentario.create({
      data: {
        contenido: data.contenido,
        idUsuario: data.idUsuario,
        idResena: data.idResena,
      },
    });
    return toEntity(c);
  }

  async delete(id: number): Promise<void> {
    await prisma.comentario.delete({ where: { id } });
  }
}
