import { Comment } from "../entities/Comment";

export interface CreateCommentDTO {
  contenido: string;
  idUsuario: number;
  idResena: number;
}

export interface ICommentRepository {
  findById(id: number): Promise<Comment | null>;
  findByReview(idResena: number): Promise<Comment[]>;
  create(data: CreateCommentDTO): Promise<Comment>;
  delete(id: number): Promise<void>;
}
