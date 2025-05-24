// Datos iniciales (puedes cargarlos desde localStorage o una API)
let surveyData = [0, 0, 0, 0, 0]; // Corresponden a las 5 opciones

// Configuración del gráfico
const ctx = document.getElementById('surveyChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [
      '1. Poco uso', 
      '2. Mucho uso', 
      '3. Nada aún', 
      '4. Menos de lo deseado', 
      '5. Dependo de IA'
    ],
    datasets: [{
      label: 'Votos',
      data: surveyData,
      backgroundColor: [
        '#FF6384', // Rojo
        '#36A2EB', // Azul
        '#FFCE56', // Amarillo
        '#4BC0C0', // Turquesa
        '#9966FF'  // Morado
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

// Función para votar
function vote(optionIndex) {
  surveyData[optionIndex - 1]++; // Suma 1 al voto seleccionado (las opciones son 1-5)
  chart.update(); // Actualiza el gráfico
  
  // Opcional: Guardar en localStorage o enviar a una API
  localStorage.setItem('iaSurveyData', JSON.stringify(surveyData));
  
  // Mensaje de agradecimiento
  alert('¡Gracias por participar! Tu respuesta ha sido registrada.');
}

// Cargar datos guardados al inicio (opcional)
if (localStorage.getItem('iaSurveyData')) {
  surveyData = JSON.parse(localStorage.getItem('iaSurveyData'));
  chart.data.datasets[0].data = surveyData;
  chart.update();
}