import { PrismaClient } from "@prisma/client";
import { ISeasonRepository, CreateSeasonDTO } from "../../domain/repositories/ISeasonRepository";
import { Season } from "../../domain/entities/Season";

const prisma = new PrismaClient();

const toEntity = (t: any): Season =>
  new Season(t.id, t.numero, t.nombre, t.descripcion, t.imagenUrl, t.idSerie);

export class PrismaSeasonRepository implements ISeasonRepository {
  async findById(id: number): Promise<Season | null> {
    const t = await prisma.temporada.findUnique({ where: { id } });
    return t ? toEntity(t) : null;
  }

  async findBySerie(idSerie: number): Promise<Season[]> {
    const temporadas = await prisma.temporada.findMany({
      where: { idSerie },
      orderBy: { numero: "asc" },
    });
    return temporadas.map(toEntity);
  }

  async create(data: CreateSeasonDTO): Promise<Season> {
    const t = await prisma.temporada.create({
      data: {
        numero: data.numero,
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        imagenUrl: data.imagenUrl ?? null,
        idSerie: data.idSerie,
      },
    });
    return toEntity(t);
  }

  async delete(id: number): Promise<void> {
    await prisma.temporada.delete({ where: { id } });
  }
}
