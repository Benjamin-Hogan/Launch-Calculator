package com.calculator.service;

import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.propagation.analytical.tle.TLE;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TLEService {
    private Path tleFile = Paths.get("data/tle/active.txt");
    private List<TLE> tles = new ArrayList<>();

    @PostConstruct
    public void init() throws Exception {
        DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
        manager.addDefaultProviders();
        loadLocalTLE();
    }

    private void loadLocalTLE() throws IOException {
        if (!Files.exists(tleFile)) {
            return;
        }
        tles.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(tleFile.toFile()))) {
            String name;
            while ((name = reader.readLine()) != null) {
                String line1 = reader.readLine();
                String line2 = reader.readLine();
                if (line2 != null) {
                    tles.add(new TLE(line1, line2));
                }
            }
        }
    }

    public void updateTLE() throws IOException {
        URL url = new URL("https://celestrak.com/NORAD/elements/active.txt");
        Files.createDirectories(tleFile.getParent());
        try (BufferedInputStream in = new BufferedInputStream(url.openStream());
             FileOutputStream out = new FileOutputStream(tleFile.toFile())) {
            in.transferTo(out);
        }
        loadLocalTLE();
    }

    public List<TLE> getTLEs() {
        return tles;
    }
}
