package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class DynamicPlanService {

    public Mono<String> generatePlans(ArchitectRequest r) {
        System.out.println("=== Generating Dynamic Plans ===");
        System.out.println("Input: " + r.getPlotSize() + " " + r.getHouseType() + " facing " + r.getFacing());

        String plotSize = r.getPlotSize() != null ? r.getPlotSize() : "40x60";
        String[] dimensions = plotSize.split("x");
        int length = dimensions.length > 0 ? parseNumber(dimensions[0]) : 40;
        int width = dimensions.length > 1 ? parseNumber(dimensions[1]) : 60;
        int totalArea = length * width;

        String facing = r.getFacing() != null ? r.getFacing() : "North";
        String floors = r.getFloors() != null ? r.getFloors() : "G+1";
        String houseType = r.getHouseType() != null ? r.getHouseType() : "3BHK";
        String budget = r.getBudget() != null ? r.getBudget() : "50 Lakhs";
        String vaastu = r.getVaastu() != null ? r.getVaastu() : "Moderate";

        // Calculate built-up areas based on plot size
        int planAArea = (int) (totalArea * 0.5); // 50% coverage
        int planBArea = (int) (totalArea * 0.6); // 60% coverage
        int planCArea = (int) (totalArea * 0.7); // 70% coverage

        // Generate room dimensions based on plot
        String planARooms = generateRoomLayout(length, width, "budget");
        String planBRooms = generateRoomLayout(length, width, "modern");
        String planCRooms = generateRoomLayout(length, width, "luxury");

        // Generate light/ventilation based on facing
        String lightStrategy = generateLightStrategy(facing, floors);

        // Generate Vaastu compliance based on preference
        String vaastuCompliance = generateVaastuCompliance(facing, vaastu);

        String json = "{\n" +
                "  \"plans\": [\n" +
                "    {\n" +
                "      \"name\": \"Plan A: Budget-Optimized Design\",\n" +
                "      \"headline\": \"Efficient Living Within Your Budget\",\n" +
                "      \"roomDetails\": \"" + planARooms + "\",\n" +
                "      \"builtUpArea\": \"" + planAArea + " sq.ft (50% plot coverage)\",\n" +
                "      \"floorDistribution\": \"" + floors + " - Compact vertical layout\",\n" +
                "      \"lightVentilation\": \"" + lightStrategy
                + " Economical window placement for natural light.\",\n" +
                "      \"vaastuCompliance\": \"" + vaastuCompliance + " Kitchen in SE, entrance optimized for " + facing
                + " facing.\",\n" +
                "      \"budgetEstimate\": \"" + budget + " (₹1,200-1,500/sq.ft)\",\n" +
                "      \"image\": \"/plan-a.png\",\n" +
                "      \"contractors\": [{\"name\": \"Ramesh Civil Works\", \"contact\": \"98765 43210\", \"specialty\": \"Budget Residential\"}]\n"
                +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"Plan B: Enhanced Comfort\",\n" +
                "      \"headline\": \"Modern Living with Premium Finishes\",\n" +
                "      \"roomDetails\": \"" + planBRooms + "\",\n" +
                "      \"builtUpArea\": \"" + planBArea + " sq.ft (60% plot coverage)\",\n" +
                "      \"floorDistribution\": \"" + floors + " with open terrace and balconies\",\n" +
                "      \"lightVentilation\": \"" + lightStrategy
                + " French windows and skylights for superior airflow.\",\n" +
                "      \"vaastuCompliance\": \"" + vaastuCompliance
                + " Brahmasthan (center) kept open, Pooja in NE.\",\n" +
                "      \"budgetEstimate\": \"15-20% above budget (₹1,800-2,200/sq.ft)\",\n" +
                "      \"image\": \"/plan-b.png\",\n" +
                "      \"contractors\": [{\"name\": \"UrbanNest Builders\", \"contact\": \"91234 56789\", \"specialty\": \"Modern G+1\"}]\n"
                +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"Plan C: Luxury Villa\",\n" +
                "      \"headline\": \"Premium Lifestyle & Architectural Excellence\",\n" +
                "      \"roomDetails\": \"" + planCRooms + "\",\n" +
                "      \"builtUpArea\": \"" + planCArea + " sq.ft (70% plot coverage)\",\n" +
                "      \"floorDistribution\": \"" + floors + " + Terrace Garden with premium amenities\",\n" +
                "      \"lightVentilation\": \"" + lightStrategy
                + " Full-height glass facade with automated climate control.\",\n" +
                "      \"vaastuCompliance\": \"" + vaastuCompliance
                + " 100% Vaastu with elemental balancing and energy optimization.\",\n" +
                "      \"budgetEstimate\": \"50%+ above budget (₹2,500-3,500/sq.ft)\",\n" +
                "      \"image\": \"/plan-c.png\",\n" +
                "      \"contractors\": [{\"name\": \"Elite Spaces Architects\", \"contact\": \"90000 11111\", \"specialty\": \"Luxury Villas\"}]\n"
                +
                "    }\n" +
                "  ]\n" +
                "}";

        System.out.println("✅ Dynamic plans generated successfully!");
        return Mono.just(json);
    }

    private String generateRoomLayout(int length, int width, String tier) {
        if (tier.equals("budget")) {
            return "Living (" + (length / 3) + "x" + (width / 4) + "), Kitchen (" + (length / 4) + "x" + (width / 5)
                    + "), 2 Bedrooms (" + (length / 4) + "x" + (width / 4) + " each), 2 Bathrooms";
        } else if (tier.equals("modern")) {
            return "Spacious Living (" + (length / 2.5) + "x" + (width / 3) + "), Modular Kitchen (" + (length / 3)
                    + "x" + (width / 4) + "), Master Suite (" + (length / 3) + "x" + (width / 3)
                    + "), 2 Guest Rooms, Balcony";
        } else {
            return "Double-height Living (" + (length / 2) + "x" + (width / 2.5)
                    + "), Gourmet Kitchen, 4 Ensuite Bedrooms, Home Theater, Study, Servant Quarters";
        }
    }

    private String generateLightStrategy(String facing, String floors) {
        String strategy = "";
        switch (facing.toLowerCase()) {
            case "north":
                strategy = "North-facing plot ensures consistent natural light throughout the day.";
                break;
            case "south":
                strategy = "South-facing plot maximizes sunlight. Strategic shading on south facade.";
                break;
            case "east":
                strategy = "East-facing plot captures morning sunlight. Large windows on east side.";
                break;
            case "west":
                strategy = "West-facing plot gets evening sun. Heat-resistant glass on west facade.";
                break;
            default:
                strategy = "Optimized window placement for natural light.";
        }
        return strategy;
    }

    private String generateVaastuCompliance(String facing, String vaastu) {
        if (vaastu.toLowerCase().contains("strict")) {
            return "Strict Vaastu compliance:";
        } else if (vaastu.toLowerCase().contains("moderate")) {
            return "Moderate Vaastu principles applied:";
        } else {
            return "Functional layout prioritized:";
        }
    }

    private int parseNumber(String str) {
        try {
            return Integer.parseInt(str.trim());
        } catch (Exception e) {
            return 40;
        }
    }
}
