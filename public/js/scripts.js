document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-button");
  const infoContent = document.querySelector(".container-me-info");

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
});