import { Series } from "../entities/Series";
import { CreateSeriesDTO, UpdateSeriesDTO } from "../dto/SeriesDTO";

export interface ISeriesRepository {
  findAll(): Promise<Series[]>;
  findById(id: number): Promise<Series | null>;
  findByGenero(idGenero: number): Promise<Series[]>;
  create(data: CreateSeriesDTO): Promise<Series>;
  update(id: number, data: UpdateSeriesDTO): Promise<Series>;
  delete(id: number): Promise<void>;
}
