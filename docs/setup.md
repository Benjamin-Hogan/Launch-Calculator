# Setup Guide

This guide walks you through preparing a Raspberry Pi Zero W and installing **Launch Calculator** from scratch. No prior environment is assumed.

## 1. Prepare the Raspberry Pi

1. Download the latest **Raspberry Pi OS Lite** image from the official website.
2. Flash the image to a microSD card using **Raspberry Pi Imager** or `dd` on Linux/Mac.
3. (Optional) To enable headless access, create an empty file named `ssh` in the boot partition and add a `wpa_supplicant.conf` file with your Wi‑Fi credentials.
4. Insert the card into the Pi Zero W and power it on.

## 2. First Boot Configuration

1. Connect to the Pi via SSH or a keyboard and monitor.
2. Run the initial update and install required packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3 python3-pip git -y
   ```
3. Verify the installation:
   ```bash
   python3 --version  # should print Python 3
   ```

## 3. Clone the Repository

1. Choose a directory (e.g. `/home/pi`) and clone the project:
   ```bash
   git clone https://github.com/youruser/launch-calculator.git
   cd launch-calculator
   ```

## 4. Install Python Dependencies

While online, install the required Python packages:
```bash
pip3 install -r requirements.txt
```

## 5. Test the Application

Start the Flask app on the Pi:
```bash
python3 -m app
```

Browse to `http://<pi-address>:8080` from another device on the network. You should see the application UI.

## 6. Updating TLE Data

When you have internet connectivity, run the provided script to refresh satellite data:
```bash
./scripts/update-tle.sh
```

You are now ready to deploy the application permanently. See `docs/deploy.md` for details on running Launch Calculator as a service.
