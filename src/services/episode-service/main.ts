import "dotenv/config";
import express from "express";
import episodeRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "episode-service" });
});

app.use("/episodes", episodeRoutes);

app.listen(PORT, () => {
  console.log(`🎞️ episode-service corriendo en puerto ${PORT}`);
});

export default app;
