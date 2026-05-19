const claveSesionStorage = "miTienda_sesion";

// Lee la sesion activa desde localStorage si es valida.
const obtenerSesionActiva = () => {
    try {
        const textoCrudo = localStorage.getItem(claveSesionStorage);
        if (!textoCrudo) return null;
        const sesion = JSON.parse(textoCrudo);
        const nombre = typeof sesion?.nombre === "string" ? sesion.nombre.trim() : "";
        if (!nombre) return null;
        return { nombre };
    } catch (error) {
        return null;
    }
};

// Guarda la sesion del usuario en localStorage.
const guardarSesionActiva = (nombre) => {
    const nombreLimpio = String(nombre ?? "").trim();
    if (!nombreLimpio) return;
    localStorage.setItem(
        claveSesionStorage,
        JSON.stringify({ nombre: nombreLimpio })
    );
};

// Borra la sesion actual del navegador.
const cerrarSesionActiva = () => {
    localStorage.removeItem(claveSesionStorage);
};

// Indica si hay una sesion valida activa.
const estaLogeado = () => Boolean(obtenerSesionActiva());

// Gestiona el click del enlace de sesion cuando el usuario esta logeado.
const manejarClickSesion = (evento) => {
    if (!estaLogeado()) return;
    evento.preventDefault();
    cerrarSesionActiva();
    actualizarEnlaceSesion();
    window.location.href = "index.html";
};

// Crea o actualiza el enlace de sesion dentro del menu.
const actualizarEnlaceSesion = () => {
    const listasNavegacion = document.querySelectorAll(".main-nav ul");

    for (const listaNavegacion of listasNavegacion) {
        let itemSesion = listaNavegacion.querySelector(".nav-session");
        let enlaceSesion = itemSesion ? itemSesion.querySelector("a") : null;

        if (!itemSesion) {
            itemSesion = document.createElement("li");
            itemSesion.className = "nav-session";
            enlaceSesion = document.createElement("a");
            enlaceSesion.className = "session-link";
            enlaceSesion.addEventListener("click", manejarClickSesion);
            itemSesion.appendChild(enlaceSesion);
            listaNavegacion.appendChild(itemSesion);
        }

        if (!enlaceSesion) {
            enlaceSesion = document.createElement("a");
            enlaceSesion.className = "session-link";
            enlaceSesion.addEventListener("click", manejarClickSesion);
            itemSesion.appendChild(enlaceSesion);
        }

        const sesionActiva = obtenerSesionActiva();
        if (sesionActiva) {
            enlaceSesion.textContent = `Salir (${sesionActiva.nombre})`;
            enlaceSesion.href = "#";
        } else {
            enlaceSesion.textContent = "Ingresar";
            enlaceSesion.href = "login.html";
        }
    }
};

window.sesionTienda = {
    obtenerSesionActiva,
    guardarSesionActiva,
    cerrarSesionActiva,
    estaLogeado,
    actualizarEnlaceSesion
};
