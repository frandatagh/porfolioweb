{{ ... }}
// Funcionalidad del carrusel de encuestas
let currentSurveyIndex = 0;
const surveyItems = document.querySelectorAll('.carousel-item');
const surveyResults = [];

// Función para mostrar la encuesta actual
function showCurrentSurvey() {
    surveyItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSurveyIndex) {
            item.classList.add('active');
        }
    });
}

// Función para mover al siguiente carrusel
function nextSurvey() {
    if (currentSurveyIndex < surveyItems.length - 1) {
        currentSurveyIndex++;
        showCurrentSurvey();
    }
}

// Función para mover al carrusel anterior
function prevSurvey() {
    if (currentSurveyIndex > 0) {
        currentSurveyIndex--;
        showCurrentSurvey();
    }
}

// Función para votar
function vote(value) {
    const currentSurvey = document.querySelector('.carousel-item.active');
    const surveyTitle = currentSurvey.querySelector('.survey-title').textContent;
    
    // Almacenar el resultado
    surveyResults.push({
        question: surveyTitle,
        answer: value
    });
    
    // Actualizar la barra de progreso
    const bar = currentSurvey.querySelector('.bar');
    bar.style.width = '100%';
    
    // Mostrar el siguiente carrusel
    nextSurvey();
}

// Función para abrir el modal de más encuestas
function openMoreSurveys() {
    // Aquí puedes implementar la lógica para abrir el modal o redirigir a otra página
    console.log('Abriendo modal de más encuestas');
}

// Inicializar el carrusel
showCurrentSurvey();

// Mostrar resultados cuando lleguemos a la última encuesta
document.addEventListener('DOMContentLoaded', () => {
    const resultsList = document.getElementById('results-list');
    if (resultsList) {
        surveyResults.forEach(result => {
            const li = document.createElement('li');
            li.textContent = `${result.question}: ${result.answer}`;
            resultsList.appendChild(li);
        });
    }
});
{{ ... }}
