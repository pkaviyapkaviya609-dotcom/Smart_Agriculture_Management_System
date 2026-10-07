package com.example.smartagriculture.controller;



import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.dto.RecommendationResponse;
import com.example.smartagriculture.service.RecommendationService;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(
            RecommendationService service) {

        this.service = service;
    }

    @PostMapping("/generate/{farmId}")
    public List<RecommendationResponse> generate(
            @PathVariable Integer farmId) {

        return service.generateRecommendations(farmId);
    }

    @GetMapping("/farm/{farmId}")
    public List<RecommendationResponse> getByFarm(
            @PathVariable Integer farmId) {

        return service.getRecommendations(farmId);
    }
}
