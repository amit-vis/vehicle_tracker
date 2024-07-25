const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const generateStraightRoutePath = (startLat, startLng, numPoints, distanceKm, direction) => {
    const path = [];
    const earthRadiusKm = 6371; 
    const distancePerStep = distanceKm / (numPoints - 1); 
  
    let currentLat = startLat;
    let currentLng = startLng;
  
    for (let i = 0; i < numPoints; i++) {
      const latVariation = (distancePerStep / earthRadiusKm) * (180 / Math.PI);
      const lngVariation = (distancePerStep / earthRadiusKm) * (180 / Math.PI) / Math.cos(currentLat * Math.PI / 180);
  
      switch (direction) {
        case 'north':
          currentLat += latVariation;
          break;
        case 'south':
          currentLat -= latVariation;
          break;
        case 'east':
          currentLng += lngVariation;
          break;
        case 'west':
          currentLng -= lngVariation;
          break;
        case 'northeast':
          currentLat += latVariation;
          currentLng += lngVariation;
          break;
        case 'northwest':
          currentLat += latVariation;
          currentLng -= lngVariation;
          break;
        case 'southeast':
          currentLat -= latVariation;
          currentLng += lngVariation;
          break;
        case 'southwest':
          currentLat -= latVariation;
          currentLng -= lngVariation;
          break;
        default:
          throw new Error('Invalid direction');
      }
  
      path.push([currentLat, currentLng]);
    }
  
    return path;
  };
  
  const startLat = 24.5821;
  const startLng = 80.8274;
  const numPoints = 50;
  const distanceKm = 5; 
  const direction = 'north'; 
  
  const routePath = generateStraightRoutePath(startLat, startLng, numPoints, distanceKm, direction);
  

let pathIndex = 0;

app.get('/api/vehicle', (req, res) => {
  if (pathIndex < routePath.length) {
    const vehiclePosition = routePath[pathIndex];
    pathIndex++;
    res.json({ vehiclePosition, path: routePath.slice(0, pathIndex) });
  } else {
    res.json({ vehiclePosition: routePath[routePath.length - 1], path: routePath });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


