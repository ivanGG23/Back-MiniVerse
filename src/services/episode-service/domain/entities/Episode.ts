export class Episode {
  constructor(
    public readonly id: number,
    public readonly titulo: string,
    public readonly numero: number,
    public readonly duracion: number,
    public readonly idTemporada: number
  ) {}
}
