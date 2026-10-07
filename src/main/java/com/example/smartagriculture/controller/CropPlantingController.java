package com.example.smartagriculture.controller;



import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.entity.CropPlanting;
import com.example.smartagriculture.service.CropPlantingService;

import java.util.List;

@RestController
@RequestMapping("/api/crop-plantings")
@CrossOrigin(origins = "*")
public class CropPlantingController {

    private final CropPlantingService service;

    public CropPlantingController(
            CropPlantingService service) {

        this.service = service;
    }

    @GetMapping
    public List<CropPlanting> getAll() {
        return service.getAll();
    }

    @GetMapping("/farm/{farmId}")
    public List<CropPlanting> getByFarm(
            @PathVariable Integer farmId) {

        return service.getByFarm(farmId);
    }

    @GetMapping("/{id}")
    public CropPlanting getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public CropPlanting create(
            @RequestBody CropPlanting planting) {

        return service.create(planting);
    }

    @PutMapping("/{id}")
    public CropPlanting update(
            @PathVariable Integer id,
            @RequestBody CropPlanting planting) {

        return service.update(id, planting);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Crop planting deleted successfully";
    }
}