const API_TOKEN = 'patrVscgFPKIc890m.62021d146b0f88863d6c1f62262786a495b4528eebd8ca53179b30c0fcc628';
const BASE_ID = 'appul61rDwdhr6xkN';
const TABLE_NAME = 'Productos';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

let carrito = [];

// ===================== OBTENER PRODUCTOS DESDE AIRTABLE =====================
async function obtenerProductos() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  const data = await res.json();

  data.records.forEach(record => {
    const { nombre, precio, imagen, categoria } = record.fields;
    const contenedor = document.getElementById(categoria);
    if (!contenedor) return;

    const prod = document.createElement('div');
    prod.className = 'producto';
    prod.innerHTML = `
      <img src="${imagen}" alt="${nombre}" />
      <h3>${nombre}</h3>
      <p class="precio">$${precio}</p>
      <button>Agregar al carrito</button>
    `;
    contenedor.appendChild(prod);

    prod.querySelector('button').addEventListener('click', () => {
      const idx = carrito.findIndex(item => item.nombre === nombre);
      if (idx !== -1) carrito[idx].cantidad++;
      else carrito.push({ nombre, precio, cantidad: 1 });
      actualizarCarrito();
      document.getElementById('carrito-sidebar').classList.add('abierto');
    });
  });
}

// ===================== CARRITO =====================
function toggleCarrito() {
  const sidebar = document.getElementById('carrito-sidebar');
  const flecha = document.getElementById('flecha');
  sidebar.classList.toggle('abierto');
  flecha.textContent = sidebar.classList.contains('abierto') ? '⬅️' : '➡️';
}

function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  const total = document.getElementById('carrito-total');
  const cantidad = document.getElementById('carrito-cantidad');
  const btnComprar = document.getElementById('btn-comprar');

  lista.innerHTML = '';
  let suma = 0, cant = 0;

  carrito.forEach((item, idx) => {
    suma += item.precio * item.cantidad;
    cant += item.cantidad;
    const li = document.createElement('li');
    li.className = 'carrito-item';
    li.innerHTML = `
      <span>${item.nombre} ($${item.precio})</span>
      <div>
        <button onclick="cambiarCantidad(${idx}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button onclick="cambiarCantidad(${idx}, 1)">+</button>
        <button onclick="eliminarProducto(${idx})">❌</button>
      </div>
    `;
    lista.appendChild(li);
  });

  total.textContent = `Total: $${suma.toLocaleString()}`;
  cantidad.textContent = `(${cant})`;
  btnComprar.style.display = carrito.length ? 'block' : 'none';
}

function cambiarCantidad(idx, delta) {
  carrito[idx].cantidad += delta;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  actualizarCarrito();
}

function eliminarProducto(idx) {
  carrito.splice(idx, 1);
  actualizarCarrito();
}

// ===================== MODALES Y CRUD DE PRODUCTOS =====================
function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

function agregarEventoEliminar(btn) {
  btn.addEventListener('click', () => {
    btn.parentElement.remove();
    llenarOpcionesEditar();
  });
}

function llenarOpcionesEditar() {
  const select = document.getElementById('select-producto');
  select.innerHTML = '';
  document.querySelectorAll('.lista-productos li').forEach((li, i) => {
    const nombre = li.querySelector('strong').innerText;
    const option = document.createElement('option');
    option.value = i;
    option.textContent = nombre;
    select.appendChild(option);
  });
}

function handleAgregarProducto(e) {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombre.value.trim();
  const descripcion = form.descripcion.value.trim();
  const precio = form.precio.value.trim();

  if (!nombre || !precio) {
    alert('Completa nombre y precio');
    return;
  }

  const ul = document.querySelector('.lista-productos .categoria-lista ul');
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${nombre}</strong> – $${precio}<br>
    ${descripcion}
    <button class="btn-eliminar" title="Eliminar">✖</button>
  `;
  ul.appendChild(li);
  agregarEventoEliminar(li.querySelector('.btn-eliminar'));

  form.reset();
  cerrarModal('modal-agregar');
  llenarOpcionesEditar();
}

function handleEditarProducto(e) {
  e.preventDefault();
  const form = e.target;
  const idx = parseInt(form.producto.value);
  const nuevoNombre = form.nuevoNombre.value.trim();
  const nuevaDesc = form.nuevaDescripcion.value.trim();
  const nuevoPrecio = form.nuevoPrecio.value.trim();

  const items = document.querySelectorAll('.lista-productos li');
  if (!items[idx]) return;

  const li = items[idx];
  li.innerHTML = `
    <strong>${nuevoNombre}</strong> – $${nuevoPrecio}<br>
    ${nuevaDesc}
    <button class="btn-eliminar" title="Eliminar">✖</button>
  `;
  agregarEventoEliminar(li.querySelector('.btn-eliminar'));

  cerrarModal('modal-editar');
  llenarOpcionesEditar();
}

// ===================== FORMULARIO CONTACTO =====================
function abrirModalContacto() {
  document.getElementById('modal-contacto').style.display = 'block';
}

function cerrarModalContacto() {
  cerrarModal('modal-contacto');
}

function validarContacto(e) {
  e.preventDefault();
  const { nombre, email, mensaje } = e.target;
  if (!nombre.value.trim() || !email.value.trim() || !mensaje.value.trim()) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  alert('Formulario enviado correctamente.');
  e.target.reset();
  cerrarModalContacto();
}

// ===================== INICIALIZACIÓN =====================
document.addEventListener('DOMContentLoaded', () => {
  obtenerProductos();

  document.getElementById('carrito-toggle').addEventListener('click', toggleCarrito);
  document.getElementById('btn-comprar').addEventListener('click', () => {
    if (!carrito.length) return;
    alert('Gracias por tu compra 🎉');
    carrito = [];
    actualizarCarrito();
  });

  document.getElementById('btn-agregar').addEventListener('click', () => {
    document.getElementById('modal-agregar').style.display = 'block';
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    llenarOpcionesEditar();
    document.getElementById('modal-editar').style.display = 'block';
  });

  document.getElementById('form-agregar').addEventListener('submit', handleAgregarProducto);
  document.getElementById('form-editar').addEventListener('submit', handleEditarProducto);

  document.querySelectorAll('.btn-eliminar').forEach(agregarEventoEliminar);

  document.getElementById('btn-abrir-modal').addEventListener('click', abrirModalContacto);
  document.getElementById('cerrar-modal').addEventListener('click', cerrarModalContacto);
  document.getElementById('form-contacto').addEventListener('submit', validarContacto);
  window.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-contacto')) cerrarModalContacto();
  });
});


