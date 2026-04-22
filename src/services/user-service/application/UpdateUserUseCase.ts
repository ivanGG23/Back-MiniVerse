import { IUserRepository } from "../domain/repositories/IUserRepository";
import { UpdateUserDTO } from "../domain/dto/UpdateUserDTO";
import { User } from "../domain/entities/User";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, data: UpdateUserDTO): Promise<User> {
    const existe = await this.userRepository.findById(id);
    if (!existe) {
      throw new Error("Usuario no encontrado");
    }

    if (!data.nombre && !data.edad) {
      throw new Error("Debes proporcionar al menos un campo para actualizar");
    }

    return this.userRepository.update(id, data);
  }
}
