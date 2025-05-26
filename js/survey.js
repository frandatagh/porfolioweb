// Datos iniciales
let votes = [0, 0, 0, 0, 0]; // Para las 5 opciones
const totalVotes = () => votes.reduce((a, b) => a + b, 0);

// Inicializar gráfico de líneas
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: ['1. Poco uso', '2. Mucho uso', '3. Nada aún', '4. Menos deseado', '5. Dependo de IA'],
    datasets: [{
      label: 'Votos',
      data: votes,
      borderColor: '#4a6bdf',
      backgroundColor: 'rgba(74, 107, 223, 0.1)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#4a6bdf',
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Función para votar
function vote(optionIndex) {
  votes[optionIndex - 1]++;
  updateSurvey();
  lineChart.update();
  
  // Guardar en localStorage (opcional)
  localStorage.setItem('iaSurveyVotes', JSON.stringify(votes));
}

// Actualizar porcentajes y gráfico
function updateSurvey() {
  const total = totalVotes();
  document.querySelectorAll('.option').forEach((opt, i) => {
    const percent = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
    opt.querySelector('.percentage').textContent = `${percent}%`;
    
    // Destacar la opción más votada
    opt.style.background = votes[i] === Math.max(...votes) 
      ? 'rgba(74, 107, 223, 0.1)' 
      : '#f5f7fa';
  });
}

// Cargar datos guardados
if (localStorage.getItem('iaSurveyVotes')) {
  votes = JSON.parse(localStorage.getItem('iaSurveyVotes'));
  updateSurvey();
  lineChart.data.datasets[0].data = votes;
  lineChart.update();
}