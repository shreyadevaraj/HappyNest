package com.architect.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArchitectRequest {
    private String plotSize;
    private String floors;
    private String houseType;
    private String facing;
    private String budget;
    private String mandatoryRooms;
    private String vaastu;
}
