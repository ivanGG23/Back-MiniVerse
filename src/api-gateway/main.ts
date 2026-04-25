import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/Routes";

const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`api-gateway corriendo en puerto ${PORT}`);
  console.log(`Todas las rutas disponibles en http://localhost:${PORT}/api`);
});

export default app;