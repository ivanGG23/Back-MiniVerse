import { User } from "../entities/User";
import { UpdateUserDTO } from "../dto/UpdateUserDTO";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  delete(id: number): Promise<void>;
}
