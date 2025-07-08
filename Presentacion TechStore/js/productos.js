document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});

function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoExistente = carrito.find(p => p.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-contenido");
    contenedor.innerHTML = "";
    let total = 0;

    fetch("data/productos.json")
        .then(res => res.json())
        .then(productos => {
            carrito.forEach(item => {
                const prod = productos.find(p => p.id === item.id);
                total += prod.precio * item.cantidad;

                const div = document.createElement("div");
                div.classList.add("item-carrito");
                div.innerHTML = `
          <h4>${prod.nombre}</h4>
          <p>Precio unitario: $${prod.precio}</p>
          <p>Cantidad: 
            <button onclick="modificarCantidad(${prod.id}, -1)">-</button>
            ${item.cantidad}
            <button onclick="modificarCantidad(${prod.id}, 1)">+</button>
            <button onclick="eliminarDelCarrito(${prod.id})">🗑️</button>
          </p>
          <hr>
        `;
                contenedor.appendChild(div);
            });

            document.getElementById("total-carrito").textContent = `Total: $${total.toLocaleString()}`;
        });
}

function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}
