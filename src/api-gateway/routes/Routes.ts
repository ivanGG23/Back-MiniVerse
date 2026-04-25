import { Router, Request, Response } from "express";
import proxy from "express-http-proxy";
import { authLimiter, generalLimiter } from "../middlewares/rateLimit";

const router = Router();

const SERVICES = {
  auth:     process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  user:     process.env.USER_SERVICE_URL || "http://localhost:3002",
  series:   process.env.SERIES_SERVICE_URL || "http://localhost:3003",
  seasons:  process.env.SEASON_SERVICE_URL || "http://localhost:3004",
  episodes: process.env.EPISODE_SERVICE_URL || "http://localhost:3005",
  reviews:  process.env.REVIEW_SERVICE_URL || "http://localhost:3006",
  comments: process.env.COMMENT_SERVICE_URL || "http://localhost:3007",
  realtime: process.env.REALTIME_SERVICE_URL || "http://localhost:3008",
};

router.use("/auth", authLimiter, proxy(SERVICES.auth, {
  proxyReqPathResolver: (req) => `/auth${req.url}`
}));

router.use("/users", generalLimiter, proxy(SERVICES.user, {
  proxyReqPathResolver: (req) => `/users${req.url}`
}));

router.use("/series", generalLimiter, proxy(SERVICES.series, {
  proxyReqPathResolver: (req) => `/series${req.url}`
}));

router.use("/seasons", generalLimiter, proxy(SERVICES.seasons, {
  proxyReqPathResolver: (req) => `/seasons${req.url}`
}));

router.use("/episodes", generalLimiter, proxy(SERVICES.episodes, {
  proxyReqPathResolver: (req) => `/episodes${req.url}`
}));

router.use("/reviews", generalLimiter, proxy(SERVICES.reviews, {
  proxyReqPathResolver: (req) => `/reviews${req.url}`
}));

router.use("/comments", generalLimiter, proxy(SERVICES.comments, {
  proxyReqPathResolver: (req) => `/comments${req.url}`
}));

router.use("/realtime", generalLimiter, proxy(SERVICES.realtime, {
  proxyReqPathResolver: (req) => `/realtime${req.url}`
}));

// ── Health check ───────────────────────────────────────
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

// ── Wake up services (anti-sleep Render) ─────────────────
router.get("/wake-up", async (_req: Request, res: Response) => {
  const results = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, url]) => {
      const start = Date.now();

      try {
        const response = await fetch(`${url}/health`);
        const time = Date.now() - start;

        if (!response.ok) {
          return { name, status: "error", time };
        }

        return { name, status: "up", time };
      } catch (error) {
        const time = Date.now() - start;
        return { name, status: "down", time };
      }
    })
  );

  const formatted = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { name: "unknown", status: "down", time: 0 }
  );

  res.json({
    message: "Wake-up ejecutado 🚀",
    services: formatted
  });
});

export default router;