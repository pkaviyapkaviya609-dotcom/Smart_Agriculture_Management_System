package com.example.smartagriculture.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smartagriculture.dto.RecommendationResponse;
import com.example.smartagriculture.entity.CropRecommendation;
import com.example.smartagriculture.entity.CropRequirement;
import com.example.smartagriculture.entity.FarmCondition;
import com.example.smartagriculture.repository.CropRecommendationRepository;
import com.example.smartagriculture.repository.CropRepository;
import com.example.smartagriculture.repository.CropRequirementRepository;
import com.example.smartagriculture.repository.FarmConditionRepository;
import com.example.smartagriculture.repository.FarmRepository;
import com.example.smartagriculture.repository.HarvestRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final FarmRepository farmRepository;
    private final FarmConditionRepository conditionRepository;
    private final CropRepository cropRepository;
    private final CropRequirementRepository requirementRepository;
    private final HarvestRepository harvestRepository;
    private final CropRecommendationRepository recommendationRepository;
    private final JdbcTemplate jdbcTemplate;

    public RecommendationService(
            FarmRepository farmRepository,
            FarmConditionRepository conditionRepository,
            CropRepository cropRepository,
            CropRequirementRepository requirementRepository,
            HarvestRepository harvestRepository,
            CropRecommendationRepository recommendationRepository,
            JdbcTemplate jdbcTemplate) {

        this.farmRepository = farmRepository;
        this.conditionRepository = conditionRepository;
        this.cropRepository = cropRepository;
        this.requirementRepository = requirementRepository;
        this.harvestRepository = harvestRepository;
        this.recommendationRepository = recommendationRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public List<RecommendationResponse> generateRecommendations(Integer farmId) {

        // The user only enters Farm + Crop in the UI.
        // Supporting data is created automatically when it is missing.
        ensureFarmCondition(farmId);
        ensureCropRequirements();

        // Check whether farm exists
        if (!farmRepository.existsById(farmId)) {
            throw new RuntimeException("Farm not found");
        }

        // Get farm conditions
        FarmCondition condition =
                conditionRepository.findByFarmId(farmId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Farm conditions not found for this farm"));

        // Get all crop requirements
        List<CropRequirement> requirements =
                requirementRepository.findAll();

        // Get average harvest of this farm
        Double farmAverage =
                harvestRepository.findAverageHarvestForFarm(farmId);

        if (farmAverage == null) {
            farmAverage = 0.0;
        }

        List<RecommendationResponse> results =
                new ArrayList<>();

        // Check every crop
        for (CropRequirement requirement : requirements) {

            double score = 0.0;

            List<String> reasons = new ArrayList<>();

            // -------------------------------------------------
            // 1. SOIL COMPATIBILITY = 30 POINTS
            // -------------------------------------------------
            if (condition.getSoilType() != null
                    && requirement.getSoilType() != null
                    && condition.getSoilType()
                            .equalsIgnoreCase(
                                    requirement.getSoilType())) {

                score += 30;

                reasons.add(
                        "Soil type matches (+30)");

            } else {

                reasons.add(
                        "Soil type does not match");
            }

            // -------------------------------------------------
            // 2. WATER COMPATIBILITY = 20 POINTS
            // -------------------------------------------------
            if (waterCompatible(
                    condition.getWaterAvailability(),
                    requirement.getWaterRequirement())) {

                score += 20;

                reasons.add(
                        "Water availability meets crop requirement (+20)");

            } else {

                reasons.add(
                        "Water availability is not sufficient");
            }

            // -------------------------------------------------
            // 3. SEASON COMPATIBILITY = 20 POINTS
            // -------------------------------------------------
            if (condition.getSeason() != null
                    && requirement.getSuitableSeason() != null
                    && condition.getSeason()
                            .equalsIgnoreCase(
                                    requirement.getSuitableSeason())) {

                score += 20;

                reasons.add(
                        "Season is suitable (+20)");

            } else {

                reasons.add(
                        "Season is not suitable");
            }

            // -------------------------------------------------
            // 4. TEMPERATURE COMPATIBILITY = 15 POINTS
            // -------------------------------------------------
            Double temperature =
                    condition.getTemperature();

            if (temperature != null
                    && requirement.getMinTemperature() != null
                    && requirement.getMaxTemperature() != null
                    && temperature >=
                            requirement.getMinTemperature()
                    && temperature <=
                            requirement.getMaxTemperature()) {

                score += 15;

                reasons.add(
                        "Temperature is within suitable range (+15)");

            } else {

                reasons.add(
                        "Temperature is outside the required range");
            }

            // -------------------------------------------------
            // 5. PREVIOUS HARVEST PERFORMANCE = 15 POINTS
            // -------------------------------------------------
            Double cropAverage =
                    harvestRepository
                            .findAverageHarvestForFarmAndCrop(
                                    farmId,
                                    requirement.getCropId());

            if (cropAverage == null) {
                cropAverage = 0.0;
            }

            if (farmAverage > 0 && cropAverage > 0) {

                if (cropAverage >= farmAverage) {

                    score += 15;

                    reasons.add(
                            "Previous harvest performance is above or equal to farm average (+15)");

                } else {

                    reasons.add(
                            "Previous harvest performance is below farm average");
                }

            } else {

                reasons.add(
                        "No previous harvest data available");
            }

            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------
            String status = getStatus(score);

            // -------------------------------------------------
            // CROP NAME
            // -------------------------------------------------
            String cropName =
                    cropRepository
                            .findById(requirement.getCropId())
                            .map(crop -> crop.getCropName())
                            .orElse("Unknown Crop");

            // -------------------------------------------------
            // CREATE RECOMMENDATION
            // -------------------------------------------------
            CropRecommendation recommendation =
                    new CropRecommendation();

            recommendation.setFarmId(farmId);

            recommendation.setCropId(
                    requirement.getCropId());

            recommendation.setSuitabilityScore(score);

            recommendation.setRecommendationStatus(
                    status);

            recommendation.setRecommendationReason(
                    String.join(". ", reasons));

            recommendation.setRecommendationDate(
                    LocalDate.now());

            // Save recommendation
            CropRecommendation saved =
                    recommendationRepository.save(
                            recommendation);

            // Add response
            results.add(
                    new RecommendationResponse(
                            saved.getRecommendationId(),
                            saved.getCropId(),
                            cropName,
                            saved.getSuitabilityScore(),
                            saved.getRecommendationStatus(),
                            saved.getRecommendationReason(),
                            saved.getRecommendationDate()
                    )
            );
        }

        // Sort highest score first
        results.sort(
                Comparator.comparing(
                        RecommendationResponse::getSuitabilityScore)
                        .reversed()
        );

        // Return top 3 crops
        return results.stream()
                .limit(3)
                .toList();
    }

    // -------------------------------------------------
    // AUTOMATIC FARM CONDITIONS
    // -------------------------------------------------
    private void ensureFarmCondition(Integer farmId) {

        if (farmId == null || !farmRepository.existsById(farmId)) {
            return;
        }

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM farm_conditions WHERE farm_id = ?",
                Integer.class,
                farmId);

        if (count != null && count > 0) {
            return;
        }

        // Default values are used because the UI intentionally asks
        // the user for only the Farm name, area and location.
        // These values allow every newly added farm to participate
        // in the recommendation engine immediately.
        jdbcTemplate.update(
                "INSERT INTO farm_conditions "
                        + "(farm_id, soil_type, water_availability, season, temperature, rainfall) "
                        + "VALUES (?, ?, ?, ?, ?, ?)",
                farmId,
                "Loamy",
                "High",
                "Kharif",
                28.0,
                800.0);
    }

    // -------------------------------------------------
    // AUTOMATIC CROP REQUIREMENTS
    // -------------------------------------------------
    private void ensureCropRequirements() {

        List<CropRow> crops = jdbcTemplate.query(
                "SELECT crop_id, crop_name FROM crop",
                (rs, rowNum) ->
                        new CropRow(
                                rs.getInt("crop_id"),
                                rs.getString("crop_name")));

        for (CropRow crop : crops) {

            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM crop_requirements WHERE crop_id = ?",
                    Integer.class,
                    crop.cropId());

            if (count != null && count > 0) {
                continue;
            }

            RequirementDefaults defaults =
                    getRequirementDefaults(crop.cropName());

            jdbcTemplate.update(
                    "INSERT INTO crop_requirements "
                            + "(crop_id, soil_type, water_requirement, suitable_season, min_temperature, max_temperature) "
                            + "VALUES (?, ?, ?, ?, ?, ?)",
                    crop.cropId(),
                    defaults.soilType(),
                    defaults.waterRequirement(),
                    defaults.suitableSeason(),
                    defaults.minTemperature(),
                    defaults.maxTemperature());
        }
    }

    // -------------------------------------------------
    // DEFAULT CROP RULES
    // -------------------------------------------------
    private RequirementDefaults getRequirementDefaults(String cropName) {

        String name = cropName == null
                ? ""
                : cropName.trim().toLowerCase();

        return switch (name) {
            case "rice" ->
                    new RequirementDefaults("Loamy", "High", "Kharif", 25.0, 35.0);

            case "wheat" ->
                    new RequirementDefaults("Loamy", "Medium", "Rabi", 15.0, 25.0);

            case "maize" ->
                    new RequirementDefaults("Loamy", "Medium", "Kharif", 21.0, 30.0);

            case "tomato" ->
                    new RequirementDefaults("Sandy", "Medium", "Kharif", 20.0, 30.0);

            case "groundnut" ->
                    new RequirementDefaults("Sandy", "Low", "Kharif", 20.0, 30.0);

            case "potato" ->
                    new RequirementDefaults("Loamy", "Medium", "Rabi", 15.0, 25.0);

            case "cotton" ->
                    new RequirementDefaults("Loamy", "Medium", "Kharif", 21.0, 35.0);

            default ->
                    new RequirementDefaults("Loamy", "Medium", "Kharif", 20.0, 35.0);
        };
    }

    private record CropRow(Integer cropId, String cropName) {
    }

    private record RequirementDefaults(
            String soilType,
            String waterRequirement,
            String suitableSeason,
            Double minTemperature,
            Double maxTemperature) {
    }

    // -------------------------------------------------
    // GET SAVED RECOMMENDATIONS
    // -------------------------------------------------
    public List<RecommendationResponse> getRecommendations(
            Integer farmId) {

        List<CropRecommendation> recommendations =
                recommendationRepository
                        .findByFarmIdOrderBySuitabilityScoreDesc(
                                farmId);

        return recommendations.stream()
                .map(recommendation -> {

                    String cropName =
                            cropRepository
                                    .findById(
                                            recommendation.getCropId())
                                    .map(crop ->
                                            crop.getCropName())
                                    .orElse("Unknown Crop");

                    return new RecommendationResponse(
                            recommendation.getRecommendationId(),
                            recommendation.getCropId(),
                            cropName,
                            recommendation.getSuitabilityScore(),
                            recommendation.getRecommendationStatus(),
                            recommendation.getRecommendationReason(),
                            recommendation.getRecommendationDate()
                    );
                })
                .toList();
    }

    // -------------------------------------------------
    // WATER COMPATIBILITY
    // -------------------------------------------------
    private boolean waterCompatible(
            String available,
            String required) {

        return waterLevel(available)
                >= waterLevel(required);
    }

    // -------------------------------------------------
    // WATER LEVEL
    // -------------------------------------------------
    private int waterLevel(String value) {

        if (value == null) {
            return 0;
        }

        return switch (value.toUpperCase()) {
            case "HIGH" -> 3;
            case "MEDIUM" -> 2;
            case "LOW" -> 1;
            default -> 0;
        };
    }

    // -------------------------------------------------
    // SCORE STATUS
    // -------------------------------------------------
    private String getStatus(double score) {

        if (score >= 80) {
            return "HIGHLY SUITABLE";
        }

        if (score >= 60) {
            return "SUITABLE";
        }

        if (score >= 40) {
            return "MODERATE";
        }

        return "NOT RECOMMENDED";
    }
}
