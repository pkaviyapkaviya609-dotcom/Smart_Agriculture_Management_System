package com.example.smartagriculture.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "crop_requirements")
public class CropRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requirement_id")
    private Integer requirementId;

    @Column(name = "crop_id", nullable = false)
    private Integer cropId;

    @Column(name = "soil_type", nullable = false)
    private String soilType;

    @Column(name = "water_requirement", nullable = false)
    private String waterRequirement;

    @Column(name = "suitable_season", nullable = false)
    private String suitableSeason;

    @Column(name = "min_temperature", nullable = false)
    private Double minTemperature;

    @Column(name = "max_temperature", nullable = false)
    private Double maxTemperature;

    public Integer getRequirementId() {
        return requirementId;
    }

    public void setRequirementId(Integer requirementId) {
        this.requirementId = requirementId;
    }

    public Integer getCropId() {
        return cropId;
    }

    public void setCropId(Integer cropId) {
        this.cropId = cropId;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getWaterRequirement() {
        return waterRequirement;
    }

    public void setWaterRequirement(String waterRequirement) {
        this.waterRequirement = waterRequirement;
    }

    public String getSuitableSeason() {
        return suitableSeason;
    }

    public void setSuitableSeason(String suitableSeason) {
        this.suitableSeason = suitableSeason;
    }

    public Double getMinTemperature() {
        return minTemperature;
    }

    public void setMinTemperature(Double minTemperature) {
        this.minTemperature = minTemperature;
    }

    public Double getMaxTemperature() {
        return maxTemperature;
    }

    public void setMaxTemperature(Double maxTemperature) {
        this.maxTemperature = maxTemperature;
    }
}