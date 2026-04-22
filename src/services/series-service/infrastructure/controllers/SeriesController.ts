import { Request, Response } from "express";
import { CreateSeriesUseCase } from "../../application/CreateSeriesUseCase";
import { GetSeriesUseCase } from "../../application/GetSeriesUseCase";
import { UpdateSeriesUseCase } from "../../application/UpdateSeriesUseCase";
import { SearchSeriesUseCase } from "../../application/SearchSeriesUseCase";
import { ImportSeriesFromTmdbUseCase } from "../../application/ImportSeriesFromTmdbUseCase";
import { PrismaSeriesRepository } from "../prisma/PrismaSeriesRepository";

const repository = new PrismaSeriesRepository();
const createSeriesUseCase = new CreateSeriesUseCase(repository);
const getSeriesUseCase = new GetSeriesUseCase(repository);
const updateSeriesUseCase = new UpdateSeriesUseCase(repository);
const searchSeriesUseCase = new SearchSeriesUseCase();
const importSeriesUseCase = new ImportSeriesFromTmdbUseCase();

export class SeriesController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const series = await getSeriesUseCase.getAll();
      res.status(200).json(series);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const serie = await getSeriesUseCase.getById(id);
      res.status(200).json(serie);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getByGenero(req: Request, res: Response): Promise<void> {
    try {
      const idGenero = parseInt(req.params.idGenero);
      const series = await getSeriesUseCase.getByGenero(idGenero);
      res.status(200).json(series);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({ error: "El parámetro 'q' es requerido" });
        return;
      }
      const resultados = await searchSeriesUseCase.execute(query);
      res.status(200).json(resultados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async importFromTmdb(req: Request, res: Response): Promise<void> {
    try {
      const { tmdbId } = req.body;
      if (!tmdbId) {
        res.status(400).json({ error: "El campo 'tmdbId' es requerido" });
        return;
      }
      const serie = await importSeriesUseCase.execute(parseInt(tmdbId));
      res.status(201).json(serie);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const serie = await createSeriesUseCase.execute(req.body);
      res.status(201).json(serie);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const serie = await updateSeriesUseCase.execute(id, req.body);
      res.status(200).json(serie);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await repository.delete(id);
      res.status(200).json({ mensaje: "Serie eliminada correctamente" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}