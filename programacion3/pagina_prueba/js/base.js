// Inicializa los comportamientos base cuando el DOM esta listo.
const iniciarBase = () => {
    const botonesMenu = document.querySelectorAll(".menu-toggle");

    // Alterna la visibilidad del menu asociado al boton de navegacion.
    const alternarMenuNavegacion = (boton) => {
        const idNavegacion = boton.getAttribute("aria-controls");
        const navegacion = document.getElementById(idNavegacion);
        if (!navegacion) return;
        const estaVisible = navegacion.style.display === "block";
        if (estaVisible) {
            navegacion.style.display = "";
            boton.setAttribute("aria-expanded", "false");
        } 
        else {
        navegacion.style.display = "block";
        boton.setAttribute("aria-expanded", "true");
        }
    };

    // Resuelve el click del boton de menu y aplica el cambio.
    const manejarClickMenu = (evento) => {
        const boton = evento.currentTarget;
        alternarMenuNavegacion(boton);
    };

    // Conecta el comportamiento de menu movil a todos los botones.
    const configurarMenuMovil = () => {
        for (const boton of botonesMenu) {
            boton.addEventListener("click", manejarClickMenu);
        }
    };

    // Pide al modulo de sesion que actualice el enlace en el menu.
    const sincronizarEnlaceSesion = () => {
        if (
            !window.sesionTienda ||
            typeof window.sesionTienda.actualizarEnlaceSesion !== "function"
        )
        {return;}
        window.sesionTienda.actualizarEnlaceSesion();
    };

    configurarMenuMovil();
    sincronizarEnlaceSesion();
};

document.addEventListener("DOMContentLoaded", iniciarBase);
