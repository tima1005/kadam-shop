/* =========================================================
   KADAM — JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCTS
========================================================= */

const products = [
    {
        id: 1,
        name: "Oversize Basic Tee",
        category: "Футболки",
        price: 1890,
        oldPrice: null,
        image: "/images/product-1.jpg",
        badge: "NEW"
    },

    {
        id: 1,
        name: "Oversize Basic Tee",
        category: "Футболки",
        price: 1890,
        oldPrice: null,
        image: "/images/product-1.jpg",
        badge: "NEW"
    },

    {
        id: 1,
        name: "Oversize Basic Tee",
        category: "Футболки",
        price: 1890,
        oldPrice: null,
        image: "/images/product-1.jpg",
        badge: "NEW"
    },

    {
        id: 2,
        name: "KADAM Sneakers",
        category: "Обувь",
        price: 4490,
        oldPrice: 5290,
        image: "/images/product-2.jpg",
        badge: "-15%"
    },

    {
        id: 3,
        name: "Urban Headphones",
        category: "Аксессуары",
        price: 3490,
        oldPrice: null,
        image: "/images/product-3.jpg",
        badge: "NEW"
    },

    {
        id: 4,
        name: "Classic Jacket",
        category: "Куртки",
        price: 5990,
        oldPrice: 6990,
        image: "/images/product-1.jpg",
        badge: "-14%"
    },

    {
        id: 5,
        name: "Cargo Pants",
        category: "Штаны",
        price: 3490,
        oldPrice: null,
        image: "/images/product-1.jpg",
        badge: "NEW"
    },

    {
        id: 6,
        name: "Premium Hoodie",
        category: "Футболки",
        price: 3990,
        oldPrice: 4490,
        image: "/images/product-1.jpg",
        badge: "-11%"
    },

    {
        id: 7,
        name: "Minimal Watch",
        category: "Аксессуары",
        price: 2990,
        oldPrice: null,
        image: "/images/product-3.jpg",
        badge: "NEW"
    },

    {
        id: 8,
        name: "Everyday Shirt",
        category: "Рубашки",
        price: 2990,
        oldPrice: null,
        image: "/images/product-1.jpg",
        badge: "NEW"
    }
];


/* =========================================================
   STATE
========================================================= */

let cart = [];
let favorites = [];

let currentProducts = [...products];
let currentFilter = "all";


/* =========================================================
   DOM
========================================================= */

const catalogProducts =
    document.getElementById("catalogProducts");

const newProducts =
    document.getElementById("newProducts");

const bestProducts =
    document.getElementById("bestProducts");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const favoriteCount =
    document.getElementById("favoriteCount");

const productModal =
    document.getElementById("productModal");

const productDetail =
    document.getElementById("productDetail");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const backToTop =
    document.getElementById("backToTop");

const searchPanel =
    document.getElementById("searchPanel");

const searchInput =
    document.getElementById("searchInput");

