async function fetchSensorData() {
  const res = await fetch('/api/sensors');
  return await res.json();
}

async function fetchImageData() {
  const res = await fetch('/api/images');
  return await res.json();
}

function renderSensorChart(data) {
  const labels = data.map(d => new Date(d.timestamp).toLocaleString());
  const temperature = data.map(d => d.temperature);
  const humidity = data.map(d => d.humidity);
  const moisture = data.map(d => d.moisture);

  new Chart(document.getElementById('sensorChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperature,
          borderColor: '#e53935',
          fill: false
        },
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: '#1e88e5',
          fill: false
        },
        {
          label: 'Soil Moisture (%)',
          data: moisture,
          borderColor: '#43a047',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Sensor Trends Over Time' }
      }
    }
  });
}

function renderHealthSummary(images) {
  const summary = images.map(img => `
    <p>
      🖼️ <strong>Image:</strong> ${img.imageUrl}<br>
      🌿 <strong>Status:</strong> ${img.healthStatus}<br>
      💡 <strong>Recommendation:</strong> ${img.recommendation}<br>
      📅 <strong>Date:</strong> ${new Date(img.timestamp).toLocaleString()}
    </p>
    <hr>
  `).join('');
  document.getElementById('healthSummary').innerHTML = summary;
}

(async () => {
  const sensorData = await fetchSensorData();
  const imageData = await fetchImageData();
  renderSensorChart(sensorData);
  renderHealthSummary(imageData);
})();
