package com.architect.app.controller;

import com.architect.app.model.Architect;
import com.architect.app.model.Project;
import com.architect.app.repository.ArchitectRepository;
import com.architect.app.repository.ProjectRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private final ArchitectRepository architectRepository;
    private final ProjectRepository projectRepository;

    public DataController(ArchitectRepository architectRepository, ProjectRepository projectRepository) {
        this.architectRepository = architectRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping("/architects")
    public List<Architect> getArchitects() {
        return architectRepository.findAll();
    }

    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    @PostMapping("/projects")
    public Project saveProject(@RequestBody Project project) {
        project.setCreatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }
}
