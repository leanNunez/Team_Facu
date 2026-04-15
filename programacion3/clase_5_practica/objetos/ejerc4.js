const alumnos = [
    { nombre: "Ana", nota: 7 },
    { nombre: "Juan", nota: 10 },
    { nombre: "Maria", nota: 9 }
];

// Asumimos que el primero es el de la nota más alta para empezar a comparar
let mejorAlumno = alumnos[0];

for (let i = 1; i < alumnos.length; i++) {
     // Si encontramos a alguien con mejor nota, actualizamos nuestra variable
    if (alumnos[i].nota > mejorAlumno.nota) {
        mejorAlumno = alumnos[i];
    }
}

console.log(mejorAlumno.nombre); // Imprime "Juan"