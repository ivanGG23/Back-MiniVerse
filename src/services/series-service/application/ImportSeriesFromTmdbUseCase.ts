import { PrismaClient } from "@prisma/client";
import { Series } from "../domain/entities/Series";

const prisma = new PrismaClient();
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

export class ImportSeriesFromTmdbUseCase {
  private readonly apiKey: string;

  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY no configurada en .env");
    }
    this.apiKey = process.env.TMDB_API_KEY;
  }

  async execute(tmdbId: number): Promise<Series> {
    const existente = await prisma.serie.findFirst({
      where: { tmdbId },
    });
    if (existente) {
      return new Series(
        existente.id,
        existente.nombre,
        existente.estreno,
        existente.sinopsis,
        existente.idGenero,
        existente.idDirector,
        existente.imagenUrl
      );
    }

    const response = await fetch(
      `${TMDB_BASE}/tv/${tmdbId}?api_key=${this.apiKey}&language=es-MX`
    );

    if (!response.ok) {
      throw new Error("Serie no encontrada en TMDB");
    }

    const data = (await response.json()) as {
      id: number;
      name: string;
      first_air_date: string;
      overview: string;
      poster_path: string | null;
      genres: { id: number; name: string }[];
      created_by: { name: string }[];
    };

    if (!data.overview) {
      throw new Error("La serie no tiene sinopsis disponible");
    }

    const generoNombre = data.genres[0]?.name ?? "Desconocido";
    const genero = await prisma.genero.upsert({
      where: { nombre: generoNombre },
      update: {},
      create: { nombre: generoNombre },
    });

    const directorNombre = data.created_by[0]?.name ?? "Desconocido";
    const director = await prisma.director.upsert({
      where: { nombre: directorNombre },
      update: {},
      create: { nombre: directorNombre, biografia: null },
    });

    const estreno = data.first_air_date
      ? parseInt(data.first_air_date.split("-")[0])
      : 0;

    const imagenUrl = data.poster_path
      ? `${TMDB_IMAGE}${data.poster_path}`
      : null;

    const serie = await prisma.serie.create({
      data: {
        tmdbId: data.id,
        nombre: data.name,
        estreno,
        sinopsis: data.overview,
        idGenero: genero.id,
        idDirector: director.id,
        imagenUrl,
      },
    });

    return new Series(
      serie.id,
      serie.nombre,
      serie.estreno,
      serie.sinopsis,
      serie.idGenero,
      serie.idDirector,
      serie.imagenUrl
    );
  }
}
