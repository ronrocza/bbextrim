const products = [
  {
    id: 1, name: "Smart Lamp Mini", category: "Tecnología", price: 29.90, oldPrice: 39.90,
    badge: "Más vendido", desc: "Iluminación inteligente y compacta para cualquier espacio.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2, name: "Organizador Multiuso", category: "Hogar", price: 18.50, oldPrice: 24.90,
    badge: "Oferta", desc: "Mantén tus espacios ordenados de forma práctica y elegante.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3, name: "Botella Smart", category: "Bienestar", price: 34.90, oldPrice: null,
    badge: "Nuevo", desc: "Diseño moderno para acompañarte durante todo el día.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4, name: "Auriculares Pro", category: "Tecnología", price: 49.90, oldPrice: 64.90,
    badge: "Top", desc: "Sonido envolvente y comodidad para música y llamadas.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5, name: "Mini Aspiradora", category: "Hogar", price: 27.90, oldPrice: 35.90,
    badge: "Práctico", desc: "Limpieza rápida para escritorio, auto y pequeños rincones.",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6, name: "Masajeador Portátil", category: "Bienestar", price: 39.90, oldPrice: 49.90,
    badge: "Oferta", desc: "Una solución compacta para relajarte después de un día intenso.",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7, name: "Mochila Urbana", category: "Accesorios", price: 44.90, oldPrice: null,
    badge: "Nuevo", desc: "Diseño funcional para trabajo, estudio y viajes.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8, name: "Soporte Ajustable", category: "Accesorios", price: 21.90, oldPrice: 28.90,
    badge: "Favorito", desc: "Eleva tu dispositivo y mejora tu postura de trabajo.",
    image: "https://images.unsplash.com/photo-1616353071588-6d5f9b8e2e67?auto=format&fit=crop&w=900&q=85"
  }
];

let cart = JSON.parse(localStorage.getItem("bbextrim-cart") || "[]");

const money = value => `$${value.toFixed(2)}`;

function saveCart() {
  localStorage.setItem("bbextrim-cart", JSON.stringify(cart));
}

function showToast(message) {
  const toastEl = document.getElementById("liveToast");
  toastEl.querySelector(".toast-body").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }).show();
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");

  if (!list.length) {
    grid.innerHTML = "";
    empty.classList.remove("d-none");
    return;
  }
  empty.classList.add("d-none");

  grid.innerHTML = list.map(p => `
    <div class="col-6 col-lg-3">
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="product-badge">${p.badge}</span>
          <button class="product-fav" aria-label="Añadir a favoritos"><i class="bi bi-heart"></i></button>
        </div>
        <div class="product-body">
          <div class="product-category">${p.category}</div>
          <div class="product-title">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="mt-2">
            <span class="product-price">${money(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old">${money(p.oldPrice)}</span>` : ""}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">
            <i class="bi bi-bag-plus me-1"></i> Añadir al carrito
          </button>
          <button class="btn btn-link btn-sm text-secondary p-0 mt-2" onclick="showProduct(${p.id})">
            Ver detalles
          </button>
        </div>
      </article>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  showToast(`${product.name} fue añadido al carrito.`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  const countEl = document.getElementById("cartCount");
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = totalQty;

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div>
          <i class="bi bi-bag-x"></i>
          <h5 class="mt-3">Tu carrito está vacío</h5>
          <p class="small">Añade productos para comenzar tu compra.</p>
        </div>
      </div>`;
    summaryEl.classList.add("d-none");
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    const line = p.price * item.qty;
    subtotal += line;
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" class="cart-thumb">
        <div class="flex-grow-1">
          <h6>${p.name}</h6>
          <small>${money(p.price)} · ${p.category}</small>
          <div class="qty-control">
            <button onclick="changeQty(${p.id}, -1)" aria-label="Reducir">−</button>
            <strong class="small">${item.qty}</strong>
            <button onclick="changeQty(${p.id}, 1)" aria-label="Aumentar">+</button>
            <button class="border-0 bg-transparent text-danger ms-auto" onclick="removeFromCart(${p.id})" aria-label="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <strong class="small">${money(line)}</strong>
      </div>`;
  }).join("");

  document.getElementById("cartSubtotal").textContent = money(subtotal);
  summaryEl.classList.remove("d-none");
}

function showProduct(id) {
  const p = products.find(x => x.id === id);
  document.getElementById("productModalBody").innerHTML = `
    <div class="p-3">
      <img src="${p.image}" alt="${p.name}" class="modal-product-image">
      <div class="p-2 pt-4">
        <div class="product-category">${p.category}</div>
        <h3 class="mt-1">${p.name}</h3>
        <p class="text-muted">${p.desc}</p>
        <div class="fs-4 fw-bold">${money(p.price)}
          ${p.oldPrice ? `<small class="text-muted text-decoration-line-through fs-6 ms-1">${money(p.oldPrice)}</small>` : ""}
        </div>
        <button class="btn btn-primary-custom w-100 mt-3" onclick="addToCart(${p.id}); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();">
          <i class="bi bi-bag-plus me-2"></i>Añadir al carrito
        </button>
      </div>
    </div>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
}

function filterProducts() {
  const category = document.getElementById("categoryFilter").value;
  const term = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p => {
    const matchesCategory = category === "Todos" || p.category === category;
    const matchesSearch = !term || `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
  renderProducts(filtered);
}

document.getElementById("categoryFilter").addEventListener("change", filterProducts);
document.getElementById("searchInput").addEventListener("input", filterProducts);

document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.toggle("open");
  if (document.getElementById("searchPanel").classList.contains("open")) {
    document.getElementById("searchInput").focus();
  }
});
document.getElementById("searchClose").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.remove("open");
});

document.querySelectorAll(".category-card").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("categoryFilter").value = btn.dataset.category;
    filterProducts();
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  showToast("¡Gracias! Te has suscrito a las novedades de BBextrim.");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  showToast("Checkout de demostración. Aquí puedes integrar tu pasarela de pago.");
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
