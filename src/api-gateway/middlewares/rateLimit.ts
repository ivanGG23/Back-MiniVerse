import rateLimit from "express-rate-limit";

// Límite general: 100 requests por 15 minutos
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas solicitudes, intenta de nuevo más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite estricto para auth: 10 requests por 15 minutos
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de autenticación, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});
