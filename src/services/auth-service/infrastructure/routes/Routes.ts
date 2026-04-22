import { Router } from "express";
import { RegisterController } from "../controllers/RegisterController";
import { LoginController } from "../controllers/LoginController";
import { VerifyController } from "../controllers/VerifyController";

const router = Router();
const registerController = new RegisterController();
const loginController = new LoginController();
const verifyController = new VerifyController();

// POST /auth/register
router.post("/register", (req, res) => registerController.handle(req, res));

// POST /auth/login
router.post("/login", (req, res) => loginController.handle(req, res));

// GET /auth/verify
router.get("/verify", (req, res) => verifyController.handle(req, res));

export default router;
