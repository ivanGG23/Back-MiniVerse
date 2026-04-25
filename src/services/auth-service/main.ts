import express from "express";
import authRoutes from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "auth-service" });
});

// Routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`🔐 auth-service corriendo en puerto ${PORT}`);
});

export default app;
