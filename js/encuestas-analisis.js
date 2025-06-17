// ✅ 1. Importar Firebase
console.log("[INIT] Importing Firebase modules");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    push,
    get
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// ✅ 2. Configuración de Firebase
console.log("[INIT] Defining Firebase config");
const firebaseConfig = {
    apiKey: "AIzaSyb-2oot9234R5YjLGdVAdCzGHBGVztn_54",
    authDomain: "mi-porfolio-82320.firebaseapp.com",
    projectId: "mi-porfolio-82320",
    storageBucket: "mi-porfolio-82320.appspot.com",
    messagingSenderId: "41594952743",
    appId: "1:41594952743:web:e87df8b1159d2f0b5e1c42"
};

// ✅ 3. Inicializar Firebase y base de datos
console.log("[INIT] Initializing Firebase app");
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ 4. Función para actualizar resultados
function updateAnalysisResults(survey, data) {
    console.log("[updateAnalysisResults] Updating results for survey:", survey.id);
    const votos = Object.values(data).map(d => d.respuesta);
    const total = votos.length;
    console.log("[updateAnalysisResults] Total votes:", total);

    const opciones = survey.querySelectorAll('.option-analysis');
    opciones.forEach(op => {
        const valor = op.dataset.value;
        const cantidad = votos.filter(v => v === valor).length;
        const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0;

        console.log(`→ ${valor}: ${cantidad} votos (${porcentaje}%)`);

        const bar = op.querySelector('.bar-analysis');
        const perc = op.querySelector('.percentage-analysis');
        const label = op.querySelector('.label-analysis');
        const description = op.querySelector('.description-analysis');

        const hasVoted = survey.classList.contains('voted') || localStorage.getItem(`voted_${survey.id}`) === 'true';

        if (hasVoted) {
            if (perc) {
                perc.textContent = `${porcentaje}%`;
                perc.style.display = 'inline-block';
            }
            if (bar) {
                bar.style.transition = 'width 0.6s ease';
                bar.style.width = `${porcentaje}%`;
            }
            if (description) description.style.display = 'none';
            if (label) label.style.opacity = '1';
        } else {
            if (perc) perc.style.display = 'none';
            if (bar) bar.style.width = '0%';
            if (label) label.style.opacity = '0.6';
        }
    });
}

// ✅ 5. Función para votar
async function voteAnalysis(surveyId, optionValue) {
    console.log(`[voteAnalysis] Votando en ${surveyId} con opción:`, optionValue);
    const survey = document.querySelector(`.ia-survey-analysis#${surveyId}`);
    if (!survey || survey.classList.contains('voted')) {
        console.warn(`[voteAnalysis] Encuesta no encontrada o ya votada: ${surveyId}`);
        return;
    }

    const encuestaRef = ref(db, `encuestas_analisis/${surveyId}`);

    try {
        await push(encuestaRef, {
            respuesta: optionValue,
            timestamp: Date.now(),
            fecha: new Date().toISOString()
        });

        console.log("[voteAnalysis] Voto registrado en Firebase");

        localStorage.setItem(`voted_${surveyId}`, 'true');
        survey.classList.add('voted');
        survey.querySelectorAll('.option-analysis').forEach(opt => {
            opt.classList.add('voted');
            opt.querySelector('.bar-analysis').style.opacity = '1';

            const perc = opt.querySelector('.percentage-analysis');
            if (perc) perc.style.display = 'inline-block';

            if (opt.dataset.value === optionValue) {
                opt.classList.add('selected');
            }
        });

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
        setTimeout(() => confirmation.remove(), 2000);

        console.log("[voteAnalysis] Solicitando resultados actualizados...");
        const snapshot = await get(encuestaRef);
        const data = snapshot.val() || {};
        updateAnalysisResults(survey, data);

        setTimeout(() => {
            const next = survey.closest('.slide').nextElementSibling;
            if (next && next.classList.contains('slide')) {
                document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
                next.classList.add('active');
                console.log(`[voteAnalysis] Avanzando a la siguiente encuesta`);
            }
        }, 3000);

    } catch (error) {
        console.error('Error al registrar el voto:', error);
        alert('Error al registrar el voto. Por favor, intenta de nuevo.');
    }
}

// ✅ 6. Mostrar resultados de todas las encuestas
function showAnalysisResults() {
    console.log("[showAnalysisResults] Ejecutando showAnalysisResults()");
    const surveys = document.querySelectorAll('.ia-survey-analysis');
    surveys.forEach(survey => {
        const id = survey.id;
        const encuestaRef = ref(db, `encuestas_analisis/${id}`);
        console.log(`→ Leyendo datos de Firebase para: ${id}`);

        onValue(encuestaRef, snapshot => {
            const data = snapshot.val() || {};
            const hasVoted = localStorage.getItem(`voted_${id}`) === 'true';

            console.log(`→ hasVoted (${id}):`, hasVoted);

            if (hasVoted) {
                updateAnalysisResults(survey, data);
            }
        }, {
            onlyOnce: true
        });
    });
}

// ✅ 7. Inicializar encuestas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    console.log("[DOMContentLoaded] Iniciando encuestas");
    showAnalysisResults();

    const opciones = document.querySelectorAll('.option-analysis');
    opciones.forEach(option => {
        option.addEventListener('click', () => {
            const surveyId = option.closest('.ia-survey-analysis').id;
            const optionValue = option.dataset.value;
            console.log(`[CLICK] Survey: ${surveyId}, Opción: ${optionValue}`);
            voteAnalysis(surveyId, optionValue);
        });
    });
});

export { voteAnalysis, showAnalysisResults };
