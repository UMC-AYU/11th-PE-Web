package org.umc.umc11thspring5week.controller;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.exception.ErrorCode;

import java.util.Locale;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleRequestValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("요청 값이 올바르지 않습니다.");

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON400", message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(
            ConstraintViolationException exception
    ) {
        String message = exception.getConstraintViolations().stream()
                .findFirst()
                .map(violation -> violation.getMessage())
                .orElse("요청 값이 올바르지 않습니다.");

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON400", message));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException exception
    ) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode.getCode(), errorCode.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {
        String detail = exception.getMostSpecificCause().getMessage().toLowerCase(Locale.ROOT);

        if (detail.contains("uk_member_email") || detail.contains("member.email")) {
            return conflict(ErrorCode.DUPLICATE_EMAIL);
        }
        if (detail.contains("uk_member_nickname") || detail.contains("member.nickname")) {
            return conflict(ErrorCode.DUPLICATE_NICKNAME);
        }
        if (detail.contains("uk_rating_member_movie") || detail.contains("rating.member_id")) {
            return conflict(ErrorCode.DUPLICATE_RATING);
        }
        return conflict(ErrorCode.DATA_CONFLICT);
    }

    private ResponseEntity<ApiResponse<Void>> conflict(ErrorCode errorCode) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(errorCode.getCode(), errorCode.getMessage()));
    }
}
