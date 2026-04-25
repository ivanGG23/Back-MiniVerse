import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/Routes";

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// Todas las rutas pasan por el gateway
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`api-gateway corriendo en puerto ${PORT}`);
  console.log(`Todas las rutas disponibles en http://localhost:${PORT}/api`);
});

export default app;