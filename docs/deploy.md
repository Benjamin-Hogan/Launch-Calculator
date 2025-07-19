# Deployment Guide

This document explains how to run Launch Calculator as a long‑running service on your Raspberry Pi once you have completed the steps in `setup.md`.

## 1. Install Dependencies

From the project root run the deployment script which installs Python packages:
```bash
./scripts/deploy.sh
```

## 2. Starting Manually

Test that the application starts correctly:
```bash
python3 -m app
```

Open `http://<pi-address>:8080` in your browser. Press `Ctrl+C` to stop the server.

## 3. Running as a systemd Service

To keep the application running after reboot, create a systemd unit. Replace `/home/pi/launch-calculator` with the path to your cloned repository if different.

Create `/etc/systemd/system/launch-calculator.service` with the following contents:
```ini
[Unit]
Description=Launch Calculator Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/launch-calculator
ExecStart=/usr/bin/python3 -m app
Restart=always

[Install]
WantedBy=multi-user.target
```
Then enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now launch-calculator
```
The application will now start automatically on boot and can be reached at `http://<pi-address>:8080`.

## 4. Updating Satellite Data

Periodically refresh the TLE data using:
```bash
./scripts/update-tle.sh
```
Run this while connected to the internet, then restart the service if needed:
```bash
sudo systemctl restart launch-calculator
```

You now have a fully deployed Launch Calculator that will survive reboots.
