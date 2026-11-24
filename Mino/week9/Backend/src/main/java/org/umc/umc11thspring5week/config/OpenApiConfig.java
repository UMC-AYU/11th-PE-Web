package org.umc.umc11thspring5week.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.umc.umc11thspring5week.auth.LoginMember;
import org.umc.umc11thspring5week.exception.ErrorCode;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI movieApi() {
        return new OpenAPI()
                .info(new Info().title("영화 평점 서비스 API").version("v1")
                        .description("내 정보, 평점 쓰기, 즐겨찾기와 영화 기록은 Authorization: Bearer {token}이 필요합니다. "
                                + "로그인, 회원가입, 중복 확인, 회원 평점 목록은 공개 API입니다."))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT"))
                        .addResponses("AuthenticationRequired", authenticationErrors())
                        .addResponses("InvalidCredentials", failure(ErrorCode.INVALID_CREDENTIALS))
                        .addResponses("SignUpConflict", new ApiResponse()
                                .description("409 · MEMBER4091 이메일 중복 / MEMBER4092 닉네임 중복")
                                .content(new Content().addMediaType("application/json", new MediaType()
                                        .addExamples("MEMBER4091", errorExample(ErrorCode.DUPLICATE_EMAIL))
                                        .addExamples("MEMBER4092", errorExample(ErrorCode.DUPLICATE_NICKNAME)))))
                        .addResponses("InvalidInput", new ApiResponse()
                                .description("400 · COMMON400 · 요청 값 검증 실패")
                                .content(jsonExample("COMMON400", "요청 값이 올바르지 않습니다.")))
                        .addResponses("MemberNotFound", failure(ErrorCode.PROFILE_NOT_FOUND))
                        .addResponses("PublicMemberNotFound", failure(ErrorCode.MEMBER_NOT_FOUND))
                        .addResponses("ProfileNicknameConflict", failure(ErrorCode.PROFILE_NICKNAME_CONFLICT))
                        .addResponses("RatingConflict", failure(ErrorCode.DUPLICATE_RATING))
                        .addResponses("RatingForbidden", failure(ErrorCode.RATING_FORBIDDEN))
                        .addResponses("RatingNotFound", failure(ErrorCode.RATING_NOT_FOUND))
                        .addResponses("FavoriteNotFound", failure(ErrorCode.FAVORITE_NOT_FOUND))
                        .addResponses("FavoriteConflict", failure(ErrorCode.DUPLICATE_FAVORITE))
                        .addResponses("MovieRecordConflict", new ApiResponse()
                                .description("409 · RATING409_1 또는 FAVORITE409_1 · 중복 요청은 전체 취소")
                                .content(new Content().addMediaType("application/json", new MediaType()
                                        .addExamples("RATING409_1", errorExample(ErrorCode.DUPLICATE_RATING))
                                        .addExamples("FAVORITE409_1", errorExample(ErrorCode.DUPLICATE_FAVORITE))))));
    }

    @Bean
    public OperationCustomizer loginMemberSecurity() {
        return (operation, handlerMethod) -> {
            boolean requiresLogin = Arrays.stream(handlerMethod.getMethodParameters())
                    .anyMatch(parameter -> parameter.hasParameterAnnotation(LoginMember.class));
            operation.setSecurity(requiresLogin
                    ? List.of(new SecurityRequirement().addList("bearerAuth"))
                    : List.of());
            if (requiresLogin) {
                operation.getResponses().putIfAbsent("401",
                        new ApiResponse().$ref("#/components/responses/AuthenticationRequired"));
            }
            String description = operation.getDescription() == null ? "" : operation.getDescription();
            operation.setDescription(description + "\n\n" + (requiresLogin
                    ? "토큰 필요 · Authorization: Bearer {token}"
                    : "공개 API · 토큰 불필요"));
            return operation;
        };
    }

    private ApiResponse authenticationErrors() {
        return new ApiResponse()
                .description("401 · AUTH401_2 토큰 누락 / AUTH401_3 토큰 위조·형식 오류 / AUTH401_4 토큰 만료")
                .content(new Content().addMediaType("application/json", new MediaType()
                        .addExamples("AUTH401_2", errorExample(ErrorCode.MISSING_TOKEN))
                        .addExamples("AUTH401_3", errorExample(ErrorCode.INVALID_TOKEN))
                        .addExamples("AUTH401_4", errorExample(ErrorCode.EXPIRED_TOKEN))));
    }

    private ApiResponse failure(ErrorCode error) {
        return new ApiResponse()
                .description(error.getStatus().value() + " · " + error.getCode() + " · " + error.getMessage())
                .content(jsonExample(error.getCode(), error.getMessage()));
    }

    private Content jsonExample(String code, String message) {
        return new Content().addMediaType("application/json", new MediaType()
                .example(errorBody(code, message)));
    }

    private Example errorExample(ErrorCode error) {
        return new Example().value(errorBody(error.getCode(), error.getMessage()));
    }

    private Map<String, Object> errorBody(String code, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("isSuccess", false);
        body.put("code", code);
        body.put("message", message);
        body.put("result", null);
        return body;
    }
}
