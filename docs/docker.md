# Docker Usage Guide

This guide covers how to build and run the Launch Calculator Docker image and outlines the project layout for development.

## Building the Image

Run the following command from the project root:
```bash
docker build -t launch-calculator .
```
This installs the Python dependencies and packages the app into a single image.

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

### CLI Usage
You can also run AstroSolver directly inside the container:
```bash
docker run --rm launch-calculator python -m app --cli --r "7000,0,0" --v "0,7.5,1"
```

## Repository Layout

- `app/`       – Flask application
- `scripts/`   – Helper scripts (`deploy.sh`, `update-tle.sh`)
- `docs/`      – Documentation

Use `scripts/deploy.sh` to install dependencies without Docker.
Update TLE data with `scripts/update-tle.sh` when online.

