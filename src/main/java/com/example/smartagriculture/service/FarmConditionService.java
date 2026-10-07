package com.example.smartagriculture.service;

import org.springframework.stereotype.Service;

import com.example.smartagriculture.entity.FarmCondition;
import com.example.smartagriculture.repository.FarmConditionRepository;

import java.util.List;

@Service
public class FarmConditionService {

    private final FarmConditionRepository repository;

    public FarmConditionService(FarmConditionRepository repository) {
        this.repository = repository;
    }

    public List<FarmCondition> getAll() {
        return repository.findAll();
    }

    public FarmCondition getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Farm condition not found"));
    }

    public FarmCondition create(FarmCondition condition) {
        return repository.save(condition);
    }

    public FarmCondition update(
            Integer id,
            FarmCondition condition) {

        FarmCondition existing = getById(id);

        existing.setFarmId(condition.getFarmId());
        existing.setSoilType(condition.getSoilType());
        existing.setWaterAvailability(
                condition.getWaterAvailability());
        existing.setSeason(condition.getSeason());
        existing.setTemperature(condition.getTemperature());
        existing.setRainfall(condition.getRainfall());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}