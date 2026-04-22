import { User } from "../entities/User";
import { RegisterRequest } from "../dto/RegisterRequest";

export interface IAuthRepository {
    findByCorreo(correo: string): Promise<User | null>;
    create(data: RegisterRequest): Promise<User>;
}
