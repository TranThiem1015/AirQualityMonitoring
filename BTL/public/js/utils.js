// utils.js - Shared utility functions

// Format a JavaScript Date object into "dd-mm-yyyy" format
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format a JavaScript Date object into "dd-mm-yyyy hh:mm" format
function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hour}:${minute}`;
}

// Initialize the flatpickr date picker based on selected query type (range or oneDay)
function handleQueryTypeChange() {
  const type = document.getElementById("queryTypeSelect").value;
  const input = document.getElementById("dateRange");

  flatpickr(input, {
    dateFormat: "d-m-Y",
    mode: type === "range" ? "range" : "single",
    onChange: function (selectedDates) {
      if (type === "range" && selectedDates.length === 2) {
        input.value = `${formatDate(selectedDates[0])} to ${formatDate(selectedDates[1])}`;
      } else if (type === "oneDay" && selectedDates.length === 1) {
        input.value = formatDate(selectedDates[0]);
      }
    }
  });
}

// Return a predefined color string based on index, used for assigning consistent chart colors
function getColorByIndex(index) {
  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
  ];
  return colors[index % colors.length];
}
