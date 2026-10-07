package com.example.smartagriculture.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.CropPlanting;

import java.util.List;

public interface CropPlantingRepository
        extends JpaRepository<CropPlanting, Integer> {

    List<CropPlanting> findByFarmId(Integer farmId);
}
