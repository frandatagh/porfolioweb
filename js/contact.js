document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const data = {
      from_name: this.from_name.value,
      subject: this.subject.value,
      message: this.message.value,
    };
  
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json(); // Correctamente parseado como JSON
  
      if (result.success) {
        alert("¡Mensaje enviado!");
        this.reset();
      } else {
        alert("Error al enviar mensaje: " + result.message);
      }
    } catch (err) {
      console.error("Error en el envío del formulario:", err);
      alert("Hubo un error al conectar con el servidor.");
    }
  });
  