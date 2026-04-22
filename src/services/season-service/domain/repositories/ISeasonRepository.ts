import { Season } from "../entities/Season";

export interface CreateSeasonDTO {
  numero: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  idSerie: number;
}

export interface ISeasonRepository {
  findById(id: number): Promise<Season | null>;
  findBySerie(idSerie: number): Promise<Season[]>;
  create(data: CreateSeasonDTO): Promise<Season>;
  delete(id: number): Promise<void>;
}
