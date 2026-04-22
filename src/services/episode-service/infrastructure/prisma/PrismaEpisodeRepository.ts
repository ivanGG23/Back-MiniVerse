import { PrismaClient } from "@prisma/client";
import { IEpisodeRepository, CreateEpisodeDTO } from "../../domain/repositories/IEpisodeRepository";
import { Episode } from "../../domain/entities/Episode";

const prisma = new PrismaClient();

const toEntity = (e: any): Episode =>
  new Episode(e.id, e.titulo, e.numero, e.duracion, e.idTemporada);

export class PrismaEpisodeRepository implements IEpisodeRepository {
  async findById(id: number): Promise<Episode | null> {
    const e = await prisma.capitulo.findUnique({ where: { id } });
    return e ? toEntity(e) : null;
  }

  async findBySeason(idTemporada: number): Promise<Episode[]> {
    const capitulos = await prisma.capitulo.findMany({
      where: { idTemporada },
      orderBy: { numero: "asc" },
    });
    return capitulos.map(toEntity);
  }

  async create(data: CreateEpisodeDTO): Promise<Episode> {
    const e = await prisma.capitulo.create({
      data: {
        titulo: data.titulo,
        numero: data.numero,
        duracion: data.duracion,
        idTemporada: data.idTemporada,
      },
    });
    return toEntity(e);
  }

  async delete(id: number): Promise<void> {
    await prisma.capitulo.delete({ where: { id } });
  }
}
