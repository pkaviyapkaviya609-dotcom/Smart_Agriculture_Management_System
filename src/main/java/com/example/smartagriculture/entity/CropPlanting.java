package com.example.smartagriculture.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "crop_planting")
public class CropPlanting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "planting_id")
    private Integer plantingId;

    @Column(name = "farm_id", nullable = false)
    private Integer farmId;

    @Column(name = "crop_id", nullable = false)
    private Integer cropId;

    @Column(name = "planting_date", nullable = false)
    private LocalDate plantingDate;

    @Column(nullable = false)
    private String status;

    public Integer getPlantingId() {
        return plantingId;
    }

    public void setPlantingId(Integer plantingId) {
        this.plantingId = plantingId;
    }

    public Integer getFarmId() {
        return farmId;
    }

    public void setFarmId(Integer farmId) {
        this.farmId = farmId;
    }

    public Integer getCropId() {
        return cropId;
    }

    public void setCropId(Integer cropId) {
        this.cropId = cropId;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}