package com.calculator.controller;

import com.calculator.service.VisibilityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SatelliteController {
    private final VisibilityService visibilityService;

    public SatelliteController(VisibilityService visibilityService) {
        this.visibilityService = visibilityService;
    }

    @GetMapping("/api/satellites/visible")
    public List<String> visible(@RequestParam double lat, @RequestParam double lon,
                                @RequestParam(defaultValue = "0") double alt) {
        return visibilityService.visibleSatellites(lat, lon, alt);
    }
}
