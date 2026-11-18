import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

export function authApi(token: string) {
  return apiClient.extend({
    headers: { Authorization: `Bearer ${token}` },
    hooks: {
      afterResponse: [
        ({ response }) => {
          const session = useAuthStore.getState();
          if (response.status === 401 && session.accessToken === token) {
            session.setAccessToken(null);
          }
        },
      ],
    },
  });
}
