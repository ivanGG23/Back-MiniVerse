import { IReviewRepository } from "../domain/repositories/IReviewRepository";
import { Review } from "../domain/entities/Review";

export class GetReviewsByEpisodeUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(idCapitulo: number): Promise<Review[]> {
    return this.reviewRepository.findByEpisode(idCapitulo);
  }
}

export class GetReviewsByUserUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(idUsuario: number): Promise<Review[]> {
    return this.reviewRepository.findByUser(idUsuario);
  }
}

export class DeleteReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(id: number, idUsuario: number): Promise<void> {
    const resena = await this.reviewRepository.findById(id);
    if (!resena) throw new Error("Reseña no encontrada");
    if (resena.idUsuario !== idUsuario) {
      throw new Error("No tienes permiso para eliminar esta reseña");
    }
    await this.reviewRepository.delete(id);
  }
}
