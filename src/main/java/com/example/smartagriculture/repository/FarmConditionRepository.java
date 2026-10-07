package com.example.smartagriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartagriculture.entity.FarmCondition;

import java.util.Optional;

public interface FarmConditionRepository
        extends JpaRepository<FarmCondition, Integer> {

    Optional<FarmCondition> findByFarmId(Integer farmId);
}