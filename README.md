# Launch Calculator - Ground-Based Satellite Tracking System

A portable astrodynamics calculator built for a Raspberry Pi Zero W in an Altoids tin. Input your location and see what satellites are flying overhead, identify unknown objects, and track orbital elements.

## 🎯 What This Does

- **Real-time satellite visibility** - See what's overhead right now
- **Unknown object identification** - Input observations to determine orbits
- **3D visualization** - Interactive globe showing satellite positions
- **Portable operation** - Runs entirely on Pi Zero W with web interface
- **Field-ready** - Works offline once loaded, battery powered

## 📋 Weekend Project Plan

### Day 1: Backend Foundation
**Morning (4 hours)**
- Set up Pi Zero W with Java 11
- Create Spring Boot REST API
- Basic coordinate conversion utilities

**Afternoon (4 hours)**
- TLE data integration from Celestrak
- SGP4 satellite propagation
- Visibility calculation algorithms

### Day 2: Frontend & Integration
**Morning (4 hours)**
- React frontend with TypeScript
- Cesium.js 3D visualization
- Location input and time controls

**Afternoon (4 hours)**
- API integration
- Satellite display and tracking
- Deploy to Pi Zero W

## 🛠️ Hardware Requirements

### Essential Components
- **Raspberry Pi Zero W** (with WiFi)
- **Altoids tin** (housing)
- **MicroSD card** (32GB recommended)
- **Power bank** or LiPo battery
- **Micro USB cable**

### Optional Additions
- Small OLED display (status/IP address)
- Push button (safe shutdown)
- External antenna (better GPS/WiFi)

## 💻 Software Stack

### Backend (Java)
```
Spring Boot 2.7.x
Java 11 (OpenJDK)
Orekit (orbital mechanics)
H2 Database (embedded)
Maven build system
```

### Frontend (React)
```
React 18 with TypeScript
Cesium.js (3D visualization)
Axios (API client)
Chart.js (2D plots)
Responsive design
```

## 🚀 Quick Start

### 1. Pi Zero W Setup
```bash
# Flash Raspberry Pi OS Lite to SD card
# Boot and enable SSH
sudo apt update && sudo apt upgrade -y
sudo apt install default-jdk nodejs npm git -y

# Verify Java installation
java -version  # Should show OpenJDK 11
```

### 2. Clone and Build Backend
```bash
git clone <your-repo>
cd launch-calculator/backend

# Build with Maven
./mvnw dependency:go-offline  # download deps while online
./mvnw -o clean package       # build offline

# Run with limited memory
java -Xmx256m -jar target/launch-calculator-0.1.jar
```

