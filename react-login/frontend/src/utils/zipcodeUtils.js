// src/utils/zipcodeUtils.js
import axios from 'axios';

// Haversine formula to calculate distance between two lat/long points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

// Function to get coordinates by zip code
async function getCoordinatesByZip(zip) {
  const url = `https://api.zippopotam.us/us/${zip}`;
  try {
    const response = await axios.get(url);
    const { 'post code': postCode, places } = response.data;
    if (places && places.length > 0) {
      return {
        lat: parseFloat(places[0].latitude),
        lon: parseFloat(places[0].longitude),
      };
    }
    throw new Error('Coordinates not found');
  } catch (error) {
    console.error('Error fetching coordinates for zip code:', zip, error);
    return null;
  }
}

// Main function to calculate distance between two zip codes
export async function getDistanceByZip(zip1, zip2) {
  if (!zip1 || zip1 === undefined || !zip2 || zip2 === undefined) {
    console.warn('Invalid zip code(s) provided:', zip1, zip2);
    return Infinity; // Set distance to infinity so these posts appear last in sorting
  }

  try {
    const [coord1, coord2] = await Promise.all([
      getCoordinatesByZip(zip1),
      getCoordinatesByZip(zip2),
    ]);

    if (!coord1 || !coord2) {
      // If either set of coordinates is not found, return Infinity
      return Infinity;
    }

    return haversineDistance(coord1.lat, coord1.lon, coord2.lat, coord2.lon);
  } catch (error) {
    console.error(
      'Error calculating distance between zip codes:',
      zip1,
      zip2,
      error
    );
    return Infinity;
  }
}
