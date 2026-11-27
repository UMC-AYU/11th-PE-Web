import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    // 7주차 try 안에 있던 성공 처리
    onSuccess: (response) => {
      alert(response.message);

      // 로그인 페이지가 연결되어 있어서 주석을 해제했어요.
      router.push("/login");
    },
    // 7주차 catch 안에 있던 실패 처리
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