const mobileNav =
    document.getElementById("mobileNav");


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function fallbackImage(image) {

    if (!image.dataset.fallback) {

        image.dataset.fallback = "true";

        image.src =
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80";
    }
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {
    return `${price.toLocaleString("ru-RU")} сом`;
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   PRODUCT HTML
========================================================= */

function productHTML(product) {

    const isFavorite =
        favorites.includes(product.id);

    const hasSale =
        product.oldPrice &&
        product.oldPrice > product.price;

    return `
        <article
            class="product-card"
            data-id="${product.id}"
            onclick="openProduct(${product.id})"
        >

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="fallbackImage(this)"
                >

                ${
                    product.badge
                    ?
                    `
                        <span
                            class="product-badge ${
                                hasSale ? "sale" : ""
                            }"
                        >
                            ${product.badge}
                        </span>
                    `
                    : ""
                }


                <button
                    class="favorite-btn ${
                        isFavorite ? "active" : ""
                    }"
                    onclick="
                        event.stopPropagation();
                        toggleFavorite(${product.id});
                    "
                    type="button"
                    aria-label="Добавить в избранное"
                >
                    <i class="${
                        isFavorite
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-heart"></i>
                </button>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">

                    <span class="current-price">
                        ${formatPrice(product.price)}
                    </span>

                    ${
                        product.oldPrice
                        ?
                        `
                            <span class="old-price">
                                ${formatPrice(product.oldPrice)}
                            </span>
                        `
                        : ""
                    }

                </div>


                <div class="product-actions">

                    <button
                        onclick="
                            event.stopPropagation();
                            addToCart(${product.id});
                        "
                        type="button"
                    >
                        В корзину
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER LIST
========================================================= */

function renderList(container, list) {

    if (!container) {
        return;
    }

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-products">
                <i class="fa-regular fa-face-frown"></i>
                <p>Товары не найдены</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        list.map(productHTML).join("");
}


/* =========================================================
   RENDER CATALOG
========================================================= */

function renderCatalog(list = currentProducts) {

    currentProducts = [...list];

    renderList(
        catalogProducts,
        currentProducts
    );
}


/* =========================================================
   RENDER NEW
========================================================= */

function renderNewProducts() {

    const newItems =
        products.filter(
            product => product.badge === "NEW"
        );

    renderList(
        newProducts,
        newItems.slice(0, 4)
    );
}


/* =========================================================
   RENDER BEST
========================================================= */

function renderBestProducts() {

    const bestItems = [
        products[1],
        products[3],
        products[5],
        products[4]
    ];

    renderList(
        bestProducts,
        bestItems
    );
}


/* =========================================================
   OPEN PRODUCT
========================================================= */

function openProduct(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const isFavorite =
        favorites.includes(product.id);

    productDetail.innerHTML = `
        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="fallbackImage(this)"
                >

            </div>


            <div class="product-detail-info">

                <div class="product-detail-category">
                    ${product.category}
                </div>

                <h2>
                    ${product.name}
                </h2>

                <div class="product-detail-price">
                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                        ?
                        `
                            <span class="old-price">
                                ${formatPrice(product.oldPrice)}
                            </span>
                        `
                        : ""
                    }
                </div>

                <p class="product-detail-description">
                    Современный товар KADAM.
                    Подходит для повседневного образа,
                    отличается удобством и современным дизайном.
                </p>


                <button
                    class="btn btn-dark"
                    onclick="addToCartFromProduct(${product.id})"
                    type="button"
                >
                    Добавить в корзину
                    <i class="fa-solid fa-bag-shopping"></i>
                </button>


                <button
                    class="btn ${
                        isFavorite
                        ? "btn-dark"
                        : "btn-outline-modal"
                    }"
                    onclick="toggleFavorite(${product.id})"
                    type="button"
                    style="margin-top:10px;"
                >
                    ${
                        isFavorite
                        ? "В избранном"
                        : "Добавить в избранное"
                    }

                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

        </div>
    `;

    productModal.classList.add("active");

    document.body.classList.add("no-scroll");
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    productModal.classList.remove("active");

    document.body.classList.remove("no-scroll");
}


/* =========================================================
   ADD TO CART FROM PRODUCT
========================================================= */

function addToCartFromProduct(id) {

    addToCart(id);

    closeProductModal();

    openCart();
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    showToast(
        `${product.name} добавлен в корзину`
    );
}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const totalQuantity =
        cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    const totalPrice =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity;

    cartTotal.textContent =
        formatPrice(totalPrice);


    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <p>
                    Ваша корзина пуста
                </p>

            </div>
        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        onerror="fallbackImage(this)"
                    >

                </div>


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <div class="cart-item-price">
                        ${formatPrice(item.price)}
                    </div>


                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(
                                ${item.id},
                                -1
                            )"
                            type="button"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(
                                ${item.id},
                                1
                            )"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    onclick="removeFromCart(${item.id})"
                    type="button"
                    aria-label="Удалить"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `).join("");
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(product => product.id === id);

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product => product.id !== id
            );
    }

    updateCart();
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            product => product.id !== id
        );

    updateCart();

    showToast("Товар удалён из корзины");
}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    cartDrawer.classList.add("open");

    cartOverlay.classList.add("active");

    document.body.classList.add("no-scroll");
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    cartDrawer.classList.remove("open");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");
}


/* =========================================================
   TOGGLE FAVORITE
========================================================= */

function toggleFavorite(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) {
        return;
    }


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId => favoriteId !== id
            );

        showToast(
            `${product.name} удалён из избранного`
        );

    } else {

        favorites.push(id);

        showToast(
            `${product.name} добавлен в избранное`
        );
    }


    favoriteCount.textContent =
        favorites.length;


    renderCatalog(currentProducts);


    renderNewProducts();

    renderBestProducts();


    if (productModal.classList.contains("active")) {
        openProduct(id);
    }
}


/* =========================================================
   SHOW FAVORITES
========================================================= */

