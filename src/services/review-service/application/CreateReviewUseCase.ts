import { IReviewRepository, CreateReviewDTO } from "../domain/repositories/IReviewRepository";
import { Review } from "../domain/entities/Review";

export class CreateReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(data: CreateReviewDTO): Promise<Review> {
    if (!data.contenido || !data.idCapitulo || !data.idUsuario) {
      throw new Error("contenido, idCapitulo e idUsuario son obligatorios");
    }
    if (data.contenido.trim().length < 10) {
      throw new Error("La reseña debe tener al menos 10 caracteres");
    }
    return this.reviewRepository.create(data);
  }
}
