import { ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { db } from "../js/firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-button");
  const infoContent = document.querySelector(".container-me-info");

  // Inicializar tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(el => new bootstrap.Tooltip(el));

  // Scroll a secciones
  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  // Cambiar imagen de perfil
  const profilePic = document.getElementById('profile-pic');
  const profileTitle = document.getElementById('profile-title');

  if (!profilePic || !profileTitle) return;

  const imageList = [
    './media/foto-perfil/perfil01.png',
    './media/foto-perfil/perfil02.png',
    './media/foto-perfil/perfil03.png',
    './media/foto-perfil/perfil04.png',
    './media/foto-perfil/perfil05.png'
  ];

  let currentIndex = 0;
  let scale = 1;
  const scaleStep = 0.1;
  const maxScale = 1.8;
  let resetTimeout;
  let hasClicked = false;
  let localClicks = 0;

  const arrowIcon = document.getElementById('arrow-icon');
  const clickText = document.getElementById('click-text');
  const clickCounter = document.getElementById('click-counter');
  const clickCountDisplay = document.getElementById('click-count');

  const clicksRef = ref(db, 'clicks');

  // Mostrar clicks en tiempo real
  onValue(clicksRef, (snapshot) => {
    const total = snapshot.val() || 0;
    clickCountDisplay.textContent = total;
  });

  // Función animación de rebote
  function animateBounce(element, scale) {
    element.animate([
      { transform: `scale(${scale})` },
      { transform: `scale(${scale + 0.05})` },
      { transform: `scale(${scale})` }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  }

  // Evento de click sobre la imagen de perfil
  profilePic.addEventListener('click', () => {
    // Actualizar base de datos y DOM
    runTransaction(clicksRef, (currentClicks) => {
      return (currentClicks || 0) + 1;
    }).then((result) => {
      clickCountDisplay.textContent = result.snapshot.val();
    });

    // Mostrar elementos la primera vez
    if (!hasClicked) {
      profileTitle.classList.remove('pointer-hint');
      arrowIcon.style.transition = 'opacity 0.4s ease';
      arrowIcon.style.opacity = '0';
      setTimeout(() => arrowIcon.style.display = 'none', 400);

      clickText.style.display = 'none';
      clickCounter.style.display = 'block';
      hasClicked = true;
    }

    // Aumentar contador local
    localClicks++;

    // Aumentar escala con límite
    scale = Math.min(scale + scaleStep, maxScale);
    profilePic.style.transform = `scale(${scale})`;
    profileTitle.style.transform = `scale(${scale})`;

    animateBounce(profilePic, scale);
    animateBounce(profileTitle, scale);

    clearTimeout(resetTimeout);

    // Volver a tamaño normal con rebote después de 2s
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

    // Cambiar imagen
    currentIndex = (currentIndex + 1) % imageList.length;
    profilePic.src = imageList[currentIndex];
  });

  // Botón toggle "Sobre mí"
  toggleButton.addEventListener("click", function () {
    infoContent.classList.toggle("expanded");

    toggleButton.innerHTML = infoContent.classList.contains("expanded")
      ? '<i class="fas fa-chevron-up"></i>'
      : '<i class="fas fa-chevron-down"></i>';
  });

  // Animaciones de aparición con IntersectionObserver
  const elementos = document.querySelectorAll('.element-showup');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.5
  });

  elementos.forEach((elemento) => {
    observer.observe(elemento);
  });
});