function showFavorites() {

    if (!favorites.length) {

        showToast(
            "В избранном пока ничего нет"
        );

        return;
    }


    const favoriteProducts =
        products.filter(
            product =>
                favorites.includes(product.id)
        );


    currentFilter = "favorites";

    renderCatalog(favoriteProducts);

    document
        .getElementById("catalog")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filterProducts(category) {

    currentFilter = category;

    let filtered;


    if (category === "all") {

        filtered = [...products];

    } else {

        filtered =
            products.filter(
                product =>
                    product.category === category
            );
    }


    updateFilterButtons(category);

    renderCatalog(filtered);


    const catalog =
        document.getElementById("catalog");

    if (catalog) {

        catalog.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================================================
   UPDATE FILTER BUTTONS
========================================================= */

function updateFilterButtons(category) {

    document
        .querySelectorAll(".filter-chip")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === category
            );

        });
}


/* =========================================================
   SEARCH
========================================================= */

function searchProducts() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        filterProducts("all");

        return;
    }


    const results =
        products.filter(product => {

            return (
                product.name
                    .toLowerCase()
                    .includes(query)
                ||
                product.category
                    .toLowerCase()
                    .includes(query)
            );
        });


    currentFilter = "search";

    updateFilterButtons("");

    renderCatalog(results);
}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkoutWhatsApp() {

    if (!cart.length) {

        showToast(
            "Сначала добавьте товар в корзину"
        );

        return;
    }


    /*
        ВАЖНО:

        Вместо YOUR_NUMBER поставь свой номер.

        Например:

        const phone = "996700123456";
    */

    const phone = "YOUR_NUMBER";


    if (phone === "YOUR_NUMBER") {

        showToast(
            "Укажи номер WhatsApp в script.js"
        );

        return;
    }


    let message =
        "Здравствуйте! Хочу заказать:%0A%0A";


    cart.forEach(item => {

        message +=
            `• ${item.name} — ${item.quantity} шт. — ${item.price * item.quantity} сом%0A`;

    });


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    message +=
        `%0AИтого: ${total} сом`;


    const url =
        `https://wa.me/${phone}?text=${message}`;


    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   SEARCH OPEN / CLOSE
========================================================= */

function openSearch() {

    searchPanel.classList.add("open");

    setTimeout(() => {
        searchInput.focus();
    }, 100);
}


function closeSearchPanel() {

    searchPanel.classList.remove("open");

    searchInput.value = "";
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    mobileNav.classList.toggle("open");

    const icon =
        document.querySelector(
            "#mobileMenuBtn i"
        );


    if (
        mobileNav.classList.contains("open")
    ) {

        icon.className =
            "fa-solid fa-xmark";

    } else {

        icon.className =
            "fa-solid fa-bars";
    }
}


/* =========================================================
   EVENT LISTENERS
========================================================= */


/* Cart */

document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* Favorites */

document
    .getElementById("favoritesBtn")
    .addEventListener(
        "click",
        showFavorites
    );


/* Search */

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        openSearch
    );


document
    .getElementById("closeSearch")
    .addEventListener(
        "click",
        closeSearchPanel
    );


searchInput.addEventListener(
    "input",
    searchProducts
);


/* Mobile */

document
    .getElementById("mobileMenuBtn")
    .addEventListener(
        "click",
        toggleMobileMenu
    );


document
    .querySelectorAll(".mobile-nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "open"
                );

                const icon =
                    document.querySelector(
                        "#mobileMenuBtn i"
                    );

                icon.className =
                    "fa-solid fa-bars";
            }
        );

    });


/* Filter */

document
    .querySelectorAll(".filter-chip")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterProducts(
                    button.dataset.filter
                );

            }
        );

    });


/* Sort */

document
    .getElementById("sortSelect")
    .addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            const sorted =
                [...currentProducts];


            if (value === "price-asc") {

                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );

            } else if (
                value === "price-desc"
            ) {

                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );

            } else if (
                value === "name"
            ) {

                sorted.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );
            }


            renderCatalog(sorted);
        }
    );


/* Checkout */

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        checkoutWhatsApp
    );


/* Close product modal */

document
    .getElementById("closeProductModal")
    .addEventListener(
        "click",
        closeProductModal
    );


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target === productModal
        ) {
            closeProductModal();
        }

    }
);


/* Escape */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeCart();

        closeProductModal();

        closeSearchPanel();

    }
);


/* Back to top */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");
        }

    }
);


backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   INIT
========================================================= */

renderCatalog(products);

renderNewProducts();

renderBestProducts();

updateCart();

favoriteCount.textContent =
    favorites.length;