// chart.js - Chart.js handling functions

let chart;

function renderChart(data, selectedHour) {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (data.length === 0) {
    alert("Không tìm thấy dữ liệu cho thời gian đã chọn!");
    return;
  }

  data.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const labels = data.map(item => `${item.date} ${item.time}`);

  const datasets = [
    {
      label: "PM2.5 (µg/m³)",
      data: data.map(item => item.pm25),
      borderColor: getColorByIndex(2),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 4
    },
    {
      label: "Nhiệt độ (°C)",
      data: data.map(item => item.temp),
      borderColor: getColorByIndex(0),
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderWidth: 0,         // Không vẽ đường
      pointRadius: 0,         // Không vẽ điểm
      showLine: false,        // Không vẽ line
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

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Thời gian'
          }
        },
        y: {
          title: {
            display: true,
            text: 'PM2.5 (µg/m³)'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: selectedHour ? `Chỉ số PM2.5 - Giờ ${selectedHour}:00` : 'Chỉ số PM2.5'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: true
        }
      }
    }
  });

  const latestData = data[data.length - 1];
  document.getElementById("latestInfo").innerHTML = `
    Thời gian: ${latestData.date} ${latestData.time}<br>
    Nhiệt độ: ${latestData.temp}°C<br>
    Độ ẩm: ${latestData.hum}%<br>
    PM2.5: ${latestData.pm25} µg/m³
  `;
}