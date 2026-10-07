package com.example.smartagriculture.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.CropRecommendation;

import java.util.List;

public interface CropRecommendationRepository
        extends JpaRepository<CropRecommendation, Integer> {

    List<CropRecommendation>
    findByFarmIdOrderBySuitabilityScoreDesc(Integer farmId);
}