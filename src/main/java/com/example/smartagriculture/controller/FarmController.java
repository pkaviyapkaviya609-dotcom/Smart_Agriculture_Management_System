package com.example.smartagriculture.controller;

import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.entity.Farm;
import com.example.smartagriculture.service.FarmService;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "*")
public class FarmController {

    private final FarmService service;

    public FarmController(FarmService service) {
        this.service = service;
    }

    @GetMapping
    public List<Farm> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Farm getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Farm create(@RequestBody Farm farm) {
        return service.create(farm);
    }

    @PutMapping("/{id}")
    public Farm update(
            @PathVariable Integer id,
            @RequestBody Farm farm) {

        return service.update(id, farm);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Farm deleted successfully";
    }
}