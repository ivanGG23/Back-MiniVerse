import { Request, Response } from "express";
import { VerifyTokenUseCase } from "../../application/VerifyTokenUseCase";

const verifyTokenUseCase = new VerifyTokenUseCase();

export class VerifyController {
    handle(req: Request, res: Response): void {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "Token no proporcionado" });
                return;
            }

            const token = authHeader.split(" ")[1];
            const payload = verifyTokenUseCase.execute(token);
            res.status(200).json({ valido: true, payload });
        } catch (error: any) {
            res.status(401).json({ valido: false, error: "Token inválido o expirado" });
        }
    }
}
