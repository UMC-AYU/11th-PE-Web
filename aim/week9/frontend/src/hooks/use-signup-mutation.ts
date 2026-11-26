import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup, //기존 API 함수를 등록
    onSuccess: (response) => {
      alert(response.message);
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}