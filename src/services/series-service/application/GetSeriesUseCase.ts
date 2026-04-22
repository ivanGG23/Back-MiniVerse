import { ISeriesRepository } from "../domain/repositories/ISeriesRepository";
import { Series } from "../domain/entities/Series";

export class GetSeriesUseCase {
  constructor(private readonly seriesRepository: ISeriesRepository) {}

  async getAll(): Promise<Series[]> {
    return this.seriesRepository.findAll();
  }

  async getById(id: number): Promise<Series> {
    const serie = await this.seriesRepository.findById(id);
    if (!serie) throw new Error("Serie no encontrada");
    return serie;
  }

  async getByGenero(idGenero: number): Promise<Series[]> {
    return this.seriesRepository.findByGenero(idGenero);
  }
}
