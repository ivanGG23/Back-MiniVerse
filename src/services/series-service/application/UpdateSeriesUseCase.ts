import { ISeriesRepository } from "../domain/repositories/ISeriesRepository";
import { UpdateSeriesDTO } from "../domain/dto/SeriesDTO";
import { Series } from "../domain/entities/Series";

export class UpdateSeriesUseCase {
  constructor(private readonly seriesRepository: ISeriesRepository) {}

  async execute(id: number, data: UpdateSeriesDTO): Promise<Series> {
    const existe = await this.seriesRepository.findById(id);
    if (!existe) throw new Error("Serie no encontrada");
    return this.seriesRepository.update(id, data);
  }
}
