package com.example.smartagriculture.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.CropRequirement;

public interface CropRequirementRepository
        extends JpaRepository<CropRequirement, Integer> {
}