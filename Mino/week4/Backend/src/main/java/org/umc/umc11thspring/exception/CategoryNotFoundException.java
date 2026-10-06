package org.umc.umc11thspring.exception;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long categoryId) {
        super("카테고리를 찾을 수 없습니다. categoryId=" + categoryId);
    }
}
