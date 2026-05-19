// Inicializa el formulario de login cuando el DOM esta listo.
const iniciarLogin = () => {
    const formularioLogin = document.getElementById("formularioLogin");
    if (!formularioLogin) return;

    const mensajeLogin = document.getElementById("loginMessage");
    const nombreLogin = document.getElementById("nombreUsuario");
    const sesion = window.sesionTienda;

    // Obtiene un nombre limpio para iniciar sesion.
    const obtenerNombreLimpio = () => {
        return String(nombreLogin?.value ?? "").trim();
    };

    // Actualiza el formulario y el mensaje segun la sesion.
    const actualizarVistaLogin = () => {
        if (!sesion || typeof sesion.obtenerSesionActiva !== "function") {
            if (mensajeLogin) {
                mensajeLogin.hidden = false;
                mensajeLogin.textContent = "No se pudo cargar la sesion.";
            }
            return;
        }

        const sesionActiva = sesion.obtenerSesionActiva();
        if (sesionActiva) {
            formularioLogin.hidden = true;
            if (mensajeLogin) {
                mensajeLogin.hidden = false;
                mensajeLogin.textContent = `Ya iniciaste sesion como ${sesionActiva.nombre}.`;
            }
            if (nombreLogin) nombreLogin.value = sesionActiva.nombre;
            return;
        }

        formularioLogin.hidden = false;
        if (mensajeLogin) {
            mensajeLogin.hidden = true;
            mensajeLogin.textContent = "";
        }
        if (nombreLogin && !nombreLogin.value) nombreLogin.focus();
    };

    // Valida el formulario y crea la sesion local.
    const manejarEnvioLogin = (evento) => {
        evento.preventDefault();
        if (!sesion) return;

        const nombre = obtenerNombreLimpio();
        if (!nombre) {
            if (mensajeLogin) {
                mensajeLogin.hidden = false;
                mensajeLogin.textContent = "Escribi un nombre para ingresar.";
            }
            return;
        }

        sesion.guardarSesionActiva(nombre);
        sesion.actualizarEnlaceSesion();
        actualizarVistaLogin();
        window.location.href = "carrito.html";
    };

    formularioLogin.addEventListener("submit", manejarEnvioLogin);
    actualizarVistaLogin();
};

document.addEventListener("DOMContentLoaded", iniciarLogin);
