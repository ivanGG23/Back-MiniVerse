import { verifyToken } from "../shared/jwt";

export class VerifyTokenUseCase {
    execute(token: string): { id: number; correo: string } {
        const payload = verifyToken(token);
        return payload as { id: number; correo: string };
    }
}
