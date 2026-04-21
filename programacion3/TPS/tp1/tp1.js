// Arreglo principal donde se guardan todos los alumnos cargados en memoria.
// Cada elemento del array representa un alumno con apellido, nota, asistencia y estado.
const alumnos = [];

// Referencias a elementos del DOM.
// Se guardan acá para no buscar los mismos nodos una y otra vez en el código.
const formAlumno = document.getElementById("formAlumno");
const inputApellido = document.getElementById("apellido");
const inputNota = document.getElementById("nota");
const inputAsistencia = document.getElementById("asistencia");
const tablaAlumnos = document.getElementById("tablaAlumnos");
const tablaAprobados = document.getElementById("tablaAprobados");
const resumen = document.getElementById("resumen");
const mensaje = document.getElementById("mensaje");

// Devuelve un nuevo array con los alumnos aprobados, ordenados alfabéticamente.
// Primero filtra solo los alumnos aprobados y después los ordena por apellido.
function obtenerAprobadosOrdenados() {
	// filter() recorre el arreglo original y conserva solo los alumnos que aprueban.
	const aprobados = alumnos.filter((alumno) => alumno.estado === "Aprobado");

	// sort() ordena el array resultante comparando los apellidos uno por uno.
	// localeCompare() se usa para que el orden respete reglas del idioma español.
	return aprobados.sort((a, b) =>
		a.apellido.localeCompare(b.apellido, "es", { sensitivity: "base" })
	);
}

// Crea y devuelve un objeto Alumno con las propiedades pedidas en la consigna.
// Esta función recibe los datos crudos y devuelve un objeto ya normalizado.
function crearAlumno(apellido, nota, asistencia) {
	// Normaliza los datos de entrada para asegurar tipos consistentes.
	// trim() elimina espacios al principio y al final del apellido.
	// Number() convierte los valores del formulario en números reales.
	const alumnoBase = {
		apellido: apellido.trim(),
		nota: Number(nota),
		asistencia: Number(asistencia)
	};

	// Devuelve el alumno final agregando el estado calculado.
	// El operador spread (...) copia las propiedades base sin modificar el objeto original.
	return {
		...alumnoBase,
		estado: obtenerEstado(alumnoBase)
	};
}

// Determina el estado académico según nota e inasistencias.
// La función recibe un alumno y devuelve una cadena con su situación final.
function obtenerEstado(alumno) {
	// Regla 1: si supera 6 inasistencias queda libre, aunque tenga buena nota.
	// Esa condición se evalúa primero porque tiene prioridad sobre la nota.
	if (alumno.asistencia > 6) {
		return "No aprobado (libre por inasistencias)";
	}

	// Regla 2: si no está libre y su nota es 7 o más, aprueba.
	// Solo llegan acá los alumnos que no superan el límite de inasistencias.
	if (alumno.nota >= 7) {
		return "Aprobado";
	}

	// Regla 3: cualquier otro caso se considera no aprobado.
	// Esto cubre notas menores a 7 con asistencia dentro del rango permitido.
	return "No aprobado";
}

// Calcula el promedio general de notas de todos los alumnos cargados.
// Si no hay alumnos, devuelve 0 para evitar una división inválida.
function calcularPromedio() {
	if (alumnos.length === 0) {
		return 0;
	}

	// reduce() suma todas las notas del arreglo.
	// El acumulador arranca en 0 y se incrementa con la nota de cada alumno.
	const suma = alumnos.reduce((acumulador, alumno) => acumulador + alumno.nota, 0);
	// El promedio se obtiene dividiendo la suma por la cantidad total de alumnos.
	return suma / alumnos.length;
}

