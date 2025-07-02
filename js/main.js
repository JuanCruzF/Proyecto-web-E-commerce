// Variables globales
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
let productModal = null;
let currentCategory = "all";

// Elementos del DOM
const productsContainer = document.getElementById("productsContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const searchInput = document.getElementById("searchInput");
const filterContainer = document.getElementById("filterContainer");

const cartBtn = document.getElementById("cartBtn");
const cartBadge = document.getElementById("cartBadge");
const cartBtnMobile = document.getElementById("cartBtnMobile");
const cartBadgeMobile = document.getElementById("cartBadgeMobile");

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const addToCartBtn = document.getElementById("addToCartBtn");

document.addEventListener("DOMContentLoaded", function () {
  productModal = new bootstrap.Modal(document.getElementById("productModal"));
  initializeApp();
  setupEventListeners();
  updateCartUI();
});

async function initializeApp() {
  try {
    showLoading();
    await loadProducts();
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    showError("Error al cargar los productos. Por favor, recarga la página.");
  } finally {
    hideLoading();
  }
}

async function loadProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allProducts = await response.json();
    applyFiltersAndRender();
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    showError(
      "No se pudieron cargar los productos. Verifica tu conexión a internet."
    );
    throw error;
  }
}

function applyFiltersAndRender() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filteredProducts =
    currentCategory === "all"
      ? [...allProducts]
      : allProducts.filter((product) => product.category === currentCategory);

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  renderProducts(filteredProducts);
}

function renderProducts(products) {
  if (!productsContainer) return;
  if (products.length === 0) {
    productsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="text-center py-5">
                            <i class="bi bi-search" style="font-size: 4rem; color: var(--text-secondary); opacity: 0.5;"></i>
                            <h3 class="mt-3">No se encontraron productos</h3>
                            <p class="text-muted">Intenta con otra categoría o término de búsqueda.</p>
                        </div>
                    </div>`;
    return;
  }

  productsContainer.innerHTML = products
    .map(
      (product) => `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex">
                    <article class="product-card fade-in" data-product-id="${
                      product.id
                    }">
                        <div class="product-image">
                            <img src="${product.image}" alt="${
        product.title
      }" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400x400/f8fafc/64748b?text=Imagen+no+disponible';">
                        </div>
                        <div class="product-info">
                            <div class="product-category">${
                              product.category
                            }</div>
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-rating">
                                <div class="stars">${generateStars(
                                  product.rating.rate
                                )}</div>
                                <span class="rating-text">(${
                                  product.rating.count
                                })</span>
                            </div>
                            <div class="product-price">$${product.price.toFixed(
                              2
                            )}</div>
                            <button class="view-details-btn" data-product-id="${
                              product.id
                            }" aria-label="Ver detalles de ${product.title}">
                                Ver Detalles
                            </button>
                        </div>
                    </article>
                </div>
            `
    )
    .join("");
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="bi bi-star-fill"></i>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<i class="bi bi-star-half"></i>';
    } else {
      stars += '<i class="bi bi-star"></i>';
    }
  }
  return stars;
}

function openProductModal(productId) {
  currentProduct = allProducts.find((p) => p.id === productId);
  if (!currentProduct) return;

  document.getElementById("modalProductImage").src = currentProduct.image;
  document.getElementById("modalProductImage").alt = currentProduct.title;
  document.getElementById("modalProductTitle").textContent =
    currentProduct.title;
  document.getElementById(
    "modalProductPrice"
  ).textContent = `$${currentProduct.price.toFixed(2)}`;
  document.getElementById("modalProductDescription").textContent =
    currentProduct.description;

  document.getElementById("modalProductRating").innerHTML = `
                <div class="stars">${generateStars(
                  currentProduct.rating.rate
                )}</div>
                <span class="rating-text">(${
                  currentProduct.rating.count
                } reseñas) - ${currentProduct.rating.rate.toFixed(1)}/5</span>`;

  productModal.show();
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartStorage();
  updateCartUI();

  Swal.fire({
    title: "¡Producto agregado!",
    text: `${product.title} se agregó al carrito.`,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartBadge.textContent = totalItems;
  cartBadgeMobile.textContent = totalItems;
  cartBadge.classList.toggle("visible", totalItems > 0);
  cartBadgeMobile.classList.toggle("visible", totalItems > 0);

  cartTotal.textContent = totalPrice.toFixed(2);

  renderCartItems();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="bi bi-cart-x"></i>
                        <h4>Tu carrito está vacío</h4>
                        <p>Agrega algunos productos para continuar</p>
                    </div>`;
    checkoutBtn.disabled = true;
    clearCartBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  clearCartBtn.disabled = false;

  cartItems.innerHTML = cart
    .map(
      (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${
        item.title
      }" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="cart-item-controls">
                                <button class="qty-btn" data-id="${
                                  item.id
                                }" data-change="-1" ${
        item.quantity <= 1 ? "disabled" : ""
      } aria-label="Reducir cantidad"><i class="bi bi-dash"></i></button>
                                <span class="qty-display">${
                                  item.quantity
                                }</span>
                                <button class="qty-btn" data-id="${
                                  item.id
                                }" data-change="1" aria-label="Aumentar cantidad"><i class="bi bi-plus"></i></button>
                            </div>
                            <div class="cart-item-price">$${(
                              item.price * item.quantity
                            ).toFixed(2)}</div>
                            <button class="remove-item-btn" data-id="${
                              item.id
                            }" aria-label="Eliminar producto"><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartStorage();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartStorage();
  updateCartUI();
}

