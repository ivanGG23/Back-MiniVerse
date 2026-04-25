import { ISeasonRepository, CreateSeasonDTO } from "../domain/repositories/ISeasonRepository";
import { Season } from "../domain/entities/Season";

export class CreateSeasonUseCase {
  constructor(private readonly seasonRepository: ISeasonRepository) {}

  async execute(data: CreateSeasonDTO): Promise<Season> {
    if (!data.numero || !data.nombre || !data.idSerie) {
      throw new Error("numero, nombre e idSerie son obligatorios");
    }
    return this.seasonRepository.create(data);
  }
}
