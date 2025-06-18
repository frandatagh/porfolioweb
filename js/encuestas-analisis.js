// ✅ 1. Importar Firebase
console.log("[INIT] Importing Firebase modules");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    update,
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

// ✅ 4. Función para mostrar resultados
function showAnalysisResults() {
  document.querySelectorAll('.ia-survey-analysis').forEach(survey => {
    const id = survey.id;
    const refSurvey = ref(db, `encuestas_analisis/${id}`);
    const hasVoted = localStorage.getItem(`voted_${id}`) === 'true';

    if (!hasVoted) return; // Si no se ha votado, no mostrar resultados

    onValue(refSurvey, snapshot => {
      const data = snapshot.val() || {};
      const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);

      survey.querySelectorAll('.option-analysis').forEach(option => {
        const value = option.dataset.value;
        const count = data[value] || 0;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

        const bar = option.querySelector('.bar-analysis');
        const perc = option.querySelector('.percentage-analysis');
        const label = option.querySelector('.label-analysis');

        if (perc) {
          perc.textContent = `${percent}%`;
          perc.style.display = 'inline-block';
        }
        if (bar) {
          bar.style.backgroundColor = '#2569ce';
          bar.style.transition = 'width 0.6s ease';
          bar.style.width = `${percent}%`;
        }
        if (label) {
          if (percent >= 75) label.style.color = '#0056b3';
          else if (percent >= 50) label.style.color = '#007bff';
          else if (percent >= 25) label.style.color = '#66b3ff';
          else label.style.color = '#cce5ff';
        }
      });
    }, {
      onlyOnce: true
    });
  });
}

// ✅ 5. Función para votar
async function voteAnalysis(surveyId, optionValue) {
  const survey = document.querySelector(`.ia-survey-analysis#${surveyId}`);
  if (!survey || survey.classList.contains('voted')) return;

  const optionRef = ref(db, `encuestas_analisis/${surveyId}/${optionValue}`);

  try {
    const snapshot = await get(optionRef);
    const current = snapshot.exists() ? snapshot.val() : 0;
    await update(ref(db, `encuestas_analisis/${surveyId}`), {
      [optionValue]: current + 1
    });

    localStorage.setItem(`voted_${surveyId}`, 'true');
    survey.classList.add('voted');

    // Mostrar solo los resultados de la encuesta específica
    const refSurvey = ref(db, `encuestas_analisis/${surveyId}`);
    const hasVoted = localStorage.getItem(`voted_${surveyId}`) === 'true';

    if (hasVoted) {
      onValue(refSurvey, snapshot => {
        const data = snapshot.val() || {};
        const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);

        survey.querySelectorAll('.option-analysis').forEach(option => {
          const value = option.dataset.value;
          const count = data[value] || 0;
          const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

          const bar = option.querySelector('.bar-analysis');
          const perc = option.querySelector('.percentage-analysis');
          const label = option.querySelector('.label-analysis');

          if (perc) {
            perc.textContent = `${percent}%`;
            perc.style.display = 'inline-block';
          }
          if (bar) {
            bar.style.backgroundColor = '#2569ce';
            bar.style.transition = 'width 0.6s ease';
            bar.style.width = `${percent}%`;
          }
          if (label) {
            if (percent >= 75) label.style.color = '#0056b3';
            else if (percent >= 50) label.style.color = '#007bff';
            else if (percent >= 25) label.style.color = '#66b3ff';
            else label.style.color = '#cce5ff';
          }
        });
      }, {
        onlyOnce: true
      });
    }

    const confirmation = document.createElement('div');
    confirmation.textContent = '¡Voto registrado!';
    confirmation.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(confirmation);

    // Agregar el código del slider
    setTimeout(() => {
      confirmation.remove();
      const next = survey.closest('.slide')?.nextElementSibling;
      if (next && next.classList.contains('slide')) {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        next.classList.add('active');
      }
    }, 3000);

  } catch (error) {
    console.error('Error al votar:', error);
    alert('Error al registrar el voto. Por favor, intenta nuevamente.');
  }
}

// ✅ 6. Inicializar encuestas al cargar

document.addEventListener("DOMContentLoaded", () => {
  // No llamamos a showAnalysisResults aquí
  // Los resultados solo se mostrarán después de votar

  document.querySelectorAll('.option-analysis').forEach(option => {
    option.addEventListener('click', () => {
      const surveyId = option.closest('.ia-survey-analysis').id;
      const optionValue = option.dataset.value;
      voteAnalysis(surveyId, optionValue);
    });
  });
});

export { voteAnalysis, showAnalysisResults };
