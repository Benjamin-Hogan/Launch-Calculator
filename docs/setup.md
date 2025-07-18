# Setup Guide

Follow these steps to run Launch Calculator on a Raspberry Pi Zero W.

1. Install Java, Node.js and Git as shown in the README.
2. Build the backend (while online once):
   ```bash
   cd backend
   ./mvnw dependency:go-offline
   ./mvnw -o package
   java -jar target/launch-calculator-0.1.0.jar
   ```
3. Build the frontend (after dependencies have been installed once):
   ```bash
   cd ../frontend
   npm install
   npm run build
   cp dist/* ../backend/src/main/resources/static/
   ```
4. (Optional) Update TLE data while online:
   ```bash
   ./scripts/update-tle.sh
   ```
5. Access the app at `http://<pi-address>:8080`.
