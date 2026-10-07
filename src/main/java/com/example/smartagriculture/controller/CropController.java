package com.example.smartagriculture.controller;



import org.springframework.web.bind.annotation.*;

import com.example.smartagriculture.entity.Crop;
import com.example.smartagriculture.service.CropService;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropService service;

    public CropController(CropService service) {
        this.service = service;
    }

    @GetMapping
    public List<Crop> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Crop getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Crop create(@RequestBody Crop crop) {
        return service.create(crop);
    }

    @PutMapping("/{id}")
    public Crop update(
            @PathVariable Integer id,
            @RequestBody Crop crop) {

        return service.update(id, crop);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Crop deleted successfully";
    }
}