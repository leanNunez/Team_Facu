// Inicializa la interaccion de productos cuando el DOM esta listo.
const iniciarProductos = () => {
    // Alterna la descripcion del producto y actualiza el boton.
    const alternarDescripcionProducto = (boton) => {
        const producto = boton.closest(".product");
        if (!producto) return;

        const descripcion = producto.querySelector(".product-desc");
        if (!descripcion) return;

        const expandido = boton.getAttribute("aria-expanded") === "true";
        if (expandido) {
            descripcion.hidden = true;
            boton.setAttribute("aria-expanded", "false");
            boton.textContent = "Mas info";
        } else {
            descripcion.hidden = false;
            boton.setAttribute("aria-expanded", "true");
            boton.textContent = "Menos info";
        }
    };

    // Resuelve el click en botones de informacion del producto.
    const manejarClickDescripcion = (evento) => {
        const boton = evento.target.closest(".more-info");
        if (!boton) return;
        alternarDescripcionProducto(boton);
    };

    document.body.addEventListener("click", manejarClickDescripcion);
};

document.addEventListener("DOMContentLoaded", iniciarProductos);
