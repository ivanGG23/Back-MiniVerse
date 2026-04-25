import { Episode } from "../entities/Episode";

export interface CreateEpisodeDTO {
  titulo: string;
  numero: number;
  duracion: number;
  idTemporada: number;
}

export interface IEpisodeRepository {
  findById(id: number): Promise<Episode | null>;
  findBySeason(idTemporada: number): Promise<Episode[]>;
  create(data: CreateEpisodeDTO): Promise<Episode>;
  delete(id: number): Promise<void>;
}
