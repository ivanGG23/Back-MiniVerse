import "dotenv/config";
import express from "express";
import reviewRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "review-service" });
});

app.use("/reviews", reviewRoutes);

app.listen(PORT, () => {
  console.log(`⭐ review-service corriendo en puerto ${PORT}`);
});

export default app;
