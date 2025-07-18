package com.calculator.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConfigController {

    @Value("${cesium.ion.token:}")
    private String cesiumIonToken;

    @GetMapping("/api/config/cesium-token")
    public String getCesiumIonToken() {
        return cesiumIonToken;
    }
}
