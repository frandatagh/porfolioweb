document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-button");
  const infoContent = document.querySelector(".container-me-info");

  
// Inicializar tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Scroll a secciones
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
//Cambiar imagen de perfil -----
const profilePic = document.getElementById('profile-pic');

// Array con las rutas de las imágenes
const imageList = [
  './media/foto-perfil/perfil01.png',
  './media/foto-perfil/perfil02.png',
  './media/foto-perfil/perfil03.png',
  './media/foto-perfil/perfil04.png',
  './media/foto-perfil/perfil05.png'
];

let currentIndex = 0; // Inicia con la imagen predeterminada
let scale = 1; // Tamaño inicial
  const scaleStep = 0.1; // Cuánto crece en cada click
const maxScale = 1.8; // Tamaño máximo permitido
let resetTimeout; // Para controlar el tiempo de inactividad


profilePic.addEventListener('click', () => {
  // Aumentar el tamaño hasta el máximo permitido
  scale = Math.min(scale + scaleStep, maxScale);
  profilePic.style.transform = `scale(${scale})`;

  // 🔄 Rebote leve personalizado desde el tamaño actual
  profilePic.animate([
    { transform: `scale(${scale})` },
    { transform: `scale(${scale + 0.05})` },
    { transform: `scale(${scale})` }
  ], {
    duration: 300,
    easing: 'ease-out'
  });

  // Reiniciar el temporizador si ya existe
  clearTimeout(resetTimeout);

  // Timeout para volver al tamaño original con rebote fuerte
  resetTimeout = setTimeout(() => {
    scale = 1;
    profilePic.style.transform = `scale(${scale})`;

    profilePic.classList.add('bounce');
    setTimeout(() => {
      profilePic.classList.remove('bounce');
    }, 600);
  }, 2000);

  // Avanzar al siguiente índice
  currentIndex = (currentIndex + 1) % imageList.length;

  // Cambiar la imagen de perfil
  profilePic.src = imageList[currentIndex];
});



//-----------------------------------

  toggleButton.addEventListener("click", function () {
    infoContent.classList.toggle("expanded");
    console.log('prueba btn sobre mi');

    // Cambiar el ícono y el texto del botón
    if (infoContent.classList.contains("expanded")) {
      toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
      toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
  });

  const elementos = document.querySelectorAll('.element-showup');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.5 // Activa la animación cuando el 50% del elemento es visible
  });

  elementos.forEach((elemento) => {
    observer.observe(elemento);
  });
});
