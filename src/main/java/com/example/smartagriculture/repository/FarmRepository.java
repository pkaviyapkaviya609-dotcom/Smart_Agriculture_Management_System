package com.example.smartagriculture.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.Farm;

public interface FarmRepository extends JpaRepository<Farm, Integer> {
}