import { Review } from "../entities/Review";

export interface CreateReviewDTO {
  contenido: string;
  idCapitulo: number;
  idUsuario: number;
}

export interface IReviewRepository {
  findById(id: number): Promise<Review | null>;
  findByEpisode(idCapitulo: number): Promise<Review[]>;
  findByUser(idUsuario: number): Promise<Review[]>;
  create(data: CreateReviewDTO): Promise<Review>;
  delete(id: number): Promise<void>;
}
