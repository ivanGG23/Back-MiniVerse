import { IEpisodeRepository, CreateEpisodeDTO } from "../domain/repositories/IEpisodeRepository";
import { Episode } from "../domain/entities/Episode";

export class CreateEpisodeUseCase {
  constructor(private readonly episodeRepository: IEpisodeRepository) {}

  async execute(data: CreateEpisodeDTO): Promise<Episode> {
    if (!data.titulo || !data.numero || !data.idTemporada) {
      throw new Error("titulo, numero e idTemporada son obligatorios");
    }
    return this.episodeRepository.create(data);
  }
}
