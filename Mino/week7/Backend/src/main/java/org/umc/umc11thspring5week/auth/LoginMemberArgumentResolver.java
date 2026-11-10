package org.umc.umc11thspring5week.auth;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.umc.umc11thspring5week.exception.BusinessException;

import static org.umc.umc11thspring5week.auth.AuthInterceptor.MEMBER_ID;
import static org.umc.umc11thspring5week.exception.ErrorCode.MISSING_TOKEN;

public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(LoginMember.class)
                && parameter.getParameterType() == Long.class;
    }

    @Override
    public Long resolveArgument(MethodParameter parameter, ModelAndViewContainer container,
                                NativeWebRequest request, WebDataBinderFactory binderFactory) {
        if (request.getAttribute(MEMBER_ID, RequestAttributes.SCOPE_REQUEST) instanceof Long memberId) {
            return memberId;
        }
        throw new BusinessException(MISSING_TOKEN);
    }
}
