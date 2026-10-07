package com.example.smartagriculture.dto;


import java.time.LocalDate;

public class HarvestDetailsResponse {

    private Integer harvestId;
    private String farmName;
    private String cropName;
    private LocalDate harvestDate;
    private Double quantity;

    public HarvestDetailsResponse(
            Integer harvestId,
            String farmName,
            String cropName,
            LocalDate harvestDate,
            Double quantity) {

        this.harvestId = harvestId;
        this.farmName = farmName;
        this.cropName = cropName;
        this.harvestDate = harvestDate;
        this.quantity = quantity;
    }

    public Integer getHarvestId() {
        return harvestId;
    }

    public String getFarmName() {
        return farmName;
    }

    public String getCropName() {
        return cropName;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public Double getQuantity() {
        return quantity;
    }
}