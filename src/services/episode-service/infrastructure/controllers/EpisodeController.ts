import { Request, Response } from "express";
import { CreateEpisodeUseCase } from "../../application/CreateEpisodeUseCase";
import { GetEpisodesBySeasonUseCase, ImportEpisodesFromTmdbUseCase } from "../../application/GetEpisodesBySeasonUseCase";
import { PrismaEpisodeRepository } from "../prisma/PrismaEpisodeRepository";

const repository = new PrismaEpisodeRepository();
const createEpisodeUseCase = new CreateEpisodeUseCase(repository);
const getEpisodesBySeasonUseCase = new GetEpisodesBySeasonUseCase(repository);
const importEpisodesUseCase = new ImportEpisodesFromTmdbUseCase();

export class EpisodeController {
  // GET /episodes/season/:idTemporada
  async getBySeason(req: Request, res: Response): Promise<void> {
    try {
      const idTemporada = parseInt(req.params.idTemporada);
      const episodios = await getEpisodesBySeasonUseCase.execute(idTemporada);
      res.status(200).json(episodios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /episodes/import/:idTemporada
  async importFromTmdb(req: Request, res: Response): Promise<void> {
    try {
      const idTemporada = parseInt(req.params.idTemporada);
      const episodios = await importEpisodesUseCase.execute(idTemporada);
      res.status(200).json(episodios);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /episodes
  async create(req: Request, res: Response): Promise<void> {
    try {
      const episodio = await createEpisodeUseCase.execute(req.body);
      res.status(201).json(episodio);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /episodes/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await repository.delete(id);
      res.status(200).json({ mensaje: "Episodio eliminado correctamente" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
