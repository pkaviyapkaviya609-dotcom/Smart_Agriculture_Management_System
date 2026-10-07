package com.example.smartagriculture.service;



import org.springframework.stereotype.Service;

import com.example.smartagriculture.entity.Crop;
import com.example.smartagriculture.repository.CropRepository;

import java.util.List;

@Service
public class CropService {

    private final CropRepository repository;

    public CropService(CropRepository repository) {
        this.repository = repository;
    }

    public List<Crop> getAll() {
        return repository.findAll();
    }

    public Crop getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Crop not found"));
    }

    public Crop create(Crop crop) {
        return repository.save(crop);
    }

    public Crop update(Integer id, Crop crop) {

        Crop existing = getById(id);

        existing.setCropName(crop.getCropName());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}