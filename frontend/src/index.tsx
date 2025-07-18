import React from 'react';
import ReactDOM from 'react-dom/client';
import { Viewer } from 'cesium';
import axios from 'axios';

const App = () => {
  React.useEffect(() => {
    const viewer = new Viewer('cesiumContainer');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const resp = await axios.get(`/api/satellites/visible?lat=${latitude}&lon=${longitude}`);
      console.log('Visible', resp.data);
    });
  }, []);
  return <div id="cesiumContainer" style={{height: '100vh'}}></div>;
};

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
