import { Request, Response } from "express";
import { LoginUseCase } from "../../application/LoginUseCase";
import { PrismaAuthRepository } from "../../prisma/PrismaAuthRepository";

const repository = new PrismaAuthRepository();
const loginUseCase = new LoginUseCase(repository);

export class LoginController {
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { correo, contrasena } = req.body;

            if (!correo || !contrasena) {
                res.status(400).json({ error: "Correo y contraseña son obligatorios" });
                return;
            }

            const result = await loginUseCase.execute(correo, contrasena);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
