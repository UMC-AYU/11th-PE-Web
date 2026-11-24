import { useMutation } from "@tanstack/react-query";
import { signupMutationOptions } from "../api/auth/auth-mutations";

export function useSignupMutation() {
  return useMutation(signupMutationOptions());
}
