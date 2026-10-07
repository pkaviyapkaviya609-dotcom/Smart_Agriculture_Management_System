package com.example.smartagriculture.service;



import org.springframework.stereotype.Service;

import com.example.smartagriculture.entity.CropPlanting;
import com.example.smartagriculture.repository.CropPlantingRepository;

import java.util.List;

@Service
public class CropPlantingService {

    private final CropPlantingRepository repository;

    public CropPlantingService(
            CropPlantingRepository repository) {

        this.repository = repository;
    }

    public List<CropPlanting> getAll() {
        return repository.findAll();
    }

    public List<CropPlanting> getByFarm(Integer farmId) {
        return repository.findByFarmId(farmId);
    }

    public CropPlanting getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Planting not found"));
    }

    public CropPlanting create(CropPlanting planting) {
        return repository.save(planting);
    }

    public CropPlanting update(
            Integer id,
            CropPlanting planting) {

        CropPlanting existing = getById(id);

        existing.setFarmId(planting.getFarmId());
        existing.setCropId(planting.getCropId());
        existing.setPlantingDate(planting.getPlantingDate());
        existing.setStatus(planting.getStatus());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}