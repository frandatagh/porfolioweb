import { getDatabase, ref, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { app } from './firebase-config.js';

const db = getDatabase(app);
let hasVoted = false; // bandera para evitar votos múltiples en una sesión

// Función para registrar el voto
export const vote = async (value) => {
  if (hasVoted) return;

  try {
    const voteRef = ref(db, 'survey/' + value);
    const snapshot = await get(voteRef);
    const count = snapshot.exists() ? snapshot.val() : 0;

    await update(ref(db, 'survey'), {
      [value]: count + 1
    });

    hasVoted = true;
    localStorage.setItem("hasVoted", "true");

    // Agregar clase .voted a cada opción
    document.querySelectorAll('.option').forEach(option => {
      option.classList.add('voted');
    });

    showResults();
  } catch (error) {
    console.error("Error al registrar el voto:", error);
  }
};


// Función para mostrar resultados con animación y cambios visuales
export const showResults = () => {
  const surveyRef = ref(db, 'survey');

  onValue(surveyRef, (snapshot) => {
    const data = snapshot.val() || {};
    const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);

    document.querySelectorAll('.option').forEach(option => {
      const value = option.dataset.value;
      const count = data[value] || 0;
      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

      const percentageEl = option.querySelector('.percentage');
      const barEl = option.querySelector('.bar');
      const descriptionEl = option.querySelector('.description');

      // Solo mostrar resultados si ya se votó
      if (localStorage.getItem("hasVoted") === "true") {
        // Mostrar y animar la barra
        if (percentageEl) {
          percentageEl.textContent = `${percent}%`;
          percentageEl.style.display = 'inline';
        }

        if (barEl) {
          barEl.style.transition = 'width 0.6s ease';
          barEl.style.width = `${percent}%`;
        }

        // Ocultar descripción
        if (descriptionEl) {
          descriptionEl.style.display = 'none';
        }
      } else {
        // Ocultar todo si aún no se ha votado
        if (percentageEl) percentageEl.style.display = 'none';
        if (barEl) barEl.style.width = '0%';
      }
    });
  }, {
    onlyOnce: true
  });
};
