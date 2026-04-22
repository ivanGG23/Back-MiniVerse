import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/jwtMiddleware";
import { CreateCommentUseCase, GetCommentsByReviewUseCase, DeleteCommentUseCase } from "../../application/CreateCommentUseCase";
import { PrismaCommentRepository } from "../prisma/PrismaCommentRepository";

const repository = new PrismaCommentRepository();
const createCommentUseCase = new CreateCommentUseCase(repository);
const getByReviewUseCase = new GetCommentsByReviewUseCase(repository);
const deleteCommentUseCase = new DeleteCommentUseCase(repository);

export class CommentController {
  // GET /comments/review/:idResena
  async getByReview(req: Request, res: Response): Promise<void> {
    try {
      const idResena = parseInt(req.params.idResena);
      const comentarios = await getByReviewUseCase.execute(idResena);
      res.status(200).json(comentarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /comments
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const idUsuario = req.usuario!.id;
      const { contenido, idResena } = req.body;
      const comentario = await createCommentUseCase.execute({
        contenido,
        idResena,
        idUsuario,
      });
      res.status(201).json(comentario);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /comments/:id
  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const idUsuario = req.usuario!.id;
      await deleteCommentUseCase.execute(id, idUsuario);
      res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  }
}
