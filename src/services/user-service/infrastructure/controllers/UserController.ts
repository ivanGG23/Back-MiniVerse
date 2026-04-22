import { Response } from "express";
import { AuthRequest } from "../middlewares/jwtMiddleware";
import { GetUserUseCase } from "../../application/GetUserUseCase";
import { UpdateUserUseCase } from "../../application/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/DeleteUserUseCase";
import { PrismaUserRepository } from "../prisma/PrismaUserRepository";

const repository = new PrismaUserRepository();
const getUserUseCase = new GetUserUseCase(repository);
const updateUserUseCase = new UpdateUserUseCase(repository);
const deleteUserUseCase = new DeleteUserUseCase(repository);

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.usuario!.id;
      const usuario = await getUserUseCase.execute(id);

      res.status(200).json({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: usuario.edad,
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.usuario!.id;
      const { nombre, edad } = req.body;

      const usuario = await updateUserUseCase.execute(id, { nombre, edad });

      res.status(200).json({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: usuario.edad,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.usuario!.id;
      await deleteUserUseCase.execute(id);
      res.status(200).json({ mensaje: "Cuenta eliminada correctamente" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
