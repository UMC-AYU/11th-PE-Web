package org.umc.umc11thspring.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.umc.umc11thspring.service.RentalService;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRental(@RequestBody Map<String, Object> body) {
        return rentalService.createRental(body);
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnRental(@PathVariable Long rentalId) {
        return rentalService.returnRental(rentalId);
    }
}
