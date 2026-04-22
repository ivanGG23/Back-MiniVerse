import { Router } from "express";
import { SeriesController } from "../controllers/SeriesController";
import { SeedController } from "../controllers/SeedController";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const router = Router();
const seriesController = new SeriesController();
const seedController = new SeedController();

// Públicas
router.get("/search", (req, res) => seriesController.search(req, res));
router.get("/", (req, res) => seriesController.getAll(req, res));
router.get("/:id", (req, res) => seriesController.getById(req, res));
router.get("/genero/:idGenero", (req, res) => seriesController.getByGenero(req, res));

// Protegidas
router.post("/import", jwtMiddleware, (req, res) => seriesController.importFromTmdb(req, res));
router.post("/seed", jwtMiddleware, (req, res) => seedController.seed(req, res));
router.post("/", jwtMiddleware, (req, res) => seriesController.create(req, res));
router.put("/:id", jwtMiddleware, (req, res) => seriesController.update(req, res));
router.delete("/:id", jwtMiddleware, (req, res) => seriesController.delete(req, res));

export default router;