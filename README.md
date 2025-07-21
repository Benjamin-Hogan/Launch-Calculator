# Launch Calculator - Ground-Based Satellite Tracking System

A portable astrodynamics calculator built for a Raspberry Pi Zero W in an Altoids tin. Input your location and see what satellites are flying overhead, identify unknown objects, and track orbital elements.

## 🎯 What This Does

- **Real-time satellite visibility** - See what's overhead right now
- **Unknown object identification** - Input observations to determine orbits
- **Web interface** - Simple form to compute visible satellites
- **Portable operation** - Runs entirely on Pi Zero W with web interface
- **Field-ready** - Works offline once loaded, battery powered

## 📋 Weekend Project Plan

### Day 1: Backend Foundation
**Morning (4 hours)**
- Set up Pi Zero W with Python 3
- Create Flask REST API
- Basic coordinate conversion utilities

**Afternoon (4 hours)**
- TLE data integration from Celestrak
- SGP4 satellite propagation using `pyorbital`
- Visibility calculation algorithms

### Day 2: Web Interface & Integration
**Morning (4 hours)**
- Lightweight HTML/JS frontend
- Simple form to request visible satellites

**Afternoon (4 hours)**
- API integration
- Testing on the Pi
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

### Backend (Python)
```
Flask 2.x
pyorbital (SGP4 propagation)
```

## 🚀 Quick Start

### 1. Pi Zero W Setup
```bash
# Flash Raspberry Pi OS Lite to SD card and enable SSH
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip git -y
```

### 2. Clone and Run
```bash
git clone <your-repo>
cd launch-calculator
pip3 install -r requirements.txt
python3 -m app
```

### 3. Access the Application
- Connect to Pi Zero W WiFi network
- Open browser: `http://192.168.x.x:8080`
- Input your coordinates and start tracking!

### 4. Build and Run with Docker
```bash
docker build -t launch-calculator .
docker run -p 8080:8080 launch-calculator
```
See **docs/docker.md** for detailed Docker instructions.

### 5. Run AstroSolver on the Command Line
```bash
python -m app --cli --r "7000,0,0" --v "0,7.5,1"
```
The CLI resolves all possible orbital parameters from the provided vectors and
prints how each value was derived.

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
- **Sky map** - 2D azimuth/elevation plot
- **Ground tracks** - Orbital path overlay
- **Time controls** - Past/future predictions

## 📁 Project Structure

```
launch-calculator/
├── README.md
├── app/                # Flask application
│   ├── __init__.py
│   └── templates/
├── data/               # TLE files
├── docs/
│   ├── setup.md
│   ├── deploy.md
│   └── docker.md
├── scripts/
│   └── update-tle.sh
├── requirements.txt
└── Dockerfile
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

### Configuration
No special configuration is required. Simply ensure `data/tle/active.txt` exists
or run `scripts/update-tle.sh` while online to download the latest catalog.

## 🔍 Usage Examples

### Basic Satellite Tracking
```bash
# Start the application
python3 -m app

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

# Reduce Python memory usage
python3 -m app

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
- Monitor Python memory usage
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

# Update Python dependencies
pip3 install -r requirements.txt --upgrade
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
