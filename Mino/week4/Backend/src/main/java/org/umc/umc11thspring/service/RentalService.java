package org.umc.umc11thspring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.umc.umc11thspring.repository.RentalRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Map<String, Object> createRental(Map<String, Object> body) {
        Long userId = getRequiredLong(body, "userId");
        Long bookId = getRequiredLong(body, "bookId");

        Long rentalId = rentalRepository.save(userId, bookId);
        return rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "생성된 대여 기록을 조회할 수 없습니다."
                ));
    }

    public Map<String, Object> returnRental(Long rentalId) {
        int updatedRowCount = rentalRepository.returnBook(rentalId);
        if (updatedRowCount == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 기록을 찾을 수 없습니다.");
        }

        return rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "반납 처리된 대여 기록을 조회할 수 없습니다."
                ));
    }

    private Long getRequiredLong(Map<String, Object> body, String fieldName) {
        Object value = body.get(fieldName);
        if (!(value instanceof Number number)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + "는 필수 숫자 값입니다."
            );
        }
        return number.longValue();
    }
}
