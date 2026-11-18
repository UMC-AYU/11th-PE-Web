import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
    hooks: {
        beforeRequest: [({ request }) => {
            const token = useAuthStore.getState().accessToken;
            if (token) request.headers.set("Authorization", `Bearer ${token}`);
        }],
        afterResponse: [({ response }) => {
            if (response.status === 401) useAuthStore.getState().clearSession();
        }],
    },
});
