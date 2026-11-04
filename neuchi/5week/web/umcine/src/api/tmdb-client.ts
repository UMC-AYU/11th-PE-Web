import ky from "ky";
import { env } from "../config/env";

export const tmdbClient = ky.create({
  prefix: env.tmdbApiBaseUrl,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
