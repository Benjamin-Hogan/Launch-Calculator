package com.calculator.service;

import org.orekit.frames.TopocentricFrame;
import org.orekit.models.earth.GeoMagneticFieldFactory;
import org.orekit.bodies.OneAxisEllipsoid;
import org.orekit.models.earth.Geoid;
import org.orekit.utils.IERSConventions;
import org.orekit.frames.FramesFactory;
import org.orekit.bodies.GeodeticPoint;
import org.orekit.utils.Constants;

public class Utils {
    public static TopocentricFrame createTopocentricFrame(double latDeg, double lonDeg, double alt) {
        OneAxisEllipsoid earth = new OneAxisEllipsoid(Constants.WGS84_EARTH_EQUATORIAL_RADIUS,
                Constants.WGS84_EARTH_FLATTENING, FramesFactory.getITRF(IERSConventions.IERS_2010, true));
        GeodeticPoint gp = new GeodeticPoint(Math.toRadians(latDeg), Math.toRadians(lonDeg), alt);
        return new TopocentricFrame(earth, gp, "local");
    }
}
