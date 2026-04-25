import "dotenv/config";
import express from "express";
import commentRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "comment-service" });
});

app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`💬 comment-service corriendo en puerto ${PORT}`);
});

export default app;
