package com.architect.app.model;

import lombok.Data;

@Data
public class ArchitectRequest {
    private String plotSize;
    private String floors;
    private String houseType;
    private String facing;
    private String budget;
    private String mandatoryRooms;
    private String vaastu;
}
