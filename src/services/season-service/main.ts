import "dotenv/config";
import express from "express";
import seasonRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.SEASON_SERVICE_PORT || 3004;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "season-service" });
});

app.use("/seasons", seasonRoutes);

app.listen(PORT, () => {
  console.log(`📺 season-service corriendo en puerto ${PORT}`);
});

export default app;
