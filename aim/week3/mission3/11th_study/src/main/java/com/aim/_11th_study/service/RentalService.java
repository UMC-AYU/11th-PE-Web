package com.aim._11th_study.service;

import com.aim._11th_study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor

public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body){
        rentalRepository.save((body));
    }
}
