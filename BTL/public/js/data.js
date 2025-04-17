// data.js - Firebase data handling functions

// Fetch and display the latest sensor data from Firebase
function updateLatestInfo() {
  const sensor = document.getElementById("gatewaySelect").value;
  
  // Get the entire data tree for the selected sensor
  db.ref(sensor).once("value", snapshot => {
    const data = snapshot.val();
    const entries = [];

    // Flatten the date-time structure into a single array of entries
    for (const date in data) {
      for (const time in data[date]) {
        const record = data[date][time];
        entries.push({ datetime: `${date} ${time}`, ...record });
      }
    }

    // Sort entries by datetime and display the latest one
    entries.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    const latest = entries[entries.length - 1];

    // Update HTML with the latest data
    document.getElementById("latestInfo").innerHTML = `
      Thời gian: ${latest.datetime}<br>
      Nhiệt độ: ${latest.temp}°C<br>
      Độ ẩm: ${latest.hum}%<br>
      PM2.5: ${latest.pm25} µg/m³
    `;
  });
}

// Fetch and process chart data from Firebase based on selected date range and hour
function updateChartData() {
  const queryType = document.getElementById('queryTypeSelect').value;
  const dateRangeInput = document.getElementById('dateRange').value;
  const selectedHour = document.getElementById("selectedHour").value;
  const selectedSensor = document.getElementById('gatewaySelect').value;

  // Validate date input
  if (!dateRangeInput) {
    alert("Vui lòng chọn ngày!");
    return;
  }

  // Prepare list of dates based on selected mode (single or range)
  let dates = [];
  if (queryType === 'range') {
    const rangeParts = dateRangeInput.split(' to ');
    if (rangeParts.length !== 2) {
      alert("Vui lòng chọn khoảng ngày hợp lệ!");
      return;
    }

    const startDate = new Date(rangeParts[0]);
    const endDate = new Date(rangeParts[1]);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(formatDate(d));
    }
  } else {
    dates = [dateRangeInput];
  }

  console.log("Selected dates:", dates);
  console.log("Selected hour:", selectedHour);

  let allData = [];
  let processedDates = 0;

  // Fetch data for each date
  dates.forEach(date => {
    console.log(`Fetching data for date: ${date}`);
    db.ref(selectedSensor).child(date).once('value')
      .then(snapshot => {
        const dateData = snapshot.val();
        processedDates++;

        if (dateData) {
          console.log(`Data found for ${date}:`, dateData);

          // If a specific hour is selected, filter data by that hour
          if (selectedHour) {
            const hourPrefix = selectedHour;
            const exactTime = `${hourPrefix}:00:00`;

            if (dateData[exactTime]) {
              // Exact match found
              allData.push({ date: date, time: exactTime, ...dateData[exactTime] });
            } else {
              // Look for any time within the selected hour
              Object.keys(dateData).forEach(timeKey => {
                if (timeKey.startsWith(hourPrefix)) {
                  allData.push({ date: date, time: timeKey, ...dateData[timeKey] });
                }
              });

              // If no time starts with the hour, find the closest hour
              if (!Object.keys(dateData).some(t => t.startsWith(hourPrefix))) {
                let nearestTime = null;
                let minDiff = Infinity;
                const targetHour = parseInt(hourPrefix);

                Object.keys(dateData).forEach(timeKey => {
                  const timeHour = parseInt(timeKey.split(':')[0]);
                  const diff = Math.abs(timeHour - targetHour);
                  if (diff < minDiff) {
                    minDiff = diff;
                    nearestTime = timeKey;
                  }
                });

                if (nearestTime) {
                  allData.push({ date: date, time: nearestTime, ...dateData[nearestTime] });
                }
              }
            }
          } else {
            // No hour selected, include all data for the date
            Object.keys(dateData).forEach(timeKey => {
              allData.push({ date: date, time: timeKey, ...dateData[timeKey] });
            });
          }
        } else {
          console.log(`No data found for date ${date}`);
        }

        // Update the chart when all dates are processed
        if (processedDates === dates.length) {
          console.log("All data processed, updating chart with:", allData);
          renderChart(allData, selectedHour);
        }
      })
      .catch(error => {
        console.error(`Error fetching data for ${date}:`, error);
        processedDates++;
        if (processedDates === dates.length) {
          renderChart(allData, selectedHour);
        }
      });
  });
}

// Download all sensor data as a CSV file
function downloadAllData() {
  const selectedSensor = document.getElementById('gatewaySelect').value;
  const downloadButton = document.getElementById('downloadCSVButton');

  // Indicate loading state on the button
  const originalButtonText = downloadButton.textContent;
  downloadButton.textContent = 'Đang tải dữ liệu...';
  downloadButton.disabled = true;

  // Fetch all available data for the selected sensor
  db.ref(selectedSensor).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      const allData = [];

      // Flatten the nested date/time structure
      for (const date in data) {
        for (const time in data[date]) {
          const record = data[date][time];
          allData.push({ date, time, ...record });
        }
      }

      // Sort data by datetime
      allData.sort((a, b) => {
        const dateTimeA = new Date(`${a.date.split('-').reverse().join('-')}T${a.time}`);
        const dateTimeB = new Date(`${b.date.split('-').reverse().join('-')}T${b.time}`);
        return dateTimeA - dateTimeB;
      });

      if (allData.length === 0) {
        alert('Không có dữ liệu để tải!');
        downloadButton.textContent = originalButtonText;
        downloadButton.disabled = false;
        return;
      }

      // Export to CSV
      downloadCSV(allData, selectedSensor);
      downloadButton.textContent = originalButtonText;
      downloadButton.disabled = false;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu: ' + error.message);
      downloadButton.textContent = originalButtonText;
      downloadButton.disabled = false;
    });
}

// Convert data to CSV format and trigger file download
function downloadCSV(data, sensorName) {
  // Add UTF-8 BOM for correct encoding in Excel
  let csvContent = '\uFEFF';

  // Add headers (in Vietnamese)
  csvContent += 'Ngày,Giờ,Nhiệt độ (°C),Độ ẩm (%),PM2.5 (µg/m³),Vĩ độ,Kinh độ,Module\n';

  // Add data rows
  data.forEach(item => {
    const row = [
      item.date,
      item.time,
      item.temp,
      item.hum,
      item.pm25,
      item.lat,
      item.lon,
      item.module
    ];
    csvContent += row.join(',') + '\n';
  });

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${sensorName}_data_${formatDate(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
