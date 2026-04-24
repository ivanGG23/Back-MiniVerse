import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/jwtMiddleware";
import { CreateReviewUseCase } from "../../application/CreateReviewUseCase";
import { GetReviewsByEpisodeUseCase, GetReviewsByUserUseCase, DeleteReviewUseCase } from "../../application/GetReviewsByEpisodeUseCase";
import { PrismaReviewRepository } from "../prisma/PrismaReviewRepository";

const repository = new PrismaReviewRepository();
const createReviewUseCase = new CreateReviewUseCase(repository);
const getByEpisodeUseCase = new GetReviewsByEpisodeUseCase(repository);
const getByUserUseCase = new GetReviewsByUserUseCase(repository);
const deleteReviewUseCase = new DeleteReviewUseCase(repository);

export class ReviewController {
  async getByEpisode(req: Request, res: Response): Promise<void> {
    try {
      const idCapitulo = parseInt(req.params.idCapitulo);
      const resenas = await getByEpisodeUseCase.execute(idCapitulo);
      res.status(200).json(resenas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyReviews(req: AuthRequest, res: Response): Promise<void> {
    try {
      const idUsuario = req.usuario!.id;
      const resenas = await getByUserUseCase.execute(idUsuario);
      res.status(200).json(resenas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const idUsuario = req.usuario!.id;
      const { contenido, idCapitulo } = req.body;
      const resena = await createReviewUseCase.execute({
        contenido,
        idCapitulo,
        idUsuario,
      });
      res.status(201).json(resena);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const idUsuario = req.usuario!.id;
      await deleteReviewUseCase.execute(id, idUsuario);
      res.status(200).json({ mensaje: "Reseña eliminada correctamente" });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  }
}
