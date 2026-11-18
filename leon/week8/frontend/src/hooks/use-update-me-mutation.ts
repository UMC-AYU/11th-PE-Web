import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";

export function useUpdateMeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMe,
        onSuccess: ({ result }) => {
            queryClient.setQueryData<MemberInfo>(["members", "me"], result);
        },
    });
}
