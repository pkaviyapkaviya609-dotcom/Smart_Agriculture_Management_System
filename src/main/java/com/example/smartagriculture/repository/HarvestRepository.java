package com.example.smartagriculture.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.smartagriculture.entity.Harvest;

import java.util.List;

public interface HarvestRepository
        extends JpaRepository<Harvest, Integer> {

    List<Harvest> findByPlantingId(Integer plantingId);

    @Query(value = """
            SELECT COALESCE(AVG(h.quantity), 0)
            FROM harvest h
            JOIN crop_planting cp
            ON h.planting_id = cp.planting_id
            WHERE cp.farm_id = :farmId
            """,
            nativeQuery = true)
    Double findAverageHarvestForFarm(
            @Param("farmId") Integer farmId);

    @Query(value = """
            SELECT COALESCE(AVG(h.quantity), 0)
            FROM harvest h
            JOIN crop_planting cp
            ON h.planting_id = cp.planting_id
            WHERE cp.farm_id = :farmId
            AND cp.crop_id = :cropId
            """,
            nativeQuery = true)
    Double findAverageHarvestForFarmAndCrop(
            @Param("farmId") Integer farmId,
            @Param("cropId") Integer cropId);

    @Query(value = """
            SELECT h.*
            FROM harvest h
            WHERE h.quantity >
                  (SELECT AVG(quantity) FROM harvest)
            """,
            nativeQuery = true)
    List<Harvest> findAboveAverageHarvests();

    @Query(value = """
            SELECT
                h.harvest_id,
                f.farm_name,
                c.crop_name,
                h.harvest_date,
                h.quantity
            FROM harvest h
            JOIN crop_planting cp
                ON h.planting_id = cp.planting_id
            JOIN farm f
                ON cp.farm_id = f.farm_id
            JOIN crop c
                ON cp.crop_id = c.crop_id
            ORDER BY h.harvest_id
            """,
            nativeQuery = true)
    List<Object[]> findHarvestDetails();
}