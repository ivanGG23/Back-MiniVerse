import { Router } from "express";
import { EpisodeController } from "../controllers/EpisodeController";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const router = Router();
const episodeController = new EpisodeController();

// Públicas
router.get("/season/:idTemporada", (req, res) => episodeController.getBySeason(req, res));

// Protegidas
router.post("/import/:idTemporada", jwtMiddleware, (req, res) => episodeController.importFromTmdb(req, res));
router.post("/", jwtMiddleware, (req, res) => episodeController.create(req, res));
router.delete("/:id", jwtMiddleware, (req, res) => episodeController.delete(req, res));

export default router;
