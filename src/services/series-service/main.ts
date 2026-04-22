import "dotenv/config";
import express from "express";
import seriesRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.SERIES_SERVICE_PORT || 3003;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "series-service" });
});

app.use("/series", seriesRoutes);

app.listen(PORT, () => {
  console.log(`🎬 series-service corriendo en puerto ${PORT}`);
});

export default app;