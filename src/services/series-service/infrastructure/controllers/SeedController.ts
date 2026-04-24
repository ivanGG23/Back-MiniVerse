import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

export class SeedController {
    async seed(_req: Request, res: Response): Promise<void> {
        try {
            if (!TMDB_API_KEY) {
                res.status(500).json({ error: "TMDB_API_KEY no configurada en .env" });
                return;
            }

            const generosRes = await fetch(
                `${TMDB_BASE}/genre/tv/list?api_key=${TMDB_API_KEY}&language=es-MX`
            );
            const generosData = (await generosRes.json()) as { genres: { id: number; name: string }[] };

            const generosMap = new Map<number, number>();
            for (const g of generosData.genres) {
                const genero = await prisma.genero.upsert({
                    where: { nombre: g.name },
                    update: {},
                    create: { nombre: g.name },
                });
                generosMap.set(g.id, genero.id);
            }

            const directorDefault = await prisma.director.upsert({
                where: { nombre: "Desconocido" },
                update: {},
                create: { nombre: "Desconocido", biografia: "Director no especificado" },
            });

            let seriesInsertadas = 0;
            let seriesOmitidas = 0;

            for (let page = 1; page <= 3; page++) {
                const seriesRes = await fetch(
                    `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}&language=es-MX&page=${page}`
                );
                const seriesData = (await seriesRes.json()) as {
                    results: {
                        id: number;
                        name: string;
                        first_air_date: string;
                        overview: string;
                        genre_ids: number[];
                        poster_path: string | null;
                    }[];
                };

                for (const s of seriesData.results) {
                    if (!s.overview) {
                        seriesOmitidas++;
                        continue;
                    }

                    const estreno = s.first_air_date
                        ? parseInt(s.first_air_date.split("-")[0])
                        : 0;

                    const idGeneroTmdb = s.genre_ids[0];
                    const idGenero = idGeneroTmdb
                        ? (generosMap.get(idGeneroTmdb) ?? directorDefault.id)
                        : 1;

                    const imagenUrl = s.poster_path
                        ? `${TMDB_IMAGE}${s.poster_path}`
                        : null;

                    const existe = await prisma.serie.findFirst({
                        where: { nombre: s.name },
                    });

                    if (!existe) {
                        await prisma.serie.create({
                            data: {
                                nombre: s.name,
                                estreno,
                                sinopsis: s.overview,
                                idGenero,
                                idDirector: directorDefault.id,
                                imagenUrl,
                            },
                        });
                        seriesInsertadas++;
                    } else {
                        seriesOmitidas++;
                    }
                }
            }

            res.status(200).json({
                mensaje: "Seeding completado",
                seriesInsertadas,
                seriesOmitidas,
                generosCreados: generosMap.size,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}