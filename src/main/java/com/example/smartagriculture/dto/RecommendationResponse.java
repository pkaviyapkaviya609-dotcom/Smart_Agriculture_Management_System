package com.example.smartagriculture.dto;

import java.time.LocalDate;

public class RecommendationResponse {

    private Integer recommendationId;
    private Integer cropId;
    private String cropName;
    private Double suitabilityScore;
    private String recommendationStatus;
    private String recommendationReason;
    private LocalDate recommendationDate;

    public RecommendationResponse(
            Integer recommendationId,
            Integer cropId,
            String cropName,
            Double suitabilityScore,
            String recommendationStatus,
            String recommendationReason,
            LocalDate recommendationDate) {

        this.recommendationId = recommendationId;
        this.cropId = cropId;
        this.cropName = cropName;
        this.suitabilityScore = suitabilityScore;
        this.recommendationStatus = recommendationStatus;
        this.recommendationReason = recommendationReason;
        this.recommendationDate = recommendationDate;
    }

    public Integer getRecommendationId() {
        return recommendationId;
    }

    public Integer getCropId() {
        return cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public Double getSuitabilityScore() {
        return suitabilityScore;
    }

    public String getRecommendationStatus() {
        return recommendationStatus;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public LocalDate getRecommendationDate() {
        return recommendationDate;
    }
}