// Dibuja el contenido actualizado de la tabla y el promedio general.
// Cada vez que cambia el array, esta función vuelve a pintar la vista completa.
function renderizarAlumnos() {
	// Antes de dibujar, se crea una copia ordenada por apellido para mostrarla alfabéticamente.
	const alumnosOrdenados = [...alumnos].sort((a, b) =>
		a.apellido.localeCompare(b.apellido, "es", { sensitivity: "base" })
	);
	const aprobadosOrdenados = obtenerAprobadosOrdenados();

	// Limpia la tabla para evitar duplicar filas al volver a renderizar.
	// Así siempre se parte desde cero antes de agregar las filas nuevas.
	tablaAlumnos.innerHTML = "";
	tablaAprobados.innerHTML = "";

	// Recorre todos los alumnos y crea una fila <tr> por cada uno.
	// Cada fila muestra apellido, nota, asistencia y estado.
	alumnosOrdenados.forEach((alumno) => {
		const fila = document.createElement("tr");
		// Se arma el contenido de las celdas con template literals.
		// Esto permite insertar los datos del alumno directamente en el HTML.
		fila.innerHTML = `
			<td>${alumno.apellido}</td>
			<td>${alumno.nota}</td>
			<td>${alumno.asistencia}</td>
			<td>${alumno.estado}</td>
		`;
		// Inserta la fila al final del cuerpo de la tabla.
		// appendChild() agrega la nueva fila sin borrar las anteriores del ciclo actual.
		tablaAlumnos.appendChild(fila);
	});

	// Repite el mismo armado de filas, pero solo con los alumnos aprobados.
	aprobadosOrdenados.forEach((alumno) => {
		const fila = document.createElement("tr");
		fila.innerHTML = `
			<td>${alumno.apellido}</td>
			<td>${alumno.nota}</td>
			<td>${alumno.asistencia}</td>
			<td>${alumno.estado}</td>
		`;
		tablaAprobados.appendChild(fila);
	});

	// Recalcula y muestra el promedio en cada actualización de pantalla.
	// De esta forma el resumen siempre refleja el estado actual del array.
	const promedio = calcularPromedio();
	// toFixed(2) limita la salida a 2 decimales para que el dato quede prolijo.
	resumen.textContent = `Promedio general: ${promedio.toFixed(2)}`;
}

// Valida datos ingresados, agrega el alumno al arreglo y actualiza la interfaz.
// Esta función se ejecuta cuando el usuario envía el formulario.
function agregarAlumnoDesdeFormulario(evento) {
	// Evita que el formulario recargue la página al enviarse.
	// Así el manejo queda completamente del lado de JavaScript.
	evento.preventDefault();

	// Lee los valores actuales del formulario.
	// input.value devuelve texto, por eso después convertimos nota y asistencia.
	const apellido = inputApellido.value;
	const nota = Number(inputNota.value);
	const asistencia = Number(inputAsistencia.value);

	// Validación 1: apellido no puede estar vacío o solo con espacios.
	// trim() se usa para detectar casos en los que el usuario escribió solo espacios.
	if (!apellido.trim()) {
		mensaje.textContent = "Ingresá un apellido válido.";
		return;
	}

	// Validación 2: nota debe ser numérica y estar entre 0 y 10.
	// Se verifica NaN y también el rango permitido por la consigna.
	if (Number.isNaN(nota) || nota < 0 || nota > 10) {
		mensaje.textContent = "La nota debe estar entre 0 y 10.";
		return;
	}

	// Validación 3: inasistencias no puede ser negativa.
	// No se permite un número menor a cero porque no tiene sentido para asistencia.
	if (Number.isNaN(asistencia) || asistencia < 0) {
		mensaje.textContent = "Las inasistencias deben ser 0 o mayores.";
		return;
	}

	// Crea el objeto alumno con estado incluido y lo guarda en el arreglo.
	// Primero se arma el objeto y después se lo agrega al array principal.
	const alumno = crearAlumno(apellido, nota, asistencia);
	alumnos.push(alumno);

	// Muestra confirmación y prepara el formulario para la próxima carga.
	// reset() limpia el formulario y focus() vuelve a ubicar el cursor en apellido.
	mensaje.textContent = `Alumno ${alumno.apellido} agregado correctamente.`;
	formAlumno.reset();
	inputApellido.focus();

	// Refresca la tabla y el promedio con el nuevo alumno ingresado.
	// Esto hace que la interfaz se actualice sin recargar la página.
	renderizarAlumnos();
}

// Registra el evento submit para ejecutar la carga manual desde el formulario.
// Cuando el formulario se envía, se ejecuta la función de validación y carga.
formAlumno.addEventListener("submit", agregarAlumnoDesdeFormulario);

// Render inicial para mostrar estado vacío al cargar la página.
// Sirve para que la tabla y el resumen aparezcan preparados desde el inicio.
renderizarAlumnos();
