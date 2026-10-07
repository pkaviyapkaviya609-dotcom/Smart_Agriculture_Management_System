package com.example.smartagriculture.controller;



import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.entity.CropRequirement;
import com.example.smartagriculture.service.CropRequirementService;

import java.util.List;

@RestController
@RequestMapping("/api/crop-requirements")
@CrossOrigin(origins = "*")
public class CropRequirementController {

    private final CropRequirementService service;

    public CropRequirementController(
            CropRequirementService service) {

        this.service = service;
    }

    @GetMapping
    public List<CropRequirement> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CropRequirement getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public CropRequirement create(
            @RequestBody CropRequirement requirement) {

        return service.create(requirement);
    }

    @PutMapping("/{id}")
    public CropRequirement update(
            @PathVariable Integer id,
            @RequestBody CropRequirement requirement) {

        return service.update(id, requirement);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Crop requirement deleted successfully";
    }
}