import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_TOKEN: z.string().min(10),
});
export const ENV = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map