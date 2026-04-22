import { ICommentRepository, CreateCommentDTO } from "../domain/repositories/ICommentRepository";
import { Comment } from "../domain/entities/Comment";

export class CreateCommentUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(data: CreateCommentDTO): Promise<Comment> {
    if (!data.contenido || !data.idResena || !data.idUsuario) {
      throw new Error("contenido, idResena e idUsuario son obligatorios");
    }
    if (data.contenido.trim().length < 2) {
      throw new Error("El comentario debe tener al menos 2 caracteres");
    }
    return this.commentRepository.create(data);
  }
}

export class GetCommentsByReviewUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(idResena: number): Promise<Comment[]> {
    return this.commentRepository.findByReview(idResena);
  }
}

export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(id: number, idUsuario: number): Promise<void> {
    const comentario = await this.commentRepository.findById(id);
    if (!comentario) throw new Error("Comentario no encontrado");
    if (comentario.idUsuario !== idUsuario) {
      throw new Error("No tienes permiso para eliminar este comentario");
    }
    await this.commentRepository.delete(id);
  }
}
