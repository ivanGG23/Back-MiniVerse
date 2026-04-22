import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { jwtMiddleware, AuthRequest } from "../middlewares/jwtMiddleware";
import { Response } from "express";

const router = Router();
const commentController = new CommentController();

// Públicas
router.get("/review/:idResena", (req, res) =>
  commentController.getByReview(req, res)
);

// Protegidas
router.post("/", jwtMiddleware, (req, res) =>
  commentController.create(req as AuthRequest, res as Response)
);
router.delete("/:id", jwtMiddleware, (req, res) =>
  commentController.delete(req as AuthRequest, res as Response)
);

export default router;
