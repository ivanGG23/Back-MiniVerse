import { ISeasonRepository } from "../domain/repositories/ISeasonRepository";
import { Season } from "../domain/entities/Season";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

export class GetSeasonsBySeriesUseCase {
  constructor(private readonly seasonRepository: ISeasonRepository) {}

  async execute(idSerie: number): Promise<Season[]> {
    const temporadas = await this.seasonRepository.findBySerie(idSerie)

    if (temporadas.length === 0) {
      const importar = new ImportSeasonsFromTmdbUseCase()
      try {
        return await importar.execute(idSerie)
      } catch {
        return []
      }
    }

    return temporadas
  }
}

export class ImportSeasonsFromTmdbUseCase {
  private readonly apiKey: string;

  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY no configurada en .env");
    }
    this.apiKey = process.env.TMDB_API_KEY;
  }

  async execute(idSerie: number): Promise<Season[]> {
    // 1. Buscar la serie en DB para obtener su tmdbId
    const serie = await prisma.serie.findUnique({ where: { id: idSerie } });
    if (!serie) throw new Error("Serie no encontrada en la DB");
    if (!serie.tmdbId) throw new Error("Esta serie no tiene tmdbId, fue agregada manualmente");

    // 2. Verificar si ya tiene temporadas importadas
    const existentes = await prisma.temporada.findMany({ where: { idSerie } });
    if (existentes.length > 0) {
      return existentes.map(
        (t) => new Season(t.id, t.numero, t.nombre, t.descripcion, t.imagenUrl, t.idSerie)
      );
    }

    // 3. Obtener temporadas desde TMDB
    const response = await fetch(
      `${TMDB_BASE}/tv/${serie.tmdbId}?api_key=${this.apiKey}&language=es-MX`
    );
    if (!response.ok) throw new Error("Error al obtener datos de TMDB");

    const data = (await response.json()) as {
      seasons: {
        season_number: number;
        name: string;
        overview: string;
        poster_path: string | null;
      }[];
    };

    // 4. Guardar temporadas en DB (omitir season 0 = especiales)
    const temporadas: Season[] = [];
    for (const s of data.seasons) {
      if (s.season_number === 0) continue;

      const temporada = await prisma.temporada.create({
        data: {
          numero: s.season_number,
          nombre: s.name,
          descripcion: s.overview || null,
          imagenUrl: s.poster_path ? `${TMDB_IMAGE}${s.poster_path}` : null,
          idSerie,
        },
      });

      temporadas.push(
        new Season(
          temporada.id,
          temporada.numero,
          temporada.nombre,
          temporada.descripcion,
          temporada.imagenUrl,
          temporada.idSerie
        )
      );
    }

    return temporadas;
  }
}