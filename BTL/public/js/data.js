// data.js - Firebase data handling functions

function updateLatestInfo() {
    const sensor = document.getElementById("gatewaySelect").value;
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
      document.getElementById("latestInfo").innerHTML = `
        Thời gian: ${latest.datetime}<br>
        Nhiệt độ: ${latest.temp}°C<br>
        Độ ẩm: ${latest.hum}%<br>
        PM2.5: ${latest.pm25} µg/m³
      `;
    });
  }
  
  function updateChartData() {
    const queryType = document.getElementById('queryTypeSelect').value;
    const dateRangeInput = document.getElementById('dateRange').value;
    const selectedHour = document.getElementById("selectedHour").value;
    const selectedSensor = document.getElementById('gatewaySelect').value;
  
    // Fix empty date input
    if (!dateRangeInput) {
      alert("Vui lòng chọn ngày!");
      return;
    }
  
    // Parse date range
    let dates = [];
    if (queryType === 'range') {
      const rangeParts = dateRangeInput.split(' to ');
      if (rangeParts.length !== 2) {
        alert("Vui lòng chọn khoảng ngày hợp lệ!");
        return;
      }
      
      const startDate = new Date(rangeParts[0]);
      const endDate = new Date(rangeParts[1]);
      
      // Create array of all dates in range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(formatDate(d));
      }
    } else {
      // Single date
      dates = [dateRangeInput];
    }
  
    console.log("Selected dates:", dates);
    console.log("Selected hour:", selectedHour);
    
    let allData = [];
    let processedDates = 0;
  
    // Process each date
    dates.forEach(date => {
      console.log(`Fetching data for date: ${date}`);
      db.ref(selectedSensor).child(date).once('value')
        .then(snapshot => {
          const dateData = snapshot.val();
          processedDates++;
          
          if (dateData) {
            console.log(`Data found for ${date}:`, dateData);
            
            // If hour selected, filter for that hour
            if (selectedHour) {
              const hourPrefix = selectedHour;
              
              // Look for exact time first (e.g., "10:00:00")
              const exactTime = `${hourPrefix}:00:00`;
              if (dateData[exactTime]) {
                console.log(`Exact match found at ${exactTime}`);
                allData.push({
                  date: date,
                  time: exactTime,
                  ...dateData[exactTime]
                });
              } else {
                // Otherwise look for times within that hour (e.g., "10:xx:xx")
                Object.keys(dateData).forEach(timeKey => {
                  if (timeKey.startsWith(hourPrefix)) {
                    console.log(`Hour match found at ${timeKey}`);
                    allData.push({
                      date: date,
                      time: timeKey,
                      ...dateData[timeKey]
                    });
                  }
                });
                
                // If no exact hour match, find the closest time
                if (!Object.keys(dateData).some(t => t.startsWith(hourPrefix))) {
                  console.log(`No data for hour ${hourPrefix}, finding nearest time`);
                  let nearestTime = null;
                  let minDiff = Infinity;
                  const targetHour = parseInt(hourPrefix);
                  
                  Object.keys(dateData).forEach(timeKey => {
                    const timeParts = timeKey.split(':');
                    const timeHour = parseInt(timeParts[0]);
                    const diff = Math.abs(timeHour - targetHour);
                    
                    if (diff < minDiff) {
                      minDiff = diff;
                      nearestTime = timeKey;
                    }
                  });
                  
                  if (nearestTime) {
                    console.log(`Using nearest time: ${nearestTime}`);
                    allData.push({
                      date: date,
                      time: nearestTime,
                      ...dateData[nearestTime]
                    });
                  }
                }
              }
            } else {
              // No hour filter, include all data points for this date
              Object.keys(dateData).forEach(timeKey => {
                allData.push({
                  date: date,
                  time: timeKey,
                  ...dateData[timeKey]
                });
              });
            }
          } else {
            console.log(`No data found for date ${date}`);
          }
          
          // When all dates processed, update the chart
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
  
  // Download all data as CSV
  function downloadAllData() {
    const selectedSensor = document.getElementById('gatewaySelect').value;
    const downloadButton = document.getElementById('downloadCSVButton');
    
    // Change button text to indicate loading
    const originalButtonText = downloadButton.textContent;
    downloadButton.textContent = 'Đang tải dữ liệu...';
    downloadButton.disabled = true;
    
    // Fetch all data for the selected sensor
    db.ref(selectedSensor).once('value')
      .then(snapshot => {
        const data = snapshot.val();
        const allData = [];
        
        // Parse all data into a flat array
        for (const date in data) {
          for (const time in data[date]) {
            const record = data[date][time];
            allData.push({
              date: date,
              time: time,
              ...record
            });
          }
        }
        
        // Sort data by date and time
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
  
  // Function to convert data to CSV and download with proper UTF-8 encoding
  function downloadCSV(data, sensorName) {
    // Add BOM for UTF-8 encoding recognition
    let csvContent = '\uFEFF';
    
    // Define CSV headers in Vietnamese
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
    
    // Create download link with proper encoding
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${sensorName}_data_${formatDate(new Date())}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }