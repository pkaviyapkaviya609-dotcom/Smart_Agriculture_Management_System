package com.example.smartagriculture.controller;



import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.dto.HarvestDetailsResponse;
import com.example.smartagriculture.entity.Harvest;
import com.example.smartagriculture.service.HarvestService;

import java.util.List;

@RestController
@RequestMapping("/api/harvests")
@CrossOrigin(origins = "*")
public class HarvestController {

    private final HarvestService service;

    public HarvestController(HarvestService service) {
        this.service = service;
    }

    @GetMapping
    public List<Harvest> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Harvest getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Harvest create(
            @RequestBody Harvest harvest) {

        return service.create(harvest);
    }

    @PutMapping("/{id}")
    public Harvest update(
            @PathVariable Integer id,
            @RequestBody Harvest harvest) {

        return service.update(id, harvest);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Harvest deleted successfully";
    }

    // Stored procedure
    @PostMapping("/record")
    public String recordHarvest(
            @RequestBody Harvest harvest) {

        service.recordHarvest(harvest);

        return "Harvest recorded successfully";
    }

    // Stored function
    @GetMapping("/total")
    public Double getTotalHarvest() {

        return service.getTotalHarvest();
    }

    // Subquery
    @GetMapping("/above-average")
    public List<Harvest> getAboveAverage() {

        return service.getAboveAverageHarvests();
    }

    // JOIN
    @GetMapping("/details")
    public List<HarvestDetailsResponse> getDetails() {

        return service.getHarvestDetails();
    }
}