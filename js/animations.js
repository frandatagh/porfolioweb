// Funcion customizable para animaciones con lottie-web

// Cargar animación timeline
createLottieOnView({
  elementId: "lottie-timeline",
  jsonPath: "./media/details/timeline.json",
  loop: false,
  autoplay: false,
  threshold: 0.9, // 90% de vis
  rootMargin: "0px"
});
// Cargar animación progress
createLottieOnView({
  elementId: "lottie-progress",
  jsonPath: "./media/details/progress.json",
  loop: false,
  autoplay: false,
  threshold: 0.9, // 90% de vis
  rootMargin: "0px"
});



function createLottieOnView({
  elementId,       // ID del div donde irá la animación
  jsonPath,        // Ruta al archivo .json de Lottie
  loop = false,    // ¿Repetir animación?
  autoplay = false,// ¿Arrancar sola apenas se carga?
  renderer = "svg",// Renderer: 'svg', 'canvas' o 'html'
  threshold = 0.5, // % de visibilidad para disparar animación
  rootMargin = "0px" // Margen del observer
}) {
  // 1. Selecciona el contenedor
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`No se encontró un elemento con id="${elementId}"`);
    return;
  }

  // 2. Carga la animación
  const animation = lottie.loadAnimation({
    container: container,
    renderer: renderer,
    loop: loop,
    autoplay: autoplay,
    path: jsonPath
  });

  // 3. Configura IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animation.stop();  // Reinicia desde el frame 0
        animation.play();  // Reproduce animación
      }
    });
  }, { threshold: threshold, rootMargin: rootMargin });

  // 4. Activa el observer
  observer.observe(container);

  // 5. Devuelve la animación por si querés controlarla manualmente
  return { animation, observer };
}


/// Animación contador third-stadistic-panel

function animateCounter(element, duration = 2000) {
  const target = +element.getAttribute("data-target"); // valor final
  const start = 0;
  const increment = target / (duration / 16); // ~60fps
  let current = start;

  function updateCounter() {
    current += increment;
    if (current < target) {
      element.textContent = Math.ceil(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target; // asegura valor final exacto
    }
  }

  updateCounter();
}

// Observer para disparar la animación
function createCounterObserver(elementId, duration) {
  const element = document.getElementById(elementId);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(element, duration);
        observer.unobserve(element); // ❌ se ejecuta solo una vez
      }
    });
  }, { threshold: 0.5 });

  observer.observe(element);
}

// Uso:
createCounterObserver("counter", 2000); // 2 segundos