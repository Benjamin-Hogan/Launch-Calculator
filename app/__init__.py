from flask import Flask, request, jsonify, render_template
from pyorbital.orbital import Orbital
from datetime import datetime
import os

app = Flask(__name__)

def load_tles():
    tles = []
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'tle', 'active.txt')
    if not os.path.exists(path):
        return tles
    with open(path) as f:
        lines = [line.strip() for line in f if line.strip()]
    for i in range(0, len(lines), 3):
        name = lines[i]
        line1 = lines[i+1]
        line2 = lines[i+2]
        tles.append((name, line1, line2))
    return tles

TLES = load_tles()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/satellites/visible')
def visible():
    try:
        lat = float(request.args.get('lat', '0'))
        lon = float(request.args.get('lon', '0'))
        alt = float(request.args.get('alt', '0'))
    except ValueError:
        return jsonify({'error': 'invalid parameters'}), 400

    now = datetime.utcnow()
    visible = []
    for name, line1, line2 in TLES:
        orb = Orbital(name, line1=line1, line2=line2)
        elevation, azimuth = orb.get_observer_look(now, lon, lat, alt)
        if elevation > 10:
            visible.append(name)
    return jsonify(visible)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
