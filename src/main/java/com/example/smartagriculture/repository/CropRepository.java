package com.example.smartagriculture.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.Crop;

public interface CropRepository extends JpaRepository<Crop, Integer> {
}