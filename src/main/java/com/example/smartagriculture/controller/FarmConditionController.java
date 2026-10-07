package com.example.smartagriculture.controller;


import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.entity.FarmCondition;
import com.example.smartagriculture.service.FarmConditionService;

import java.util.List;

@RestController
@RequestMapping("/api/farm-conditions")
@CrossOrigin(origins = "*")
public class FarmConditionController {

    private final FarmConditionService service;

    public FarmConditionController(
            FarmConditionService service) {

        this.service = service;
    }

    @GetMapping
    public List<FarmCondition> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public FarmCondition getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public FarmCondition create(
            @RequestBody FarmCondition condition) {

        return service.create(condition);
    }

    @PutMapping("/{id}")
    public FarmCondition update(
            @PathVariable Integer id,
            @RequestBody FarmCondition condition) {

        return service.update(id, condition);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Farm condition deleted successfully";
    }
}