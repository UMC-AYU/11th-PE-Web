import { mutationOptions } from "@tanstack/react-query";
import { signup } from "../members/signup";
import { updateMe } from "../members/me";
import { login } from "./login";

export const signupMutationOptions = () => mutationOptions({
  mutationKey: ["auth", "signup"],
  mutationFn: signup,
});

export const loginMutationOptions = () => mutationOptions({
  mutationKey: ["auth", "login"],
  mutationFn: login,
});

export const updateMeMutationOptions = () => mutationOptions({
  mutationKey: ["members", "updateMe"],
  mutationFn: updateMe,
});
