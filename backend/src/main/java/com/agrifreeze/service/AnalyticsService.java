package com.agrifreeze.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    public Map<String, Object> getAnalyticsData() {
        Map<String, Object> analytics = new LinkedHashMap<>();

        List<Map<String, Object>> occupancyTrends = List.of(
                Map.of("month", "Jan", "occupied", 3200, "total", 19000),
                Map.of("month", "Feb", "occupied", 4500, "total", 19000),
                Map.of("month", "Mar", "occupied", 5800, "total", 19000),
                Map.of("month", "Apr", "occupied", 7200, "total", 19000),
                Map.of("month", "May", "occupied", 8100, "total", 19000),
                Map.of("month", "Jun", "occupied", 8300, "total", 19000)
        );

        List<Map<String, Object>> energyUsage = List.of(
                Map.of("day", "Mon", "consumption", 3240, "cost", 324),
                Map.of("day", "Tue", "consumption", 3180, "cost", 318),
                Map.of("day", "Wed", "consumption", 3460, "cost", 346),
                Map.of("day", "Thu", "consumption", 3020, "cost", 302),
                Map.of("day", "Fri", "consumption", 3510, "cost", 351),
                Map.of("day", "Sat", "consumption", 2890, "cost", 289),
                Map.of("day", "Sun", "consumption", 2640, "cost", 264)
        );

        List<Map<String, Object>> revenueByHub = List.of(
                Map.of("name", "North Hub", "value", 45200),
                Map.of("name", "West Hub", "value", 38400),
                Map.of("name", "South Facility", "value", 8900)
        );

        List<Map<String, Object>> temperatureHistory = List.of(
                Map.of("time", "00:00", "chamberA", 4.0, "chamberB", -18.0, "chamberC", 6.0),
                Map.of("time", "04:00", "chamberA", 4.1, "chamberB", -18.1, "chamberC", 6.2),
                Map.of("time", "08:00", "chamberA", 4.2, "chamberB", -17.8, "chamberC", 7.0),
                Map.of("time", "12:00", "chamberA", 4.2, "chamberB", -10.0, "chamberC", 8.1),
                Map.of("time", "16:00", "chamberA", 4.1, "chamberB", -12.0, "chamberC", 7.9),
                Map.of("time", "20:00", "chamberA", 4.0, "chamberB", -16.5, "chamberC", 6.8),
                Map.of("time", "24:00", "chamberA", 4.0, "chamberB", -18.0, "chamberC", 6.2)
        );

        analytics.put("occupancyTrends", occupancyTrends);
        analytics.put("energyUsage", energyUsage);
        analytics.put("revenueByHub", revenueByHub);
        analytics.put("temperatureHistory", temperatureHistory);

        return analytics;
    }
}
