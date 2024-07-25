import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FaCar } from 'react-icons/fa'; 
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const createIconUrl = (icon) => {
  const svg = renderToStaticMarkup(icon);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const vehicleIcon = L.icon({
  iconUrl: createIconUrl(<FaCar size={32} color="blue" />), 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const center = [24.5821, 80.8274]; 

const MapContainers = () => {
  const [vehiclePosition, setVehiclePosition] = useState(center);
  const [path, setPath] = useState([]);
  const [startPosition, setStartPosition] = useState(center); 

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicle');
        setVehiclePosition(response.data.vehiclePosition);
        setPath(response.data.path);
        if (response.data.path.length > 0) {
          setStartPosition(response.data.path[0]); 
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };
    const interval = setInterval(fetchVehicleData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <MapContainer center={vehiclePosition} zoom={15} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={vehiclePosition} icon={vehicleIcon} />
        <Polyline positions={path} color="red" />
      </MapContainer>
    
    </div>
  );
};

export default MapContainers;
