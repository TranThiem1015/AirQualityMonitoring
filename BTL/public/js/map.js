// map.js - LeafletJS handling functions for displaying sensor data on the map

let map; // Main Leaflet map object
const markers = {}; // Object to store sensor markers
const circles = {}; // Object to store circles around markers (for visual emphasis)

/**
 * Initialize the Leaflet map and load sensor markers
 */
function initMap() {
  const defaultLocation = [10.75, 106.64]; // Default center of the map
  map = L.map('map').setView(defaultLocation, 12); // Initialize map with zoom level 14

  // Add OpenStreetMap tiles as the base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load latest markers from Firebase and update them on the map
  loadMapMarkers();

  // Optional: Update additional info outside the map
  updateLatestInfo();
}

/**
 * Load the latest data for each sensor and update their markers on the map
 */
function loadMapMarkers() {
  const gateways = ["sensor_1", "sensor_2"]; // List of GATEWAYS references in Firebase

  gateways.forEach(sensor => {
    // Read data from Firebase Realtime Database for each sensor
    db.ref(sensor).once("value", snapshot => {
      const data = snapshot.val();
      const entries = [];

      // Flatten the nested date/time structure into a single array of data entries
      for (const date in data) {
        for (const time in data[date]) {
          const record = data[date][time];
          entries.push({ datetime: `${date} ${time}`, ...record });
        }
      }

      // Sort entries by datetime to find the most recent data
      entries.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      const latest = entries[entries.length - 1]; // Get the latest data entry

      const pos = [parseFloat(latest.lat), parseFloat(latest.lon)]; // Marker position
      const color = gatewayColors[sensor]; // Get color assigned for each sensor

      // Create new marker if it doesn't exist
      if (!markers[sensor]) {
        markers[sensor] = L.circleMarker(pos, {
          radius: 8,
          color: "#fff",
          fillColor: color,
          fillOpacity: 1,
          weight: 1
        }).addTo(map);

        // Add popup with latest sensor data
        markers[sensor].bindPopup(`
          <strong>Trạm:</strong> ${latest.module}<br>
          <strong>Thời gian:</strong> ${latest.datetime}<br>
          <strong>Nhiệt độ:</strong> ${latest.temp}°C<br>
          <strong>Độ ẩm:</strong> ${latest.hum}%<br>
          <strong>PM2.5:</strong> ${latest.pm25} µg/m³
        `);

        // Show popup on mouse hover
        markers[sensor].on("mouseover", function () {
          this.openPopup();
        });

        // Hide popup when mouse leaves
        markers[sensor].on("mouseout", function () {
          this.closePopup();
        });
      } else {
        // If marker already exists, just update its position
        markers[sensor].setLatLng(pos);
      }

      // Remove the existing circle if any
      if (circles[sensor]) {
        circles[sensor].remove();
      }

      // Draw a translucent circle around the marker for emphasis (non-interactive)
      circles[sensor] = L.circle(pos, {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: 100,
        interactive: false // Prevent the circle from blocking mouse events
      }).addTo(map);
    });
  });
}
