// Inicializa el carrusel de novedades cuando el DOM esta listo.
const iniciarCarrusel = () => {
    const pistaCarrusel = document.querySelector(".carousel-track");
    const botonAnterior = document.querySelector(".carousel-btn.prev");
    const botonSiguiente = document.querySelector(".carousel-btn.next");

    if (!pistaCarrusel || !botonAnterior || !botonSiguiente) return;

    let indiceActual = 0;
    const itemsCarrusel = pistaCarrusel.querySelectorAll(".carousel-item");
    const totalElementos = itemsCarrusel.length;

    // Calcula cuantos elementos se muestran segun el ancho disponible.
    const obtenerElementosPorVista = () => {
        if (window.innerWidth >= 900) return 3;
        if (window.innerWidth >= 576) return 2;
        return 1;
    };

    // Recalcula el desplazamiento y el estado de los botones.
    const actualizarCarrusel = () => {
        const elementosVisibles = obtenerElementosPorVista();
        const indiceMaximo = Math.max(0, totalElementos - elementosVisibles);

        indiceActual = Math.min(indiceActual, indiceMaximo);

        const anchoItem = itemsCarrusel[0].offsetWidth;
        const separacion = 16;
        const desplazamiento = indiceActual * (anchoItem + separacion);

        pistaCarrusel.style.transform = `translateX(-${desplazamiento}px)`;

        botonAnterior.disabled = indiceActual === 0;
        botonSiguiente.disabled = indiceActual >= indiceMaximo;
    };

    // Mueve el carrusel hacia la izquierda.
    const moverCarruselAnterior = () => {
        if (indiceActual > 0) {
            indiceActual -= 1;
            actualizarCarrusel();
        }
    };

    // Mueve el carrusel hacia la derecha.
    const moverCarruselSiguiente = () => {
        const elementosVisibles = obtenerElementosPorVista();
        const indiceMaximo = Math.max(0, totalElementos - elementosVisibles);
        if (indiceActual < indiceMaximo) {
            indiceActual += 1;
            actualizarCarrusel();
        }
    };

    botonAnterior.addEventListener("click", moverCarruselAnterior);
    botonSiguiente.addEventListener("click", moverCarruselSiguiente);
    window.addEventListener("resize", actualizarCarrusel);
    actualizarCarrusel();
};

document.addEventListener("DOMContentLoaded", iniciarCarrusel);
