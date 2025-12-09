package com.architect.app.model;

import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String plotSize;
    private String houseType;
    private String budget;
    private String selectedPlanName; // e.g. "Plan B: The Value Plus"
    private String estimatedCost;
    private LocalDateTime createdAt;
}
