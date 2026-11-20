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
                .info(new Info().title("UMC 영화 API · 8주차").version("8")
                        .description("즐겨찾기와 영화 기록은 Authorization: Bearer {token}이 필요합니다. "
                                + "로그인, 회원가입, 중복 확인, 회원 평점 목록은 공개 API입니다."))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT"))
                        .addResponses("AuthenticationRequired", authenticationErrors())
                        .addResponses("InvalidInput", new ApiResponse()
                                .description("400 · COMMON400 · 요청 값 검증 실패")
                                .content(jsonExample("COMMON400", "요청 값이 올바르지 않습니다.")))
                        .addResponses("MemberNotFound", failure(ErrorCode.PROFILE_NOT_FOUND))
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
