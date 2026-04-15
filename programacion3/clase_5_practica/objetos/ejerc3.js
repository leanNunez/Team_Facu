const libro = {
    titulo: "Fahrenheit 451",
    autor: "Ray Bradbury",
    paginas: 256,
    genero: "Ciencia ficción distópica"
};

// Extraemos titulo y autor del nuevo objeto libro
const { titulo, autor } = libro;

console.log(titulo); // Imprime: "Fahrenheit 451"
console.log(autor);  // Imprime: "Ray Bradbury"
console.log(libro); // Imprime el objeto completo del libro