package com.example.smartagriculture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(
        scanBasePackages = "com.example.smartagriculture"
)
@EntityScan(
        basePackages = "com.example.smartagriculture.entity"
)
@EnableJpaRepositories(
        basePackages = "com.example.smartagriculture.repository"
)
public class SmartAgricultureApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                SmartAgricultureApplication.class,
                args
        );
    }
}