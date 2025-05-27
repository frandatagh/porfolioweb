import { getDatabase, ref, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { app } from './firebase-config.js';

const db = getDatabase(app);
let hasVoted = false; // bandera para evitar votos múltiples en una sesión

// Función para registrar el voto
export const vote = async (value) => {
  if (hasVoted) return; // evita votos múltiples en la misma sesión

  try {
    const voteRef = ref(db, 'survey/' + value);
    const snapshot = await get(voteRef);
    const count = snapshot.exists() ? snapshot.val() : 0;

    await update(ref(db, 'survey'), {
      [value]: count + 1
    });

    hasVoted = true;
    showResults(); // muestra resultados después de votar
  } catch (error) {
    console.error("Error al registrar el voto:", error);
  }
};

// Función para mostrar los resultados después del voto
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

      if (percentageEl) percentageEl.textContent = `${percent}%`;
      if (barEl) barEl.style.width = `${percent}%`;
    });
  }, {
    onlyOnce: true // solo una vez al mostrar resultados después de votar
  });
};
