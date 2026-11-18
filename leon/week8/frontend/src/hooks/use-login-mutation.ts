import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { memberIdFromToken, useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: login,
        onSuccess: async ({ result }) => {
            setSession(result.accessToken, result.memberId ?? memberIdFromToken(result.accessToken));
            queryClient.removeQueries({ queryKey: ["members"] });
            queryClient.removeQueries({ queryKey: ["favorites"] });
            queryClient.removeQueries({ queryKey: ["ratings"] });
            await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
            await navigate({ to: "/", search: { page: 1 } });
        },
    });
}
