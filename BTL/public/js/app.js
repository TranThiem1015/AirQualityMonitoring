// app.js - Main application initialization

// Initialize the date picker on page load
document.addEventListener('DOMContentLoaded', function() {
    handleQueryTypeChange();
    
    // Initialize flatpickr with default settings
    flatpickr("#dateRange", {
      dateFormat: "d-m-Y"
    });
    
    // Set up event listeners
    document.getElementById('displayButton').addEventListener('click', updateChartData);
    document.getElementById('downloadCSVButton').addEventListener('click', downloadAllData);
    document.getElementById('queryTypeSelect').addEventListener('change', handleQueryTypeChange);
    document.getElementById('gatewaySelect').addEventListener('change', updateLatestInfo);
  });
  
  // Note: initMap is called by the Google Maps API when it loads
  // This is specified in the callback parameter in the script tag