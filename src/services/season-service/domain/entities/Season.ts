export class Season {
  constructor(
    public readonly id: number,
    public readonly numero: number,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly imagenUrl: string | null,
    public readonly idSerie: number
  ) {}
}
