package com.example.smartagriculture.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "harvest")
public class Harvest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "harvest_id")
    private Integer harvestId;

    @Column(name = "planting_id", nullable = false)
    private Integer plantingId;

    @Column(name = "harvest_date", nullable = false)
    private LocalDate harvestDate;

    @Column(nullable = false)
    private Double quantity;

    public Integer getHarvestId() {
        return harvestId;
    }

    public void setHarvestId(Integer harvestId) {
        this.harvestId = harvestId;
    }

    public Integer getPlantingId() {
        return plantingId;
    }

    public void setPlantingId(Integer plantingId) {
        this.plantingId = plantingId;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
}