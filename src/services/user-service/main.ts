import express from "express";
import userRoutes from "./infrastructure/routes/Routes";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

// Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`👤 user-service corriendo en puerto ${PORT}`);
});

export default app;