### 3. Build and Deploy Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve from backend static resources
cp -r dist/* ../backend/src/main/resources/static/
```

### 4. Access the Application
- Connect to Pi Zero W WiFi network
- Open browser: `http://192.168.x.x:8080`
- Input your coordinates and start tracking!


For a step-by-step installation walkthrough see **docs/setup.md**. To run the
app automatically on boot refer to **docs/deploy.md**.
### 5. Build and Run with Docker
An alternative to installing the toolchain locally is to use Docker. The
provided `Dockerfile` bundles the backend and frontend into a single image.

```bash
# Build the container image
docker build -t launch-calculator .

# Run the application
docker run -p 8080:8080 launch-calculator
```
See **docs/docker.md** for detailed Docker instructions.

## 🌍 Core Features

### Location Management
- **Manual coordinates** - Enter lat/lon directly
- **GPS integration** - Use device location (if available)
- **Saved locations** - Store frequently used positions
- **Coordinate formats** - DD, DMS, MGRS support

### Satellite Tracking
- **Current visibility** - What's overhead now
- **Pass predictions** - When satellites will be visible
- **TLE catalog** - Updated satellite database
- **Real-time positions** - Live tracking updates

### Unknown Object Analysis
- **Observation input** - Time, azimuth, elevation data
- **Orbit determination** - Calculate orbital elements
- **Identification** - Match against known catalogs
- **Export results** - TLE format output

### Visualization
- **3D globe view** - Cesium.js Earth visualization
- **Sky map** - 2D azimuth/elevation plot
- **Ground tracks** - Orbital path overlay
- **Time controls** - Past/future predictions

## 📁 Project Structure

```
launch-calculator/
├── README.md
├── backend/
│   ├── src/main/java/com/calculator/
│   │   ├── LaunchCalculatorApplication.java
│   │   ├── controller/
│   │   │   ├── LocationController.java
│   │   │   ├── SatelliteController.java
│   │   │   └── ObservationController.java
│   │   ├── service/
│   │   │   ├── TLEService.java
│   │   │   ├── OrbitService.java
│   │   │   └── VisibilityService.java
│   │   ├── model/
│   │   │   ├── Satellite.java
│   │   │   ├── Location.java
│   │   │   └── Observation.java
│   │   └── config/
│   │       └── WebConfig.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/ (React build output)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LocationInput.tsx
│   │   │   ├── SatelliteMap.tsx
│   │   │   ├── ObservationForm.tsx
│   │   │   └── SkyView.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── cesium.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── package.json
│   └── public/
├── docs/
│   ├── setup.md
│   ├── deploy.md
│   └── (additional docs)
└── scripts/
    ├── deploy.sh
    └── update-tle.sh
```

## 🔧 API Endpoints

### Location Services
```
GET  /api/location/current    # Get current location
POST /api/location/set        # Set manual coordinates
GET  /api/location/validate   # Validate coordinates
```

### Satellite Services
```
GET  /api/satellites/visible      # Currently visible satellites
GET  /api/satellites/all          # All cataloged satellites
GET  /api/satellites/{id}         # Specific satellite info
GET  /api/satellites/{id}/passes  # Pass predictions
```

### Observation Services
```
POST /api/observations/add        # Add new observation
POST /api/observations/analyze    # Determine orbit
GET  /api/observations/history    # Observation history
```

### Data Services
```
GET  /api/data/tle/update        # Update TLE catalog
GET  /api/data/status            # System status
```

## 🎛️ Configuration

### Backend Configuration (`application.properties`)
```properties
# Server settings
server.port=8080
server.servlet.context-path=/

# Memory optimization
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true

# TLE data source
tle.update.url=https://celestrak.com/NORAD/elements/
tle.update.interval=24h

# Calculation settings
orbit.prediction.days=7
visibility.elevation.minimum=10
```

### Frontend Configuration
The Cesium ion access token is provided via the `CESIUM_ION_TOKEN` environment
variable. Set this before starting the backend so the frontend can load the
token dynamically:

```bash
export CESIUM_ION_TOKEN=your-cesium-token
java -jar backend/target/launch-calculator-0.1.jar
```

## 🔍 Usage Examples

### Basic Satellite Tracking
```bash
# Start the application
java -jar launch-calculator.jar

# Open web interface
firefox http://localhost:8080

# Input coordinates: 39.7392°N, 104.9903°W
# View current satellites overhead
```

### Unknown Object Analysis
```bash
# Input observation data:
# Time: 2025-07-18 21:30:00 UTC
# Azimuth: 245°
# Elevation: 35°
# 
# System calculates possible orbits
# Matches against known catalog
```

## 🚨 Troubleshooting

### Pi Zero W Performance Issues
```bash
# Check memory usage
free -h

# Reduce Java heap size
java -Xmx128m -jar launch-calculator.jar

# Monitor CPU usage
htop
```

### TLE Data Issues
```bash
# Manual TLE update
curl -o celestrak.tle https://celestrak.com/NORAD/elements/active.txt

# Check TLE file format
head -n 3 celestrak.tle
```

### Network Connectivity
```bash
# Check WiFi connection
iwconfig wlan0

# Test internet access
ping google.com

# Check port availability
netstat -tuln | grep 8080
```

## 📊 Performance Optimization

### Memory Management
- Use `-Xmx256m` for Java heap
- Enable garbage collection logging
- Cache TLE data efficiently
- Limit concurrent calculations

### Battery Life
- Reduce update frequency
- Implement sleep modes
- Optimize calculation algorithms
- Use efficient data structures

## 🔄 Updates and Maintenance

### TLE Data Updates
```bash
# Automated daily updates
echo "0 6 * * * /path/to/update-tle.sh" | crontab -

# Manual update
./scripts/update-tle.sh  # requires temporary internet
```

### System Updates
```bash
# Update Pi Zero W system
sudo apt update && sudo apt upgrade

# Update Java dependencies
./mvnw clean package

# Update frontend packages
npm update
```

## 🎯 Success Metrics

### Minimum Viable Product
- ✅ Input coordinates and see satellite list
- ✅ Real-time visibility calculations
- ✅ Basic web interface
- ✅ Runs on Pi Zero W

### Stretch Goals
- ✅ 3D Cesium visualization
- ✅ Unknown object tracking
- ✅ Pass predictions
- ✅ Mobile-responsive design

## 🚀 Next Steps (Phase 2)

### Advanced Features
- Historical observation tracking
- Advanced orbit determination algorithms
- Mobile app wrapper
- Offline operation mode
- Enhanced filtering and search

### Hardware Enhancements
- GPS module integration
- Real-time clock
- Environmental sensors
- External antenna options

## 📞 Support

### Common Issues
- **Memory errors**: Reduce Java heap size
- **WiFi problems**: Check network configuration
- **Slow performance**: Optimize calculation frequency
- **TLE errors**: Verify internet connection

### Resources
- [Orekit Documentation](https://www.orekit.org/)
- [Cesium.js Guide](https://cesium.com/learn/)
- [Spring Boot Reference](https://spring.io/projects/spring-boot)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)

## 📜 License

MIT License - Feel free to use and modify for your own satellite tracking projects!

---

**Built with ❤️ for amateur astronomers and space enthusiasts**
