// Arreglo principal donde se guardan todos los alumnos cargados.
const alumnos = [];

// Referencias a elementos del DOM para leer datos y mostrar resultados.
const formAlumno = document.getElementById("formAlumno");
const inputApellido = document.getElementById("apellido");
const inputNota = document.getElementById("nota");
const inputAsistencia = document.getElementById("asistencia");
const tablaAlumnos = document.getElementById("tablaAlumnos");
const resumen = document.getElementById("resumen");
const mensaje = document.getElementById("mensaje");

// Crea y devuelve un objeto Alumno con las propiedades pedidas en la consigna.
function crearAlumno(apellido, nota, asistencia) {
	// Normaliza los datos de entrada para asegurar tipos consistentes.
	// trim() evita espacios extra en el apellido y Number() convierte texto a número.
	const alumnoBase = {
		apellido: apellido.trim(),
		nota: Number(nota),
		asistencia: Number(asistencia)
	};

	// Devuelve el alumno final agregando el estado calculado.
	// Se usa el operador spread (...) para copiar las propiedades base.
	return {
		...alumnoBase,
		estado: obtenerEstado(alumnoBase)
	};
}

// Determina el estado académico según nota e inasistencias.
function obtenerEstado(alumno) {
	// Regla 1: si supera 6 inasistencias queda libre, aunque tenga buena nota.
	if (alumno.asistencia > 6) {
		return "No aprobado (libre por inasistencias)";
	}

	// Regla 2: si no está libre y su nota es 7 o más, aprueba.
	if (alumno.nota >= 7) {
		return "Aprobado";
	}

	// Regla 3: cualquier otro caso se considera no aprobado.
	return "No aprobado";
}

// Calcula el promedio general de notas de todos los alumnos cargados.
function calcularPromedio() {
	// Si no hay alumnos, se devuelve 0 para evitar dividir por cero.
	if (alumnos.length === 0) {
		return 0;
    }

	// reduce() suma todas las notas del arreglo.
	// acumulador arranca en 0 y se incrementa con alumno.nota.
	const suma = alumnos.reduce((acumulador, alumno) => acumulador + alumno.nota, 0);
	// El promedio se obtiene dividiendo la suma por la cantidad de alumnos.
	return suma / alumnos.length;
}

// Dibuja el contenido actualizado de la tabla y el promedio general.
function renderizarAlumnos() {
	// Limpia la tabla para evitar duplicar filas al volver a renderizar.
	tablaAlumnos.innerHTML = "";

	// Recorre todos los alumnos y crea una fila <tr> por cada uno.
	alumnos.forEach((alumno) => {
		const fila = document.createElement("tr");
		// Se arma el contenido de celdas con template literals.
		fila.innerHTML = `
			<td>${alumno.apellido}</td>
			<td>${alumno.nota}</td>
			<td>${alumno.asistencia}</td>
			<td>${alumno.estado}</td>
		`;
		// Inserta la fila al final del cuerpo de la tabla.
		tablaAlumnos.appendChild(fila);
	});

	// Recalcula y muestra el promedio en cada actualización de pantalla.
	const promedio = calcularPromedio();
	// toFixed(2) limita la salida a 2 decimales.
	resumen.textContent = `Promedio general: ${promedio.toFixed(2)}`;
}

// Valida datos ingresados, agrega el alumno al arreglo y actualiza la interfaz.
function agregarAlumnoDesdeFormulario(evento) {
	// Evita que el formulario recargue la página al enviarse.
	evento.preventDefault();

	// Lee los valores actuales del formulario.
	const apellido = inputApellido.value;
	const nota = Number(inputNota.value);
	const asistencia = Number(inputAsistencia.value);

	// Validación 1: apellido no puede estar vacío o solo con espacios.
	if (!apellido.trim()) {
		mensaje.textContent = "Ingresá un apellido válido.";
		return;
	}

	// Validación 2: nota debe ser numérica y estar entre 0 y 10.
	if (Number.isNaN(nota) || nota < 0 || nota > 10) {
		mensaje.textContent = "La nota debe estar entre 0 y 10.";
		return;
	}

	// Validación 3: inasistencias no puede ser negativa.
	if (Number.isNaN(asistencia) || asistencia < 0) {
		mensaje.textContent = "Las inasistencias deben ser 0 o mayores.";
		return;
	}

	// Crea el objeto alumno con estado incluido y lo guarda en el arreglo.
	const alumno = crearAlumno(apellido, nota, asistencia);
	alumnos.push(alumno);

	// Muestra confirmación y prepara el formulario para la próxima carga.
	mensaje.textContent = `Alumno ${alumno.apellido} agregado correctamente.`;
	formAlumno.reset();
	// Vuelve a posicionar el cursor en apellido para agilizar la carga manual.
	inputApellido.focus();

	// Refresca la tabla y el promedio con el nuevo alumno ingresado.
	renderizarAlumnos();
}

// Registra el evento submit para ejecutar la carga manual desde el formulario.
formAlumno.addEventListener("submit", agregarAlumnoDesdeFormulario);

// Render inicial para mostrar estado vacío al cargar la página.
renderizarAlumnos();
