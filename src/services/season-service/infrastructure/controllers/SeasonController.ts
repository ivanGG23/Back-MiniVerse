import { Request, Response } from "express";
import { CreateSeasonUseCase } from "../../application/CreateSeasonUseCase";
import { GetSeasonsBySeriesUseCase, ImportSeasonsFromTmdbUseCase } from "../../application/GetSeasonsBySeriesUseCase";
import { PrismaSeasonRepository } from "../prisma/PrismaSeasonRepository";

const repository = new PrismaSeasonRepository();
const createSeasonUseCase = new CreateSeasonUseCase(repository);
const getSeasonsBySeriesUseCase = new GetSeasonsBySeriesUseCase(repository);
const importSeasonsUseCase = new ImportSeasonsFromTmdbUseCase();

export class SeasonController {
  // GET /seasons/serie/:idSerie
  async getBySerie(req: Request, res: Response): Promise<void> {
    try {
      const idSerie = parseInt(req.params.idSerie);
      const temporadas = await getSeasonsBySeriesUseCase.execute(idSerie);
      res.status(200).json(temporadas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /seasons/import/:idSerie
  async importFromTmdb(req: Request, res: Response): Promise<void> {
    try {
      const idSerie = parseInt(req.params.idSerie);
      const temporadas = await importSeasonsUseCase.execute(idSerie);
      res.status(200).json(temporadas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /seasons
  async create(req: Request, res: Response): Promise<void> {
    try {
      const temporada = await createSeasonUseCase.execute(req.body);
      res.status(201).json(temporada);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /seasons/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await repository.delete(id);
      res.status(200).json({ mensaje: "Temporada eliminada correctamente" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
