package com.calculator.service;

import org.orekit.frames.TopocentricFrame;
import org.orekit.orbits.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VisibilityService {
    private final TLEService tleService;

    public VisibilityService(TLEService tleService) {
        this.tleService = tleService;
    }

    public List<String> visibleSatellites(double lat, double lon, double alt) {
        List<String> visible = new ArrayList<>();
        TopocentricFrame location = Utils.createTopocentricFrame(lat, lon, alt);
        AbsoluteDate now = new AbsoluteDate(java.time.Instant.now(), TimeScalesFactory.getUTC());

        for (TLE tle : tleService.getTLEs()) {
            TLEPropagator propagator = TLEPropagator.selectExtrapolator(tle);
            PVCoordinates pv = propagator.getPVCoordinates(now, location.getFrame());
            double elevation = location.getElevation(pv.getPosition(), location.getFrame(), now);
            if (Math.toDegrees(elevation) > 10) {
                visible.add(tle.getSatelliteNumber());
            }
        }
        return visible;
    }
}
