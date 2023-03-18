// Creando el objeto Producto
class Producto {
  constructor(nombre, precio, id, img) {
    this.nombre = nombre;
    this.precio = precio;
    this.id = id;
    this.img = img;
  }
}

// Creando el array con la lista de productos
let lista_productos = [];
lista_productos.push(new Producto("Heladera", 90000, 0, "img/heladera.jpg"));
lista_productos.push(new Producto("Televisor", 45000, 1, "img/televisor.jpg"));
lista_productos.push(new Producto("Tostadora", 11000, 2, "img/tostadora.jpg"));
lista_productos.push(new Producto("Cargador Portatil", 5500, 3, "img/cargador.jpg"));
lista_productos.push(new Producto("Lampara", 6000, 4, "img/lampara.jpg"));
lista_productos.push(new Producto("Monitor", 23000, 5, "img/monitor.jpg"));

// Obtener el carrito almacenado en el LocalStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualizar la tabla del carrito al cargar la página
window.addEventListener("load", actualizarCarrito);

// Función para agregar un producto al carrito
function agregarProducto(id) {
  let producto = lista_productos[id];

  // Find para ver si el producto se repite
  let productoExistente = carrito.find(p => p.id === producto.id);
    if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  //Agregando SweetAlert al agregar un producto
  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    showConfirmButton: false,
    timer: 1500
  })

  actualizarCarrito();
  
  // Actualizar el carrito almacenado en el LocalStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar la tabla del carrito
function actualizarCarrito() {
  let totalProductos = 0;
  let precioTotal = 0;

  let cuerpoTabla = document.querySelector("#carrito tbody");
  cuerpoTabla.innerHTML = "";

  carrito.forEach((producto, index) => {
    let fila = cuerpoTabla.insertRow();
    fila.id = `fila-${index}`;

    // Fila imagen
    let celdaImagen = fila.insertCell();
    let imagen = document.createElement("img");
    imagen.src = producto.img;
    imagen.style.width = "30px";
    celdaImagen.appendChild(imagen);

    // Fila precio y nombre
    let celdaNombrePrecio = fila.insertCell();
    let textoNombre = document.createElement("p");
    textoNombre.style.color = "white";
    textoNombre.innerText = `${producto.nombre} - $${producto.precio}`;
    celdaNombrePrecio.appendChild(textoNombre);

    // Fila producto
    let celdaCantidad = fila.insertCell();
    let textoCantidad = document.createElement("p");
    textoCantidad.style.color = "white";
    textoCantidad.innerText = producto.cantidad;
    celdaCantidad.appendChild(textoCantidad);

    // Fila boton
    let celdaEliminar = fila.insertCell();
    let botonEliminar = document.createElement("button");
    botonEliminar.innerText = "Eliminar";
    botonEliminar.addEventListener("click", () => eliminarProducto(index));
    celdaEliminar.appendChild(botonEliminar);

    totalProductos += producto.cantidad;
    precioTotal += producto.precio * producto.cantidad;
  });

  document.querySelector("#total-productos").innerText = totalProductos;
  document.querySelector("#precio-total").innerText = `$${precioTotal}`;
}

function eliminarProducto(index) {
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === carrito[index].id) {
      carrito.splice(i, 1);
      break;
    }
  }

  actualizarCarrito();
  
  let filaProducto = document.getElementById(`fila-${index}`);
  filaProducto.parentNode.removeChild(filaProducto);
  
  // precio total y cantidad de productos
  let totalProductos = carrito.length;
  let precioTotal = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  
  document.getElementById('total-productos').textContent = totalProductos;
  document.getElementById('precio-total').textContent = `$${precioTotal}`;
}

// boton de pago / volver
function procesarPago() {
  document.body.innerHTML = `
    <nav>
      <div class="logo">
        <a href="#">ECOMMERCE</a>
      </div>
      <div class="links">
        <a href="cargaprod.html">Cargar Productos</a>
      </div>
    </nav>
    <div class="mensaje">
      <h1>Gracias por su compra :)</h1>
      <button class="btn btn-secondary" id="boton-volver">Volver</button>
    </div>
  `;
  
//boton volver
let botonVolver = document.querySelector("#boton-volver");
  botonVolver.addEventListener("click", () => {
  localStorage.removeItem("carrito");
  window.location.href = "index.html";
});
}

//boton pagar
let botonPagar = document.querySelector("#boton-pagar");
botonPagar.addEventListener("click", procesarPago);

// Opcion para calcular el precio en cuotas
let selectCuotas = document.getElementById("cuotas");
selectCuotas.addEventListener("change", () => {

  let cuotas = parseInt(selectCuotas.value);
  let interes;
  if (cuotas === 3) {
    interes = 0.3;
  } else if (cuotas === 6) {
    interes = 0.7;
  } else if (cuotas === 12) {
    interes = 1;
  } else {
    interes = 0;
  }

  let precioTotalConInteres = Math.round(carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0) * (1 + interes));
  document.getElementById("precio-total-cuotas").innerText = `$${precioTotalConInteres}`;
});


// Agregando API de cotizacion del dolar
fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
  .then(response => response.json())
  .then(data => {
    let dolarBlue = data[1].casa.venta.replace(',', '.');
    let euro = data[2].casa.venta.replace(',', '.');
    document.getElementById('dolar-blue').innerHTML = dolarBlue;
    document.getElementById('euro').innerHTML = euro;
  })
  .catch(error => console.error(error));