function clearCart() {
  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos del carrito.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      updateCartStorage();
      updateCartUI();
      Swal.fire(
        "¡Carrito vaciado!",
        "Todos los productos fueron eliminados.",
        "success"
      );
    }
  });
}

function checkout() {
  if (cart.length === 0) {
    Swal.fire(
      "Carrito vacío",
      "Agrega productos antes de finalizar la compra.",
      "warning"
    );
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  Swal.fire({
    title: "¡Compra realizada!",
    html: `
                    <div class="text-center">
                        <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: var(--success-color);"></i>
                        <h4 class="mt-3">¡Gracias por tu compra!</h4>
                        <p>Total pagado: <strong>$${total.toFixed(
                          2
                        )}</strong></p>
                        <p>Recibirás una confirmación por email.</p>
                    </div>`,
    icon: "success",
    confirmButtonText: "Continuar comprando",
  }).then(() => {
    cart = [];
    updateCartStorage();
    updateCartUI();
    closeCartSidebar();
  });
}

function openCartSidebar() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartSidebar() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function showLoading() {
  if (loadingSpinner) loadingSpinner.style.display = "flex";
}
function hideLoading() {
  if (loadingSpinner) loadingSpinner.style.display = "none";
}

function showError(message) {
  hideLoading();
  if (!productsContainer) return;
  productsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-2"></i>
                        <h4 class="alert-heading mt-2">Error</h4>
                        <p>${message}</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="bi bi-arrow-clockwise"></i> Reintentar
                        </button>
                    </div>
                </div>`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function setupEventListeners() {
  searchInput.addEventListener(
    "input",
    debounce(() => applyFiltersAndRender(), 300)
  );

  filterContainer.addEventListener("click", (e) => {
    const target = e.target.closest(".filter-btn");
    if (!target) return;

    filterContainer.querySelector(".active").classList.remove("active");
    target.classList.add("active");

    currentCategory = target.dataset.category;
    const placeholderText =
      currentCategory === "all"
        ? "Buscar en todos los productos..."
        : `Buscar en ${target.textContent}...`;
    searchInput.placeholder = placeholderText;

    applyFiltersAndRender();
  });

  cartBtn.addEventListener("click", openCartSidebar);
  cartBtnMobile.addEventListener("click", openCartSidebar);
  closeCart.addEventListener("click", closeCartSidebar);
  cartOverlay.addEventListener("click", closeCartSidebar);

  checkoutBtn.addEventListener("click", checkout);
  clearCartBtn.addEventListener("click", clearCart);

  addToCartBtn.addEventListener("click", () => {
    if (currentProduct) {
      addToCart(currentProduct);
      productModal.hide();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartSidebar.classList.contains("active")) {
      closeCartSidebar();
    }
  });

  productsContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".view-details-btn");
    if (button) {
      const productId = parseInt(button.dataset.productId, 10);
      openProductModal(productId);
    }
  });

  cartItems.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const productId = parseInt(target.dataset.id, 10);

    if (target.classList.contains("qty-btn")) {
      const change = parseInt(target.dataset.change, 10);
      updateQuantity(productId, change);
    } else if (target.classList.contains("remove-item-btn")) {
      removeFromCart(productId);
    }
  });

  document.getElementById("footerYear").textContent = new Date().getFullYear();
}
