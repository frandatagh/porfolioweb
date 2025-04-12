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

const profilePics = [
  'perfil1.jpg',
  'perfil2.jpg',
  'perfil3.jpg',
  'perfil4.jpg'
];

// Referencia al elemento <img>
const profileImg = document.getElementById('profile-pic');

// Índice actual
let currentIndex = 0;

// Evento de click
profileImg.addEventListener('click', () => {
  // Avanzar al siguiente índice (cíclico)
  currentIndex = (currentIndex + 1) % profilePics.length;
  // Cambiar la imagen
  profileImg.src = profilePics[currentIndex];
});

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
