// map.js - LeafLetJs handling functions
let map;
const markers = {};
const circles = {};

function initMap() {
  const defaultLocation = [10.762622, 106.660172]; // Bách Khoa HCM
  map = L.map('map').setView(defaultLocation, 12);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  loadMapMarkers();
  updateLatestInfo();
}

function loadMapMarkers() {
  const gateways = ["sensor_1", "sensor_2"];

  gateways.forEach(sensor => {
    db.ref(sensor).once("value", snapshot => {
      const data = snapshot.val();
      const entries = [];

      for (const date in data) {
        for (const time in data[date]) {
          const record = data[date][time];
          entries.push({ datetime: `${date} ${time}`, ...record });
        }
      }

      entries.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      const latest = entries[entries.length - 1];

      const pos = [parseFloat(latest.lat), parseFloat(latest.lon)];
      const color = gatewayColors[sensor];

      if (!markers[sensor]) {
        markers[sensor] = L.circleMarker(pos, {
          radius: 8,
          color: "#fff",
          fillColor: color,
          fillOpacity: 1,
          weight: 1
        }).addTo(map);

        markers[sensor].bindPopup(`
          <strong>Trạm:</strong> ${latest.module}<br>
          <strong>Thời gian:</strong> ${latest.datetime}<br>
          <strong>Nhiệt độ:</strong> ${latest.temp}°C<br>
          <strong>Độ ẩm:</strong> ${latest.hum}%<br>
          <strong>PM2.5:</strong> ${latest.pm25} µg/m³
        `);

        markers[sensor].on("mouseover", function () {
          this.openPopup();
        });

        markers[sensor].on("mouseout", function () {
          this.closePopup();
        });
      } else {
        markers[sensor].setLatLng(pos);
      }

      if (circles[sensor]) {
        circles[sensor].remove();
      }

      circles[sensor] = L.circle(pos, {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: 100
      }).addTo(map);
    });
  });
}
