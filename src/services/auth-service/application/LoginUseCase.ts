import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { AuthResponse } from "../domain/dto/AuthResponse";
import { comparePassword } from "../shared/hash";
import { generateToken } from "../shared/jwt";

export class LoginUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async execute(correo: string, contrasena: string): Promise<AuthResponse> {
        const usuario = await this.authRepository.findByCorreo(correo);
        if (!usuario) {
            throw new Error("Credenciales inválidas");
        }

        const passwordValido = await comparePassword(contrasena, usuario.contrasena);
        if (!passwordValido) {
            throw new Error("Credenciales inválidas");
        }

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
