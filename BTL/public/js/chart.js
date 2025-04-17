// chart.js - Chart.js handling functions

let chart; // Global variable to hold the chart instance

/**
 * Renders a line chart displaying PM2.5, temperature, and humidity data.
 * @param {Array} data - Array of measurement objects containing date, time, temp, hum, and pm25.
 * @param {String|null} selectedHour - The hour selected for filtering (optional).
 */
function renderChart(data, selectedHour) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Check if data is available
  if (data.length === 0) {
    alert("Không tìm thấy dữ liệu cho thời gian đã chọn!"); // Alert user if no data
    return;
  }

  // Sort data chronologically by combining date and time
  data.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  // Generate labels for the X-axis using date and time
  const labels = data.map(item => `${item.date} ${item.time}`);

  // Define datasets for PM2.5, temperature, and humidity
  const datasets = [
    {
      label: "PM2.5 (µg/m³)",
      data: data.map(item => item.pm25),
      borderColor: getColorByIndex(2),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4,     // Curve of the line
      pointRadius: 4    // Size of points on the line
    },
    {
      label: "Nhiệt độ (°C)",
      data: data.map(item => item.temp),
      borderColor: getColorByIndex(0),
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderWidth: 0,    // No line
      pointRadius: 0,    // No point
      showLine: false,   // Disable line drawing
      fill: false
    },
    {
      label: "Độ ẩm (%)",
      data: data.map(item => item.hum),
      borderColor: getColorByIndex(1),
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderWidth: 0,
      pointRadius: 0,
      showLine: false,
      fill: false
    }
  ];

  // Destroy the old chart instance before creating a new one (to prevent overlapping)
  if (chart) chart.destroy();

  // Create and render a new chart
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true, // Make chart responsive to screen size
      scales: {
        x: {
          title: {
            display: true,
            text: 'Thời gian' // Label for X-axis
          }
        },
        y: {
          title: {
            display: true,
            text: 'PM2.5 (µg/m³)' // Label for Y-axis
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: selectedHour 
            ? `Chỉ số PM2.5 - Giờ ${selectedHour}:00` 
            : 'Chỉ số PM2.5' // Dynamic title based on hour
        },
        tooltip: {
          mode: 'index',
          intersect: false // Show tooltip for all datasets at the same X point
        },
        legend: {
          display: true // Show dataset legend
        }
      }
    }
  });

  // Display the latest record's values below the chart
  const latestData = data[data.length - 1];
  document.getElementById("latestInfo").innerHTML = `
    Thời gian: ${latestData.date} ${latestData.time}<br>
    Nhiệt độ: ${latestData.temp}°C<br>
    Độ ẩm: ${latestData.hum}%<br>
    PM2.5: ${latestData.pm25} µg/m³
  `;
}
