import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController";
import { jwtMiddleware, AuthRequest } from "../middlewares/jwtMiddleware";
import { Response } from "express";

const router = Router();
const reviewController = new ReviewController();

router.get("/episode/:idCapitulo", (req, res) =>
  reviewController.getByEpisode(req, res)
);

router.get("/me", jwtMiddleware, (req, res) =>
  reviewController.getMyReviews(req as AuthRequest, res as Response)
);
router.post("/", jwtMiddleware, (req, res) =>
  reviewController.create(req as AuthRequest, res as Response)
);
router.delete("/:id", jwtMiddleware, (req, res) =>
  reviewController.delete(req as AuthRequest, res as Response)
);

export default router;
