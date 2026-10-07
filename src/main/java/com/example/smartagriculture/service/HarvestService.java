package com.example.smartagriculture.service;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.smartagriculture.dto.HarvestDetailsResponse;
import com.example.smartagriculture.entity.Harvest;
import com.example.smartagriculture.repository.HarvestRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class HarvestService {

    private final HarvestRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public HarvestService(
            HarvestRepository repository,
            JdbcTemplate jdbcTemplate) {

        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Harvest> getAll() {
        return repository.findAll();
    }

    public Harvest getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Harvest not found"));
    }

    public Harvest create(Harvest harvest) {
        return repository.save(harvest);
    }

    public Harvest update(Integer id, Harvest harvest) {

        Harvest existing = getById(id);

        existing.setPlantingId(harvest.getPlantingId());
        existing.setHarvestDate(harvest.getHarvestDate());
        existing.setQuantity(harvest.getQuantity());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    // Calls stored procedure
    public void recordHarvest(Harvest harvest) {

        jdbcTemplate.update(
                "CALL record_harvest(?, ?, ?)",
                harvest.getPlantingId(),
                java.sql.Date.valueOf(
                        harvest.getHarvestDate()),
                harvest.getQuantity()
        );
    }

    // Calls stored function
    public Double getTotalHarvest() {

        return jdbcTemplate.queryForObject(
                "SELECT calculate_total_harvest()",
                Double.class
        );
    }

    // Subquery result
    public List<Harvest> getAboveAverageHarvests() {
        return repository.findAboveAverageHarvests();
    }

    // JOIN result
    public List<HarvestDetailsResponse> getHarvestDetails() {

        List<Object[]> rows =
                repository.findHarvestDetails();

        return rows.stream()
                .map(row -> {

                    LocalDate date;

                    if (row[3] instanceof java.sql.Date sqlDate) {
                        date = sqlDate.toLocalDate();
                    } else if (row[3] instanceof LocalDate localDate) {
                        date = localDate;
                    } else {
                        date = LocalDate.parse(
                                row[3].toString());
                    }

                    return new HarvestDetailsResponse(
                            ((Number) row[0]).intValue(),
                            row[1].toString(),
                            row[2].toString(),
                            date,
                            ((Number) row[4]).doubleValue()
                    );
                })
                .toList();
    }
}