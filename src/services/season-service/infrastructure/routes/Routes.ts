import { Router } from "express";
import { SeasonController } from "../controllers/SeasonController";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const router = Router();
const seasonController = new SeasonController();

// Públicas
router.get("/serie/:idSerie", (req, res) => seasonController.getBySerie(req, res));

// Protegidas
router.post("/import/:idSerie", jwtMiddleware, (req, res) => seasonController.importFromTmdb(req, res));
router.post("/", jwtMiddleware, (req, res) => seasonController.create(req, res));
router.delete("/:id", jwtMiddleware, (req, res) => seasonController.delete(req, res));

export default router;
