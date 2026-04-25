import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.REALTIME_SERVICE_PORT || 3008;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const publicKey = fs.readFileSync(
  path.join(__dirname, "shared/keys/public.key"),
  "utf8"
);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

// Middleware de autenticacion para Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Token no proporcionado"));
  }
  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as { id: number; correo: string };
    socket.data.usuario = payload;
    next();
  } catch {
    next(new Error("Token invalido o expirado"));
  }
});

// Eventos de Socket.io
io.on("connection", (socket) => {
  const usuario = socket.data.usuario;
  console.log(`Usuario conectado: ${usuario.correo} (socket: ${socket.id})`);

  // Sala por resena (comentarios en tiempo real)
  socket.on("join:review", ({ idResena }: { idResena: number }) => {
    const room = `review:${idResena}`;
    socket.join(room);
    console.log(`${usuario.correo} se unio a la sala ${room}`);
  });

  socket.on("leave:review", ({ idResena }: { idResena: number }) => {
    const room = `review:${idResena}`;
    socket.leave(room);
    console.log(`${usuario.correo} salio de la sala ${room}`);
  });

  // Sala por episodio (resenas en tiempo real)
  socket.on("join:episode", ({ idCapitulo }: { idCapitulo: number }) => {
    const room = `episode:${idCapitulo}`;
    socket.join(room);
    console.log(`${usuario.correo} se unio a la sala ${room}`);
  });

  socket.on("leave:episode", ({ idCapitulo }: { idCapitulo: number }) => {
    const room = `episode:${idCapitulo}`;
    socket.leave(room);
    console.log(`${usuario.correo} salio de la sala ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${usuario.correo}`);
  });
});

// Endpoint interno para emitir comentarios nuevos
app.post("/emit/comment", (req, res) => {
  const { idResena, comentario } = req.body;

  if (!idResena || !comentario) {
    res.status(400).json({ error: "idResena y comentario son requeridos" });
    return;
  }

  const room = `review:${idResena}`;
  io.to(room).emit("new:comment", comentario);

  console.log(`Comentario emitido a sala ${room}`);
  res.status(200).json({ mensaje: "Comentario emitido correctamente" });
});

// Endpoint interno para emitir resenas nuevas
app.post("/emit/review", (req, res) => {
  const { idCapitulo, resena } = req.body;

  if (!idCapitulo || !resena) {
    res.status(400).json({ error: "idCapitulo y resena son requeridos" });
    return;
  }

  const room = `episode:${idCapitulo}`;
  io.to(room).emit("new:review", resena);

  console.log(`Resena emitida a sala ${room}`);
  res.status(200).json({ mensaje: "Resena emitida correctamente" });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "realtime-service",
    connectedClients: io.engine.clientsCount,
  });
});

httpServer.listen(PORT, () => {
  console.log(`realtime-service corriendo en puerto ${PORT}`);
});

export default app;