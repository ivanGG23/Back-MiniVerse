import { IReviewRepository, CreateReviewDTO } from "../domain/repositories/IReviewRepository";
import { Review } from "../domain/entities/Review";

const REALTIME_SERVICE_URL =
  process.env.REALTIME_SERVICE_URL || "http://localhost:3008";

export class CreateReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) { }

  async execute(data: CreateReviewDTO): Promise<Review> {
    if (!data.contenido || !data.idCapitulo || !data.idUsuario) {
      throw new Error("contenido, idCapitulo e idUsuario son obligatorios");
    }
    if (data.contenido.trim().length < 10) {
      throw new Error("La reseña debe tener al menos 10 caracteres");
    }

    // 1. Guardar en DB
    const resena = await this.reviewRepository.create(data);

    // 2. Notificar al realtime-service (sin bloquear la respuesta)
    fetch(`${REALTIME_SERVICE_URL}/emit/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCapitulo: data.idCapitulo,
        resena: {
          id: resena.id,
          contenido: resena.contenido,
          fechaCreacion: resena.fechaCreacion,
          idCapitulo: resena.idCapitulo,
          idUsuario: resena.idUsuario,
        },
      }),
    }).catch((err) =>
      console.error("Error notificando al realtime-service:", err)
    );

    return resena;
  }
}