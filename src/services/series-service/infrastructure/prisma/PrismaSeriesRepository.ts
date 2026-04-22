import { PrismaClient } from "@prisma/client";
import { ISeriesRepository } from "../../domain/repositories/ISeriesRepository";
import { CreateSeriesDTO, UpdateSeriesDTO } from "../../domain/dto/SeriesDTO";
import { Series } from "../../domain/entities/Series";

const prisma = new PrismaClient();

const toEntity = (s: any): Series =>
  new Series(s.id, s.nombre, s.estreno, s.sinopsis, s.idGenero, s.idDirector, s.imagenUrl);

export class PrismaSeriesRepository implements ISeriesRepository {
  async findAll(): Promise<Series[]> {
    const series = await prisma.serie.findMany({
      include: { genero: true, director: true },
    });
    return series.map(toEntity);
  }

  async findById(id: number): Promise<Series | null> {
    const serie = await prisma.serie.findUnique({
      where: { id },
      include: { genero: true, director: true },
    });
    return serie ? toEntity(serie) : null;
  }

  async findByGenero(idGenero: number): Promise<Series[]> {
    const series = await prisma.serie.findMany({
      where: { idGenero },
      include: { genero: true, director: true },
    });
    return series.map(toEntity);
  }

  async create(data: CreateSeriesDTO): Promise<Series> {
    const serie = await prisma.serie.create({
      data: {
        nombre: data.nombre,
        estreno: data.estreno,
        sinopsis: data.sinopsis,
        idGenero: data.idGenero,
        idDirector: data.idDirector,
        imagenUrl: data.imagenUrl ?? null,
      },
      include: { genero: true, director: true },
    });
    return toEntity(serie);
  }

  async update(id: number, data: UpdateSeriesDTO): Promise<Series> {
    const serie = await prisma.serie.update({
      where: { id },
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.estreno && { estreno: data.estreno }),
        ...(data.sinopsis && { sinopsis: data.sinopsis }),
        ...(data.idGenero && { idGenero: data.idGenero }),
        ...(data.idDirector && { idDirector: data.idDirector }),
        ...(data.imagenUrl !== undefined && { imagenUrl: data.imagenUrl }),
      },
      include: { genero: true, director: true },
    });
    return toEntity(serie);
  }

  async delete(id: number): Promise<void> {
    await prisma.serie.delete({ where: { id } });
  }
}
