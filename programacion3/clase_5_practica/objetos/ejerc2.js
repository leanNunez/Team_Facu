const persona = {
    nombre: "Carlos",
    edad: 25
};

// 1. Cambiamos el valor de la edad
persona.edad = 26;

// 2. Agregamos una nueva propiedad simplemente asignándole un valor
persona.profesion = "Desarrollador";

console.log(persona); 
// Imprime: { nombre: 'Carlos', edad: 26, profesion: 'Desarrollador' }