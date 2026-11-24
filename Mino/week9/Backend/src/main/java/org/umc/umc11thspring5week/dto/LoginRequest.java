package org.umc.umc11thspring5week.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Schema(example = "challenger@umc.com")
        String email,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Schema(description = "가입할 때 입력한 비밀번호", example = "Umc!1234")
        String password
) {
}
