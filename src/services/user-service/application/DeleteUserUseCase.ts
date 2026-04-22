import { IUserRepository } from "../domain/repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const existe = await this.userRepository.findById(id);
    if (!existe) {
      throw new Error("Usuario no encontrado");
    }

    await this.userRepository.delete(id);
  }
}
