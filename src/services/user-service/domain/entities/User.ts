export class User {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly correo: string,
    public readonly contrasena: string,
    public readonly edad: number
  ) {}
}
