// Register Farmer
document.getElementById('farmer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const farmer = {
    name: form.name.value,
    location: form.location.value,
    contact: form.contact.value,
  };

  const res = await fetch('/api/farmers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(farmer),
  });

  const result = await res.json();
  localStorage.setItem('farmerId', result._id);
  alert('Farmer registered successfully!');
});

// Submit Sensor Data
document.getElementById('sensor-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const sensor = {
    temperature: form.temperature.value,
    humidity: form.humidity.value,
    moisture: form.moisture.value,
    farmerId: localStorage.getItem('farmerId'),
  };

  const res = await fetch('/api/sensors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sensor),
  });

  const result = await res.json();
  alert('Sensor data submitted!');
});

// Run ML Analysis
function runML() {
  const temp = parseFloat(document.querySelector('input[name="temperature"]').value);
  const humidity = parseFloat(document.querySelector('input[name="humidity"]').value);
  const moisture = parseFloat(document.querySelector('input[name="moisture"]').value);

  if (isNaN(temp) || isNaN(humidity) || isNaN(moisture)) {
    alert('Please enter valid sensor data.');
    return;
  }

  const trainingData = tf.tensor2d([
    [25, 60, 40],
    [30, 70, 30],
    [35, 80, 20],
  ]);

  const outputData = tf.tensor2d([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 5, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  model.fit(trainingData, outputData, { epochs: 100 }).then(() => {
    const input = tf.tensor2d([[temp, humidity, moisture]]);
    const prediction = model.predict(input);
    prediction.array().then(result => {
      const index = result[0].indexOf(Math.max(...result[0]));
      const healthStatus = ['Healthy 🌱', 'Moderate 🌾', 'Unhealthy 🥀'][index];
      document.getElementById('ml-result').innerText = `Crop Health Status: ${healthStatus}`;
    });
  });
}

function typeWriterEffect(element, text, speed = 30) {
  element.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

async function analyzeImage() {
  const fileInput = document.getElementById('crop-image');
  const file = fileInput.files[0];
  const preview = document.getElementById('image-preview');
  const resultBox = document.getElementById('analysis-result');
  const farmerId = localStorage.getItem('farmerId');

  // Clear previous results
  preview.innerHTML = '';
  resultBox.innerHTML = '';

  if (!file) return resultBox.innerText = '❌ Please select an image.';
  if (!farmerId) return resultBox.innerText = '❌ Please register a farmer first.';

  // Use ML result if available
  const mlResult = document.getElementById('ml-result').innerText;
  let healthStatus = 'Unknown';
  let recommendation = 'No recommendation available';

  if (mlResult.includes('Healthy')) {
    healthStatus = 'Healthy';
    recommendation = 'Continue regular care';
  } else if (mlResult.includes('Moderate')) {
    healthStatus = 'Moderate';
    recommendation = 'Monitor soil and adjust watering';
  } else if (mlResult.includes('Unhealthy')) {
    healthStatus = 'Diseased';
    recommendation = 'Apply pesticide and check for fungal spread';
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('farmerId', farmerId);
  formData.append('healthStatus', healthStatus);
  formData.append('recommendation', recommendation);

  try {
    const res = await fetch('/api/images/analyze', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    preview.innerHTML = `<img src="${result.image.imageUrl}" alt="Crop Image" style="max-width: 300px;" />`;
 const resultText = `🩺 Health Status: ${result.image.healthStatus}\n📋 Recommendation: ${result.image.recommendation}`;
typeWriterEffect(resultBox, resultText);

  } catch (err) {
    console.error('Image analysis failed:', err);
    resultBox.innerText = '❌ Failed to analyze image. Please try again.';
  }
}

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = '#00f7ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
