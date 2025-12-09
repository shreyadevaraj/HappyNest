package com.architect.app.repository;

import com.architect.app.model.Architect;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArchitectRepository extends JpaRepository<Architect, Long> {
}
