import { IEpisodeRepository } from "../domain/repositories/IEpisodeRepository";
import { Episode } from "../domain/entities/Episode";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TMDB_BASE = "https://api.themoviedb.org/3";

export class GetEpisodesBySeasonUseCase {
  constructor(private readonly episodeRepository: IEpisodeRepository) {}

  async execute(idTemporada: number): Promise<Episode[]> {
    return this.episodeRepository.findBySeason(idTemporada);
  }
}

export class ImportEpisodesFromTmdbUseCase {
  private readonly apiKey: string;

  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY no configurada en .env");
    }
    this.apiKey = process.env.TMDB_API_KEY;
  }

  async execute(idTemporada: number): Promise<Episode[]> {
    // 1. Buscar la temporada en DB para obtener número y tmdbId de la serie
    const temporada = await prisma.temporada.findUnique({
      where: { id: idTemporada },
      include: { serie: true },
    });

    if (!temporada) throw new Error("Temporada no encontrada en la DB");
    if (!temporada.serie.tmdbId) {
      throw new Error("La serie no tiene tmdbId, fue agregada manualmente");
    }

    // 2. Verificar si ya tiene episodios importados
    const existentes = await prisma.capitulo.findMany({ where: { idTemporada } });
    if (existentes.length > 0) {
      return existentes.map(
        (e) => new Episode(e.id, e.titulo, e.numero, e.duracion, e.idTemporada)
      );
    }

    // 3. Obtener episodios desde TMDB
    const response = await fetch(
      `${TMDB_BASE}/tv/${temporada.serie.tmdbId}/season/${temporada.numero}?api_key=${this.apiKey}&language=es-MX`
    );
    if (!response.ok) throw new Error("Error al obtener episodios de TMDB");

    const data = (await response.json()) as {
      episodes: {
        episode_number: number;
        name: string;
        runtime: number | null;
      }[];
    };

    // 4. Guardar episodios en DB
    const episodios: Episode[] = [];
    for (const e of data.episodes) {
      const capitulo = await prisma.capitulo.create({
        data: {
          titulo: e.name,
          numero: e.episode_number,
          duracion: e.runtime ?? 0,
          idTemporada,
        },
      });

      episodios.push(
        new Episode(
          capitulo.id,
          capitulo.titulo,
          capitulo.numero,
          capitulo.duracion,
          capitulo.idTemporada
        )
      );
    }

    return episodios;
  }
}
