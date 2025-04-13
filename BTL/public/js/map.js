// map.js - Google Maps handling functions

let map;
const markers = {};
const infoWindows = {};
const circles = {};


function initMap() {
  const defaultLocation = { lat: 10.762622, lng: 106.660172 }; // Bách Khoa HCM
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: defaultLocation
  });

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

      const pos = { lat: parseFloat(latest.lat), lng: parseFloat(latest.lon) };

      if (!markers[sensor]) {
        markers[sensor] = new google.maps.Marker({
          position: pos,
          map,
          icon: getMarkerIcon(gatewayColors[sensor])
        });
        infoWindows[sensor] = new google.maps.InfoWindow();
      } else {
        markers[sensor].setPosition(pos);
      }

      const content = `
        <div>
          <strong>Trạm:</strong> ${latest.module}<br>
          <strong>Thời gian:</strong> ${latest.datetime}<br>
          <strong>Nhiệt độ:</strong> ${latest.temp}°C<br>
          <strong>Độ ẩm:</strong> ${latest.hum}%<br>
          <strong>PM2.5:</strong> ${latest.pm25} µg/m³
        </div>
      `;

      markers[sensor].addListener("mouseover", () => {
        infoWindows[sensor].setContent(content);
        infoWindows[sensor].open(map, markers[sensor]);
      });

      markers[sensor].addListener("mouseout", () => {
        infoWindows[sensor].close();
      });

      if (circles[sensor]) circles[sensor].setMap(null);
      circles[sensor] = new google.maps.Circle({
        strokeColor: gatewayColors[sensor],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: gatewayColors[sensor],
        fillOpacity: 0.25,
        map,
        center: pos,
        radius: 100
      });
    });
  });
}

function getMarkerIcon(color) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 1,
    scale: 7
  };
}

