package com.example.smartagriculture.service;

import org.springframework.stereotype.Service;

import com.example.smartagriculture.entity.CropRequirement;
import com.example.smartagriculture.repository.CropRequirementRepository;

import java.util.List;

@Service
public class CropRequirementService {

    private final CropRequirementRepository repository;

    public CropRequirementService(
            CropRequirementRepository repository) {

        this.repository = repository;
    }

    public List<CropRequirement> getAll() {
        return repository.findAll();
    }

    public CropRequirement getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Crop requirement not found"));
    }

    public CropRequirement create(CropRequirement requirement) {
        return repository.save(requirement);
    }

    public CropRequirement update(
            Integer id,
            CropRequirement requirement) {

        CropRequirement existing = getById(id);

        existing.setCropId(requirement.getCropId());
        existing.setSoilType(requirement.getSoilType());
        existing.setWaterRequirement(
                requirement.getWaterRequirement());
        existing.setSuitableSeason(
                requirement.getSuitableSeason());
        existing.setMinTemperature(
                requirement.getMinTemperature());
        existing.setMaxTemperature(
                requirement.getMaxTemperature());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}