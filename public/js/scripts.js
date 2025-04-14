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
const profileTitle = document.getElementById('profile-title');

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

//contador de clicks
let hasClicked = false;
let localClicks = 0;

const arrowIcon = document.getElementById('arrow-icon');
const clickText = document.getElementById('click-text');
const clickCounter = document.getElementById('click-counter');
const clickCountDisplay = document.getElementById('click-count');

profilePic.addEventListener('click', () => {
  // Primera vez: reemplazar texto y flecha
  if (!hasClicked) {
    document.getElementById('profile-title').classList.remove('pointer-hint');
    arrowIcon.style.transition = 'opacity 0.4s ease';
    arrowIcon.style.opacity = '0';
    setTimeout(() => arrowIcon.style.display = 'none', 400);

    clickText.style.display = 'none';
    clickCounter.style.display = 'block';

    hasClicked = true;
  }

  // Aumentar y mostrar contador local
  localClicks++;
  clickCountDisplay.textContent = localClicks;

  // Actualizar el contador global en la base de datos
  runTransaction(clicksRef, (currentClicks) => {
    return (currentClicks || 0) + 1;
  }).then((result) => {
    // Actualizar el contador global en pantalla
    clickCountDisplay.textContent = result.snapshot.val();
  });

  // Aumentar el tamaño hasta el máximo permitido
  scale = Math.min(scale + scaleStep, maxScale);
  profilePic.style.transform = `scale(${scale})`;
  profileTitle.style.transform = `scale(${scale})`;

  // 🔄 Rebote leve de imagen
  profilePic.animate([
    { transform: `scale(${scale})` },
    { transform: `scale(${scale + 0.05})` },
    { transform: `scale(${scale})` }
  ], {
    duration: 300,
    easing: 'ease-out'
  });

  // Rebote leve en título
  profileTitle.animate([
    { transform: `scale(${scale})` },
    { transform: `scale(${scale + 0.05})` },
    { transform: `scale(${scale})` }
  ], {
    duration: 300,
    easing: 'ease-out'
  });

  // Reiniciar el temporizador si ya existe
  clearTimeout(resetTimeout);

  // Volver a tamaño normal con rebote después de 2 segundos
  resetTimeout = setTimeout(() => {
    scale = 1;
    profilePic.style.transform = `scale(1)`;
    profileTitle.style.transform = `scale(1)`;

    profilePic.classList.add('bounce');
    profileTitle.classList.add('bounce');

    setTimeout(() => {
      profilePic.classList.remove('bounce');
      profileTitle.classList.remove('bounce');
    }, 600);
  }, 2000);

  // Cambiar la imagen
  currentIndex = (currentIndex + 1) % imageList.length;
  profilePic.src = imageList[currentIndex];
});

//car

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
