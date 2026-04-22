import { Request, Response } from "express";
import { RegisterUseCase } from "../../application/RegisterUseCase";
import { PrismaAuthRepository } from "../../prisma/PrismaAuthRepository";

const repository = new PrismaAuthRepository();
const registerUseCase = new RegisterUseCase(repository);

export class RegisterController {
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, correo, contrasena, edad } = req.body;

            if (!nombre || !correo || !contrasena || !edad) {
                res.status(400).json({ error: "Todos los campos son obligatorios" });
                return;
            }

            const result = await registerUseCase.execute({ nombre, correo, contrasena, edad });
            res.status(201).json(result);
        } catch (error: any) {
            res.status(409).json({ error: error.message });
        }
    }
}
