const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

export interface TmdbSerieResult {
  tmdbId: number;
  nombre: string;
  estreno: string;
  sinopsis: string;
  imagenUrl: string | null;
  generos: string[];
}

export class SearchSeriesUseCase {
  private readonly apiKey: string;

  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY no configurada en .env");
    }
    this.apiKey = process.env.TMDB_API_KEY;
  }

  async execute(query: string): Promise<TmdbSerieResult[]> {
    if (!query || query.trim().length === 0) {
      throw new Error("El término de búsqueda no puede estar vacío");
    }

    const url = `${TMDB_BASE}/search/tv?api_key=${this.apiKey}&language=es-MX&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = (await response.json()) as {
      results: {
        id: number;
        name: string;
        first_air_date: string;
        overview: string;
        poster_path: string | null;
        genre_ids: number[];
      }[];
    };

    const generosRes = await fetch(
      `${TMDB_BASE}/genre/tv/list?api_key=${this.apiKey}&language=es-MX`
    );
    const generosData = (await generosRes.json()) as {
      genres: { id: number; name: string }[];
    };
    const generosMap = new Map<number, string>(
      generosData.genres.map((g) => [g.id, g.name])
    );

    return data.results
      .filter((s) => s.overview)
      .map((s) => ({
        tmdbId: s.id,
        nombre: s.name,
        estreno: s.first_air_date ? s.first_air_date.split("-")[0] : "N/A",
        sinopsis: s.overview,
        imagenUrl: s.poster_path ? `${TMDB_IMAGE}${s.poster_path}` : null,
        generos: s.genre_ids.map((id) => generosMap.get(id) ?? "Desconocido"),
      }));
  }
}
