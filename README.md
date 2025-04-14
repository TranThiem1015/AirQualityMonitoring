# AirQualityMonitoring
A real-time air quality monitoring website that displays environmental data sent from STM32 (via UART) to ESP8266, then uploaded to Firebase and visualized on a modern web interface with maps and charts.

**Demo: https://airqualityesp.web.app**

## 📡 Features
- Real-time data from STM32 via ESP8266
- Google Maps integration with geolocation markers
- Air quality sensor data: PM2.5, Temperature, Humidity
- Interactive Chart.js graphs
- Firebase Hosting + Firestore database
- Device timestamp, location, and status monitoring
- Export to CSV feature (optional)

## 🧹 Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: Google Maps API, Chart.js
- **Backend**: Firebase (Firestore, Hosting)
- **Hardware**: STM32 + ESP8266 (NodeMCU or equivalent)

## 📁 Project Structure

```
BTL/public/
├── index.html            # Main webpage layout
├── css/
│   ├──styles.css            # Styling rules for layout, map, panels
├── js/
│   ├── app.js            # Main script to initialize and connect components
│   ├── map.js            # Handles Google Maps rendering
│   ├── chart.js          # Creates and updates chart visuals
│   ├── data.js           # Handles incoming sensor data parsing
│   ├── config.js         # Contains API keys and config
│   └── utils.js          # Utility functions (date formatting, etc.)
└── firebase.json         # Firebase Hosting configuration
```


## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/TranThiem1015/AirQualityMonitoring.git
cd AirQualityMonitoring
```

### 2. Firebase Setup

- Run `firebase login` if not logged in.
- Then initialize:
```bash
firebase init
```
- Choose `Hosting`, then set `public` directory as `/`, and configure as a SPA if needed.
- To deploy:
```bash
firebase deploy
```

### 3. Google Maps API Key

- Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
- Add your key in `index.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

### 4. Hardware Setup

- STM32 sends environmental data via UART
- ESP8266 receives, parses, and pushes to Firebase
- Data format:
```
{
  "sensor_1": {
    "04-04-2025": {
      "06:15:00": {
        "module": "GATEWAY01",
        "lat": 10.762622,
        "lon": 106.660172,
        "temp": 26.2,
        "hum": 64,
        "pm25": 33.4
      },
      "08:00:00": {
        "module": "GATEWAY01",
        "lat": 10.762622,
        "lon": 106.660172,
        "temp": 27.4,
        "hum": 60,
        "pm25": 38
      }
    }
  },
  "sensor_2": {
    "04-04-2025": {
      "07:00:00": {
        "module": "GATEWAY02",
        "lat": 10.762900,
        "lon": 106.661000,
        "temp": 25.8,
        "hum": 67,
        "pm25": 30.1
      }
    }
  }
}

```

## 📊 Example Data View

- Map shows markers for each module/device.
- Chart with history.
- Internet status is shown and reported back to STM32.

## 🛆 Dependencies

- [Chart.js](https://www.chartjs.org/)
- [Google Maps JS API](https://developers.google.com/maps/documentation/javascript/overview)
- [Firebase JS SDK](https://firebase.google.com/)

## 📜 License

Feel free to use, modify, and share.

---

> Made with ❤️ by [Trần Thị Thiêm]

