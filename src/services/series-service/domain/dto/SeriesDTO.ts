export interface CreateSeriesDTO {
  nombre: string;
  estreno: number;
  sinopsis: string;
  idGenero: number;
  idDirector: number;
  imagenUrl?: string;
}

export interface UpdateSeriesDTO {
  nombre?: string;
  estreno?: number;
  sinopsis?: string;
  idGenero?: number;
  idDirector?: number;
  imagenUrl?: string;
}
