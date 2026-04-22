import { Router, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authLimiter, generalLimiter } from "../middlewares/rateLimit";

const router = Router();

const SERVICES = {
  auth:    process.env.AUTH_SERVICE_URL    || "http://localhost:3001",
  user:    process.env.USER_SERVICE_URL    || "http://localhost:3002",
  series:  process.env.SERIES_SERVICE_URL  || "http://localhost:3003",
  seasons: process.env.SEASON_SERVICE_URL  || "http://localhost:3004",
  episodes:process.env.EPISODE_SERVICE_URL || "http://localhost:3005",
  reviews: process.env.REVIEW_SERVICE_URL  || "http://localhost:3006",
  comments:process.env.COMMENT_SERVICE_URL || "http://localhost:3007",
};

const proxy = (target: string) =>
  createProxyMiddleware({ target, changeOrigin: true });

// ── Auth (con rate limit estricto) ─────────────────────
router.use("/auth", authLimiter, proxy(SERVICES.auth));

// ── Servicios con rate limit general ──────────────────
router.use("/users",    generalLimiter, proxy(SERVICES.user));
router.use("/series",   generalLimiter, proxy(SERVICES.series));
router.use("/seasons",  generalLimiter, proxy(SERVICES.seasons));
router.use("/episodes", generalLimiter, proxy(SERVICES.episodes));
router.use("/reviews",  generalLimiter, proxy(SERVICES.reviews));
router.use("/comments", generalLimiter, proxy(SERVICES.comments));

// ── Health check de todos los servicios ───────────────
router.get("/health", async (_req: Request, res: Response) => {
  const checks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, url]) => {
      const response = await fetch(`${url}/health`);
      const data = await response.json();
      return { name, status: "up", data };
    })
  );

  const results = checks.map((check) =>
    check.status === "fulfilled"
      ? check.value
      : { name: "unknown", status: "down" }
  );

  res.json({ gateway: "up", services: results });
});

export default router;
