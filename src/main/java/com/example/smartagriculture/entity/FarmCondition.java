package com.example.smartagriculture.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "farm_conditions")
public class FarmCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition_id")
    private Integer conditionId;

    @Column(name = "farm_id", nullable = false)
    private Integer farmId;

    @Column(name = "soil_type", nullable = false)
    private String soilType;

    @Column(name = "water_availability", nullable = false)
    private String waterAvailability;

    @Column(name = "season", nullable = false)
    private String season;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Double rainfall;

    public Integer getConditionId() {
        return conditionId;
    }

    public void setConditionId(Integer conditionId) {
        this.conditionId = conditionId;
    }

    public Integer getFarmId() {
        return farmId;
    }

    public void setFarmId(Integer farmId) {
        this.farmId = farmId;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getWaterAvailability() {
        return waterAvailability;
    }

    public void setWaterAvailability(String waterAvailability) {
        this.waterAvailability = waterAvailability;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getRainfall() {
        return rainfall;
    }

    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }
}