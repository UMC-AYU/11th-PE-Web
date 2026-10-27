import ky from "ky";
import { env, getTmdbAccessToken } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set(
          "Authorization",
          `Bearer ${getTmdbAccessToken()}`,
        );
      },
    ],
  },
});
