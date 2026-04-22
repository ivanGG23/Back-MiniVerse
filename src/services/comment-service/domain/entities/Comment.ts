export class Comment {
  constructor(
    public readonly id: number,
    public readonly contenido: string,
    public readonly fechaCreacion: Date,
    public readonly idUsuario: number,
    public readonly idResena: number
  ) {}
}
