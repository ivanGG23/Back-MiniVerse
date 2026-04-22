import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { RegisterRequest } from "../domain/dto/RegisterRequest";
import { AuthResponse } from "../domain/dto/AuthResponse";
import { hashPassword } from "../shared/hash";
import { generateToken } from "../shared/jwt";

export class RegisterUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async execute(data: RegisterRequest): Promise<AuthResponse> {
        const existe = await this.authRepository.findByCorreo(data.correo);
        if (existe) {
            throw new Error("El correo ya está registrado");
        }

        const hashedPassword = await hashPassword(data.contrasena);
        const usuario = await this.authRepository.create({
            ...data,
            contrasena: hashedPassword,
        });

        const token = generateToken({ id: usuario.id, correo: usuario.correo });

        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
            },
        };
    }
}
