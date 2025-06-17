// ✅ encuestas-analisis.js con animación y resultados como la encuesta de presentación

// Función para actualizar los resultados de una encuesta de análisis
export function updateAnalysisResults(survey, data) {
    const votos = Object.values(data).map(d => d.respuesta);
    const total = votos.length;
    
    const opciones = survey.querySelectorAll('.option-analysis');
    opciones.forEach(op => {
        const valor = op.dataset.value;
        const cantidad = votos.filter(v => v === valor).length;
        const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0;

        const bar = op.querySelector('.bar-analysis');
        if (bar) {
            // Animar el cambio de ancho de la barra
            bar.style.transition = 'width 0.5s ease-in-out';
            bar.style.width = `${porcentaje}%`;
            bar.style.opacity = '1';
            op.querySelector('.percentage-analysis').style.display = 'inline-block';
        }

        const perc = op.querySelector('.percentage-analysis');
        if (perc) {
            perc.textContent = `${porcentaje}%`;
        }
    });
}

// Función para votar en una encuesta de análisis
export async function voteAnalysis(surveyId, optionValue) {
    const survey = document.querySelector(`.ia-survey-analysis#${surveyId}`);
    if (!survey) return;

    if (survey.classList.contains('voted')) return;

    const encuestaRef = ref(db, `encuestas_analisis/${surveyId}`);

    try {
        // Registrar voto
        await push(encuestaRef, {
            respuesta: optionValue,
            timestamp: Date.now(),
            fecha: new Date().toISOString()
        });

        // Guardar en localStorage que se votó esta encuesta
        localStorage.setItem(`voted_${surveyId}`, 'true');

        // Marcar como votado
        survey.classList.add('voted');
        survey.querySelectorAll('.option-analysis').forEach(opt => {
            opt.classList.add('voted');
            opt.querySelector('.bar-analysis').style.opacity = '1';
            opt.querySelector('.percentage-analysis').style.display = 'inline-block';
        });

        // Mostrar mensaje de confirmación
        const confirmation = document.createElement('div');
        confirmation.textContent = '¡Voto registrado!';
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2f8127;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.remove();
        }, 3000);

    } catch (error) {
        console.error('Error al registrar el voto:', error);
        alert('Error al registrar el voto. Por favor, intenta de nuevo.');
    }
}

// Función para mostrar resultados de todas las encuestas de análisis
export function showAnalysisResults() {
    const surveys = document.querySelectorAll('.ia-survey-analysis');
    surveys.forEach(survey => {
        const id = survey.id;
        const encuestaRef = ref(db, `encuestas_analisis/${id}`);
        onValue(encuestaRef, snapshot => {
            const data = snapshot.val() || {};
            updateAnalysisResults(survey, data);
        });
    });
}

// Inicializar encuestas cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar resultados actuales
    showAnalysisResults();

    // Configurar eventos de clic para todas las opciones
    const opciones = document.querySelectorAll('.option-analysis');
    opciones.forEach(option => {
        option.addEventListener('click', () => {
            const surveyId = option.closest('.ia-survey-analysis').id;
            const optionValue = option.dataset.value;
            voteAnalysis(surveyId, optionValue);
        });
    });
});
