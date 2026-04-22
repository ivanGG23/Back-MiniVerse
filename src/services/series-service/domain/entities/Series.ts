export class Series {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly estreno: number,
    public readonly sinopsis: string,
    public readonly idGenero: number,
    public readonly idDirector: number,
    public readonly imagenUrl: string | null
  ) {}
}
