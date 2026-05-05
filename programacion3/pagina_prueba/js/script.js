// Gestion del sitio y eventos
document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil toggle (para varios botones)
  document.querySelectorAll('.menu-toggle').forEach((boton) => {
    boton.addEventListener('click', () => {
      const idNavegacion = boton.getAttribute('aria-controls');
      const navegacion = document.getElementById(idNavegacion);
      if (!navegacion) return;
      const estaVisible = navegacion.style.display === 'block';
      if (estaVisible) {
        navegacion.style.display = '';
        boton.setAttribute('aria-expanded', 'false');
      } else {
        navegacion.style.display = 'block';
        boton.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Alterna descripcion del producto
  document.body.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.more-info');
    if (!boton) return;
    const producto = boton.closest('.product');
    if (!producto) return;
    const descripcion = producto.querySelector('.product-desc');
    if (!descripcion) return;
    const expandido = boton.getAttribute('aria-expanded') === 'true';
    if (expandido) {
      descripcion.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      boton.textContent = 'Más info';
    } else {
      descripcion.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      boton.textContent = 'Menos info';
    }
  });

  // Escapa texto para render seguro
  const escaparHtml = (texto) => {
    if(!texto) return '';
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Carrusel de imágenes
  const pistaCarrusel = document.querySelector('.carousel-track');
  const botonAnterior = document.querySelector('.carousel-btn.prev');
  const botonSiguiente = document.querySelector('.carousel-btn.next');
  
  if(pistaCarrusel && botonAnterior && botonSiguiente){
    let indiceActual = 0;
    const itemsCarrusel = pistaCarrusel.querySelectorAll('.carousel-item');
    const totalElementos = itemsCarrusel.length;
    
    // Cantidad de items visibles segun ancho
    const elementosPorVista = () => {
      if(window.innerWidth >= 900) return 3;
      if(window.innerWidth >= 576) return 2;
      return 1;
    };
    
    // Recalcula posiciones y estado de botones
    const actualizarCarrusel = () => {
      const elementosVisibles = elementosPorVista();
      const indiceMaximo = Math.max(0, totalElementos - elementosVisibles);
      
      indiceActual = Math.min(indiceActual, indiceMaximo);
      
      const anchoItem = itemsCarrusel[0].offsetWidth;
      const separacion = 16; // 1rem = 16px
      const desplazamiento = indiceActual * (anchoItem + separacion);
      
      pistaCarrusel.style.transform = `translateX(-${desplazamiento}px)`;
      
      botonAnterior.disabled = indiceActual === 0;
      botonSiguiente.disabled = indiceActual >= indiceMaximo;
    };
    
    botonAnterior.addEventListener('click', () => {
      if(indiceActual > 0){
        indiceActual--;
        actualizarCarrusel();
      }
    });
    
    botonSiguiente.addEventListener('click', () => {
      const elementosVisibles = elementosPorVista();
      const indiceMaximo = Math.max(0, totalElementos - elementosVisibles);
      if(indiceActual < indiceMaximo){
        indiceActual++;
        actualizarCarrusel();
      }
    });
    
    window.addEventListener('resize', actualizarCarrusel);
    actualizarCarrusel();
  }

  // Carrito simple (array en memoria + persistencia local)
  const claveCarritoStorage = 'miTienda_cart';
  const elementosBadgeCarrito = document.querySelectorAll('.cart-count');
  const listaCarrito = document.getElementById('cartList');
  const carritoVacio = document.getElementById('cartEmpty');
  const totalCarrito = document.getElementById('cartTotal');

  // Normaliza el precio a numero
  const normalizarPrecio = (valor) => {
    const texto = String(valor ?? '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^0-9.-]/g, '');
    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : 0;
  };

  // Lee carrito desde localStorage
  const cargarCarrito = () => {
    try {
      const textoCrudo = localStorage.getItem(claveCarritoStorage);
      const parseado = textoCrudo ? JSON.parse(textoCrudo) : [];
      if(!Array.isArray(parseado)) return [];
      return parseado
        .map((item) => ({
          nombre: item?.nombre ?? item?.name ?? '',
          precio: normalizarPrecio(item?.precio ?? item?.price ?? 0)
        }))
        .filter((item) => item.nombre && Number.isFinite(item.precio) && item.precio > 0);
    } catch (error) {
      return [];
    }
  };

  // Guarda carrito en localStorage
  const guardarCarrito = () => {
    localStorage.setItem(claveCarritoStorage, JSON.stringify(carrito));
  };

  // Formatea precio para mostrar
  const formatearPrecio = (valor) => {
    if(!Number.isFinite(valor)) return '$ 0';
    return `$ ${valor.toLocaleString('es-AR')}`;
  };

  // Actualiza el contador en el navbar
  const actualizarBadgeCarrito = () => {
    const cantidad = carrito.length;
    elementosBadgeCarrito.forEach((elemento) => {
      elemento.textContent = cantidad;
      elemento.hidden = cantidad === 0;
    });
  };

  // Obtiene nombre y precio desde el HTML del producto
  const obtenerDatosProducto = (elementoProducto) => {
    const nombre = elementoProducto.querySelector('h3')?.textContent?.trim();
    const elementoPrecio = elementoProducto.querySelector('.product-price');
    const textoPrecio = elementoPrecio?.getAttribute('data-price') ?? elementoPrecio?.textContent ?? '';
    const precio = normalizarPrecio(textoPrecio);
    return { nombre, precio };
  };

  // Dibuja el carrito y el total
  const renderizarCarrito = () => {
    actualizarBadgeCarrito();
    if(!listaCarrito || !totalCarrito || !carritoVacio) return;
    listaCarrito.innerHTML = '';

    if(carrito.length === 0){
      carritoVacio.hidden = false;
      totalCarrito.textContent = '$ 0';
      return;
    }

    carritoVacio.hidden = true;
    let total = 0;
    carrito.forEach((productoCarrito, indice) => {
      const precioSeguro = normalizarPrecio(productoCarrito.precio);
      total += precioSeguro;
      const itemCarrito = document.createElement('li');
      itemCarrito.className = 'cart-item';
      itemCarrito.innerHTML = `<span class="cart-item-name">${escaparHtml(productoCarrito.nombre)}</span>
                      <span class="cart-item-price">${formatearPrecio(precioSeguro)}</span>
                      <button class="cart-remove" type="button" data-index="${indice}">Eliminar</button>`;
      listaCarrito.appendChild(itemCarrito);
    });

    totalCarrito.textContent = formatearPrecio(total);
  };

  let carrito = cargarCarrito();
  renderizarCarrito();

  // Acciones del carrito (agregar y eliminar)
  document.body.addEventListener('click', (evento) => {
    const botonAgregar = evento.target.closest('.add-to-cart');
    if (botonAgregar) {
      const producto = botonAgregar.closest('.product');
      if (!producto) return;
      const datosProducto = obtenerDatosProducto(producto);
      if (!datosProducto.nombre || !Number.isFinite(datosProducto.precio) || datosProducto.precio <= 0) {
        alert('Este producto no tiene precio válido.');
        return;
      }
      carrito.push({ nombre: datosProducto.nombre, precio: datosProducto.precio });
      guardarCarrito();
      renderizarCarrito();
      return;
    }

    const botonEliminar = evento.target.closest('.cart-remove');
    if (botonEliminar) {
      const indice = Number(botonEliminar.getAttribute('data-index'));
      if (!Number.isInteger(indice)) return;
      carrito.splice(indice, 1);
      guardarCarrito();
      renderizarCarrito();
    }
  });

});