document.addEventListener("DOMContentLoaded", function () {
  const btnBuscar = document.getElementById("btnBuscar");
  const inputBuscar = document.getElementById("inputBuscar");
  const form = document.getElementById("searchForm");
  const contenedor = document.getElementById("contenedor");

  // Función para obtener parámetros de la URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Función para hacer la solicitud a la API de NASA y obtener los datos
  async function buscarImagenes(query) {
    const url = `https://images-api.nasa.gov/search?q=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.collection.items || []; // Retornamos la lista de imágenes o un array vacío
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return [];
    }
  }

  // Función para mostrar los datos en formato de tarjeta usando Bootstrap
  function mostrarImagenes(imagenes) {
    contenedor.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos resultados

    if (imagenes.length === 0) {
      contenedor.innerHTML = '<p class="text-center">No se encontraron imágenes para su búsqueda.</p>';
      return;
    }

    let row = ``; // Inicializamos la fila

    imagenes.forEach(imagen => {
      const title = imagen.data[0].title || 'Sin título';
      const description = imagen.data[0].description || 'Sin descripción';
      const date = imagen.data[0].date_created || 'Fecha no disponible';
      const imageUrl = imagen.links ? imagen.links[0].href : '';

      // Crear el HTML de la tarjeta usando Bootstrap y colocarlas en una grilla
      const card = `
        <div class="col-lg-3 col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${imageUrl}" class="card-img-top" alt="${title}" style="height: 150px; object-fit: cover;">
            <div class="card-body" style="height: 150px; overflow-y: auto;">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${description}</p>
              <p class="card-text"><small class="text-muted">Fecha: ${date}</small></p>
            </div>
          </div>
        </div>
      `;
      row += card; // Añadimos cada tarjeta a la fila
    });

    contenedor.innerHTML = row; // Añadimos la fila al contenedor
  }

  // Función para manejar la búsqueda en tiempo real
  inputBuscar.addEventListener('input', function () {
    const query = inputBuscar.value.trim();
    if (query) {
      buscarImagenes(query).then(mostrarImagenes);
    } else {
      contenedor.innerHTML = '<p class="text-center">Ingrese un término para buscar imágenes.</p>';
    }
  });

  // Validación al enviar el formulario o al dar Enter
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const query = inputBuscar.value.trim();
    if (query) {
      const imagenes = await buscarImagenes(query); // Hacer la solicitud a la API
      mostrarImagenes(imagenes); // Mostrar los resultados en tarjetas
    } else {
      alert("Por favor, ingrese un término de búsqueda.");
    }

    form.classList.add('was-validated'); // Añadimos las clases de validación de Bootstrap
  });

  // Extraer el parámetro de búsqueda de la URL si existe
  const searchQuery = getQueryParam('buscar');
  if (searchQuery) {
    inputBuscar.value = searchQuery; // Mostrar el término de búsqueda en el campo
    buscarImagenes(searchQuery).then(mostrarImagenes); // Realizar la búsqueda automáticamente
  }
});
