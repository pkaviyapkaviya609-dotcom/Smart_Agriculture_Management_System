package com.example.smartagriculture.service;


import org.springframework.stereotype.Service;

import com.example.smartagriculture.entity.Farm;
import com.example.smartagriculture.repository.FarmRepository;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository repository;

    public FarmService(FarmRepository repository) {
        this.repository = repository;
    }

    public List<Farm> getAll() {
        return repository.findAll();
    }

    public Farm getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farm not found"));
    }

    public Farm create(Farm farm) {
        return repository.save(farm);
    }

    public Farm update(Integer id, Farm farm) {

        Farm existing = getById(id);

        existing.setFarmName(farm.getFarmName());
        existing.setTotalArea(farm.getTotalArea());
        existing.setLocation(farm.getLocation());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}