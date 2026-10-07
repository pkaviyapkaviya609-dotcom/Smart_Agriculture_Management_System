package com.example.smartagriculture.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "crop_recommendation")
public class CropRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Integer recommendationId;

    @Column(name = "farm_id", nullable = false)
    private Integer farmId;

    @Column(name = "crop_id", nullable = false)
    private Integer cropId;

    @Column(name = "suitability_score", nullable = false)
    private Double suitabilityScore;

    @Column(name = "recommendation_status", nullable = false)
    private String recommendationStatus;

    @Column(name = "recommendation_reason")
    private String recommendationReason;

    @Column(name = "recommendation_date", nullable = false)
    private LocalDate recommendationDate;

    // recommendationId
    public Integer getRecommendationId() {
        return recommendationId;
    }

    public void setRecommendationId(Integer recommendationId) {
        this.recommendationId = recommendationId;
    }

    // farmId
    public Integer getFarmId() {
        return farmId;
    }

    public void setFarmId(Integer farmId) {
        this.farmId = farmId;
    }

    // cropId
    public Integer getCropId() {
        return cropId;
    }

    public void setCropId(Integer cropId) {
        this.cropId = cropId;
    }

    // suitabilityScore
    public Double getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(Double suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
    }

    // recommendationStatus
    public String getRecommendationStatus() {
        return recommendationStatus;
    }

    public void setRecommendationStatus(
            String recommendationStatus) {

        this.recommendationStatus = recommendationStatus;
    }

    // recommendationReason
    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(
            String recommendationReason) {

        this.recommendationReason = recommendationReason;
    }

    // recommendationDate
    public LocalDate getRecommendationDate() {
        return recommendationDate;
    }

    public void setRecommendationDate(
            LocalDate recommendationDate) {

        this.recommendationDate = recommendationDate;
    }
}