# Docker Usage Guide

This guide covers how to build and run the Launch Calculator Docker image and outlines the project layout for development.

## Building the Image

Run the following command from the project root:
```bash
docker build -t launch-calculator .
```
This compiles the frontend and backend and packages them into a single image.

## Running the Container

Start the application on port 8080:
```bash
docker run -p 8080:8080 launch-calculator
```
Then open `http://localhost:8080` in your browser.

To persist satellite data between runs, mount the `data/tle` directory:
```bash
docker run -p 8080:8080 -v $(pwd)/data/tle:/app/data/tle launch-calculator
```

## Repository Layout

- `backend/`   – Spring Boot application
- `frontend/`  – React client
- `scripts/`   – Helper scripts (`deploy.sh`, `update-tle.sh`)
- `docs/`      – Documentation

Use `scripts/deploy.sh` to build the JAR and bundle the frontend without Docker.
Update TLE data with `scripts/update-tle.sh` when online.

