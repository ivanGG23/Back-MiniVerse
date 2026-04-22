import { ISeriesRepository } from "../domain/repositories/ISeriesRepository";
import { CreateSeriesDTO } from "../domain/dto/SeriesDTO";
import { Series } from "../domain/entities/Series";

export class CreateSeriesUseCase {
  constructor(private readonly seriesRepository: ISeriesRepository) {}

  async execute(data: CreateSeriesDTO): Promise<Series> {
    if (!data.nombre || !data.estreno || !data.sinopsis || !data.idGenero || !data.idDirector) {
      throw new Error("Todos los campos obligatorios deben estar presentes");
    }
    return this.seriesRepository.create(data);
  }
}
