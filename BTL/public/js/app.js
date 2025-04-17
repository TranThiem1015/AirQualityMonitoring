// app.js - Main application initialization

// Wait until the full HTML document has been completely loaded and parsed
document.addEventListener('DOMContentLoaded', function() {
  initMap(); // Initialize the map with sensor markers and data
  handleQueryTypeChange(); // Set initial state for the query type selector

  // Initialize the flatpickr date picker on the input element with ID "dateRange"
  flatpickr("#dateRange", {
    dateFormat: "d-m-Y" // Set display format to Day-Month-Year
  });

  // Set up event listeners for UI buttons and selectors
  document.getElementById('displayButton').addEventListener('click', updateChartData); // Display chart on button click
  document.getElementById('downloadCSVButton').addEventListener('click', downloadAllData); // Export data as CSV
  document.getElementById('queryTypeSelect').addEventListener('change', handleQueryTypeChange); // Handle switching query types
  document.getElementById('gatewaySelect').addEventListener('change', updateLatestInfo); // Refresh data when a gateway is selected
});

// Note: initMap is also called when LeafletJS is loaded and ready
// (If you were using Google Maps, you would use the callback in the <script> tag for that instead)
