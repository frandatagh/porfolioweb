import { ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { db } from "../js/firebase-config.js"; // Ajustá si cambia el path

const clicksRef = ref(db, 'clicks');

// Mostrar clicks en tiempo real
onValue(clicksRef, (snapshot) => {
    const total = snapshot.val();
    if (hasClicked) {
      clickCountDisplay.textContent = total;
    }
});

// Función para sumar un click
function addClick() {
  runTransaction(clicksRef, (currentClicks) => {
    return (currentClicks || 0) + 1;
  });
}

// Asignar evento al hacer click en la imagen
const profilePic = document.getElementById('profile-pic');
if (profilePic) {
  profilePic.addEventListener('click', addClick);
}