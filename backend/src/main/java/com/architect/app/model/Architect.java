package com.architect.app.model;

import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class Architect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String specialty;
    private String contact;
    private String rating; // e.g., "4.8/5"
    private String priceRange; // e.g., "₹50 - ₹80 per sq.ft"
    private String bio;
}
