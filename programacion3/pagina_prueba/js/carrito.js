// Inicializa la logica del carrito cuando el DOM esta listo.
const iniciarCarrito = () => {
    const sesion = window.sesionTienda;
    const claveCarritoStorage = "miTienda_cart";
    const elementosBadgeCarrito = document.querySelectorAll(".cart-count");
    const listaCarrito = document.getElementById("cartList");
    const carritoVacio = document.getElementById("cartEmpty");
    const totalCarrito = document.getElementById("cartTotal");
    const panelCarrito = document.getElementById("carrito");
    const mensajeAccesoCarrito = document.getElementById("cartAccess");
    const esPaginaCarrito = Boolean(listaCarrito && carritoVacio && totalCarrito);
    let carrito = [];

    // Devuelve true si hay una sesion activa disponible.
    const estaUsuarioLogeado = () => {
        if (!sesion || typeof sesion.estaLogeado !== "function") return false;
        return Boolean(sesion.estaLogeado());
    };

    // Escapa texto para mostrarlo sin romper el HTML.
    const escaparHtml = (texto) => {
        if (!texto) return "";
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Normaliza un precio para operar con numeros.
    const normalizarPrecio = (valor) => {
        const texto = String(valor ?? "")
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^0-9.-]/g, "");
        const numero = Number(texto);
        return Number.isFinite(numero) ? numero : 0;
    };

    // Lee el carrito desde localStorage y filtra datos invalidos.
    const cargarCarrito = () => {
        try {
            const textoCrudo = localStorage.getItem(claveCarritoStorage);
            const parseado = textoCrudo ? JSON.parse(textoCrudo) : [];
            if (!Array.isArray(parseado)) return [];

            const limpio = [];
            for (const item of parseado) {
                const nombre = item?.nombre ?? item?.name ?? "";
                const precio = normalizarPrecio(item?.precio ?? item?.price ?? 0);
                if (nombre && Number.isFinite(precio) && precio > 0) {
                    limpio.push({ nombre, precio });
                }
            }
            return limpio;
        } catch (error) {
            return [];
        }
    };

    // Guarda el carrito actual en localStorage.
    const guardarCarrito = () => {
        localStorage.setItem(claveCarritoStorage, JSON.stringify(carrito));
    };

    // Formatea un valor numerico con formato de moneda local.
    const formatearPrecio = (valor) => {
        if (!Number.isFinite(valor)) return "$ 0";
        return `$ ${valor.toLocaleString("es-AR")}`;
    };

    // Actualiza el contador del carrito en el menu.
    const actualizarBadgeCarrito = () => {
        const cantidad = estaUsuarioLogeado() ? carrito.length : 0;
        for (const elemento of elementosBadgeCarrito) {
            elemento.textContent = cantidad;
            elemento.hidden = cantidad === 0;
        }
    };

    // Obtiene nombre y precio desde el HTML del producto.
    const obtenerDatosProducto = (elementoProducto) => {
        const nombre = elementoProducto.querySelector("h3")?.textContent?.trim();
        const elementoPrecio = elementoProducto.querySelector(".product-price");
        const textoPrecio =
            elementoPrecio?.getAttribute("data-price") ??
            elementoPrecio?.textContent ??
            "";
        const precio = normalizarPrecio(textoPrecio);
        return { nombre, precio };
    };

    // Muestra u oculta el panel del carrito segun la sesion.
    const actualizarAccesoCarrito = (debeMostrarPanel) => {
        if (panelCarrito) panelCarrito.hidden = !debeMostrarPanel;
        if (mensajeAccesoCarrito) mensajeAccesoCarrito.hidden = debeMostrarPanel;
    };

    // Renderiza el contenido del carrito cuando estamos en la pagina.
    const renderizarCarrito = () => {
        actualizarBadgeCarrito();
        if (!esPaginaCarrito) return;

        if (!estaUsuarioLogeado()) {
            actualizarAccesoCarrito(false);
            return;
        }

        actualizarAccesoCarrito(true);
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            carritoVacio.hidden = false;
            totalCarrito.textContent = "$ 0";
            return;
        }

        carritoVacio.hidden = true;
        let total = 0;
        for (let indice = 0; indice < carrito.length; indice += 1) {
            const productoCarrito = carrito[indice];
            const precioSeguro = normalizarPrecio(productoCarrito.precio);
            total += precioSeguro;

            const itemCarrito = document.createElement("li");
            itemCarrito.className = "cart-item";
            itemCarrito.innerHTML = `<span class="cart-item-name">${escaparHtml(
                productoCarrito.nombre
            )}</span>
                    <span class="cart-item-price">${formatearPrecio(
                precioSeguro
            )}</span>
                    <button class="cart-remove" type="button" data-index="${indice}">Eliminar</button>`;
            listaCarrito.appendChild(itemCarrito);
        }

        totalCarrito.textContent = formatearPrecio(total);
    };

    // Agrega un producto validado al carrito y actualiza la vista.
    const agregarProductoCarrito = (datosProducto) => {
        carrito.push({ nombre: datosProducto.nombre, precio: datosProducto.precio });
        guardarCarrito();
        renderizarCarrito();
    };

    // Elimina un producto del carrito y actualiza la vista.
    const eliminarProductoCarrito = (indice) => {
        carrito.splice(indice, 1);
        guardarCarrito();
        renderizarCarrito();
    };

    // Informa al usuario y lo envia a la pantalla de login.
    const redirigirAlLogin = () => {
        alert("Tenes que iniciar sesion para usar el carrito.");
        window.location.href = "login.html";
    };

    // Maneja los clicks para agregar o eliminar productos del carrito.
    const manejarClickCarrito = (evento) => {
        const botonAgregar = evento.target.closest(".add-to-cart");
        if (botonAgregar) {
            if (!estaUsuarioLogeado()) {
                redirigirAlLogin();
                return;
            }

            const producto = botonAgregar.closest(".product");
            if (!producto) return;
            const datosProducto = obtenerDatosProducto(producto);
            if (
                !datosProducto.nombre ||
                !Number.isFinite(datosProducto.precio) ||
                datosProducto.precio <= 0
            ) {
                alert("Este producto no tiene precio valido.");
                return;
            }
            agregarProductoCarrito(datosProducto);
            return;
        }

        const botonEliminar = evento.target.closest(".cart-remove");
        if (botonEliminar) {
            const indice = Number(botonEliminar.getAttribute("data-index"));
            if (!Number.isInteger(indice)) return;
            eliminarProductoCarrito(indice);
        }
    };

    carrito = cargarCarrito();
    renderizarCarrito();
    document.body.addEventListener("click", manejarClickCarrito);
};

document.addEventListener("DOMContentLoaded", iniciarCarrito);
