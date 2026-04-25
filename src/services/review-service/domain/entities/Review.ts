export class Review {
  constructor(
    public readonly id: number,
    public readonly contenido: string,
    public readonly fechaCreacion: Date,
    public readonly idCapitulo: number,
    public readonly idUsuario: number
  ) {}
}
