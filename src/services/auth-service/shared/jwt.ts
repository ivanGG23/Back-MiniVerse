import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(
    path.join(__dirname, "keys/private.key"),
    "utf8"
);
const publicKey = fs.readFileSync(
    path.join(__dirname, "keys/public.key"),
    "utf8"
);

export function generateToken(payload: object): string {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): object {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as object;
}
