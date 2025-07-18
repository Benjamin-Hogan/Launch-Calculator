package com.calculator.service;

import org.orekit.frames.TopocentricFrame;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Service
public class VisibilityService {
    private final TLEService tleService;

    public VisibilityService(TLEService tleService) {
        this.tleService = tleService;
    }

    public List<String> visibleSatellites(double lat, double lon, double alt) {
        List<String> visible = new ArrayList<>();
        TopocentricFrame location = Utils.createTopocentricFrame(lat, lon, alt);
        AbsoluteDate now = new AbsoluteDate(new Date(), TimeScalesFactory.getUTC());

        for (TLE tle : tleService.getTLEs()) {
            TLEPropagator propagator = TLEPropagator.selectExtrapolator(tle);
            PVCoordinates pv = propagator.getPVCoordinates(now, location.getParent());
            double elevation = location.getElevation(pv.getPosition(), location.getParent(), now);
            if (Math.toDegrees(elevation) > 10) {
                visible.add(String.valueOf(tle.getSatelliteNumber()));
            }
        }
        return visible;
    }
}
