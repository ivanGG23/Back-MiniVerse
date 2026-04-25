import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";
import { AuthRequest } from "../middlewares/jwtMiddleware";
import { Response } from "express";

const router = Router();
const userController = new UserController();

// Todas las rutas requieren JWT
router.use(jwtMiddleware);

// GET /users/profile → obtener perfil del usuario autenticado
router.get("/profile", (req, res) =>
  userController.getProfile(req as AuthRequest, res as Response)
);

// PUT /users/profile → actualizar nombre o edad
router.put("/profile", (req, res) =>
  userController.update(req as AuthRequest, res as Response)
);

// DELETE /users/profile → eliminar cuenta
router.delete("/profile", (req, res) =>
  userController.delete(req as AuthRequest, res as Response)
);

export default router;
