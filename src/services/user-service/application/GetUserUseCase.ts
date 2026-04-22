import { IUserRepository } from "../domain/repositories/IUserRepository";
import { User } from "../domain/entities/User";

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User> {
    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }
}
