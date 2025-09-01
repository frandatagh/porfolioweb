// ✅ 1. Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ 2. Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyb-2oot9234R5YjLGdVAdCzGHBGVztn_54",
  authDomain: "mi-porfolio-82320.firebaseapp.com",
  projectId: "mi-porfolio-82320",
  storageBucket: "mi-porfolio-82320.appspot.com",
  messagingSenderId: "41594952743",
  appId: "1:41594952743:web:e87df8b1159d2f0b5e1c42"
};

// ✅ 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase conectado ✅", db);

// ✅ 4. Referencia al contador
const counterRef = ref(db, "contador");

// Variables globales
let localClickCount = 0;
const button = document.getElementById("change-genius-banner");
const backgroundDiv = document.getElementById("background-img");
const counterDisplay = document.getElementById("counter-genius");

// Escuchar cambios en tiempo real
onValue(counterRef, (snapshot) => {
  const value = snapshot.val();
  console.log("Valor actual del contador:", value);

  if (counterDisplay) {
    counterDisplay.textContent = '+' + value ?? 0;
  }
});

// 🎯 Función principal
function handleClick() {
  localClickCount++;

  // ✅ Actualizar contador en Firebase
  get(counterRef).then(snapshot => {
    let currentCount = snapshot.exists() ? snapshot.val() : 0;
    let newCount = currentCount + 1;
    set(counterRef, newCount); // usamos set porque es valor único
  });

  // ✅ Cambiar imagen de fondo según número de clicks
  if (backgroundDiv) {
    if (localClickCount === 1) {
      backgroundDiv.style.backgroundImage = "url('./media/genius/2.png')";
    } else if (localClickCount === 2) {
      backgroundDiv.style.backgroundImage = "url('./media/genius/3.png')";
    } else if (localClickCount === 3) {
      backgroundDiv.style.backgroundImage = "url('./media/genius/4.png')";
    } else if (localClickCount === 4) {
      backgroundDiv.style.backgroundImage = "url('./media/genius/5.png')";
    } 
  }
  

  // ✅ Animación del contador
  if (counterDisplay) {
    counterDisplay.classList.add("pop");
    setTimeout(() => counterDisplay.classList.remove("pop"), 100);
    button.classList.add("pop");
    setTimeout(() => button.classList.remove("pop"), 100);
  }
}

// 🎯 Asociar evento al botón
if (button) {
  button.addEventListener("click", handleClick);
}
