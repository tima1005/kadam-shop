/* =========================================================
   KADAM — JAVASCRIPT
   Django REST API + Vercel
========================================================= */


/* =========================================================
   API
========================================================= */

const API_BASE_URL = "https://kadam-backend.onrender.com";
const API_URL = `${API_BASE_URL}/api/products/`;

const WHATSAPP_NUMBER = "YOUR_NUMBER";


/* =========================================================
   STATE
========================================================= */

let products = [];
let currentProducts = [];

let currentFilter = "all";
let currentSort = "default";

let cart = [];
let favorites = [];


/* =========================================================
   DOM
========================================================= */

const catalogProducts = document.getElementById("catalogProducts");
const newProducts = document.getElementById("newProducts");
const bestProducts = document.getElementById("bestProducts");

const loading = document.getElementById("loading");
const emptyProducts = document.getElementById("emptyProducts");

const cartCount = document.getElementById("cartCount");
const favoriteCount = document.getElementById("favoriteCount");

const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const cartBtn = document.getElementById("cartBtn");

const productModal = document.getElementById("productModal");
const productDetail = document.getElementById("productDetail");
const closeProductModalBtn =
    document.getElementById("closeProductModal");

const searchPanel = document.getElementById("searchPanel");
const searchBtn = document.getElementById("searchBtn");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

const favoritesBtn =
    document.getElementById("favoritesBtn");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mobileNav =
    document.getElementById("mobileNav");

const backToTop =
    document.getElementById("backToTop");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const sortSelect =
    document.getElementById("sortSelect");

const filterChips =
    document.getElementById("filterChips");


/* =========================================================
   FALLBACK IMAGE
========================================================= */

function fallbackImage(img) {

    if (!img) return;

    img.onerror = null;
    img.src = "/images/product-1.jpg";

}


/* =========================================================
   IMAGE URL
========================================================= */

function getImageUrl(image) {

    if (!image) {
        return "/images/product-1.jpg";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return `${API_BASE_URL}${image}`;

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    try {

        if (loading) {
            loading.hidden = false;
        }

        if (emptyProducts) {
            emptyProducts.hidden = true;
        }

        const response = await fetch(API_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("DJANGO PRODUCTS:", data);


        const productList =
            Array.isArray(data)
                ? data
                : Array.isArray(data.results)
                    ? data.results
                    : [];


        products = productList.map(product => {

            let category = "";

            if (
                product.category &&
                typeof product.category === "object"
            ) {

                category =
                    product.category.name ||
                    product.category.title ||
                    "";

            } else {

                category =
                    product.category_name ||
                    product.category ||
                    "";

            }


            return {

                id: Number(product.id),

                name:
                    product.name ||
                    "Без названия",

                category: category,

                price:
                    Number(product.price) || 0,

                oldPrice:
                    product.old_price !== undefined &&
                    product.old_price !== null &&
                    product.old_price !== ""
                        ? Number(product.old_price)
                        : null,

                image:
                    getImageUrl(
                        product.image ||
                        product.image_url
                    ),

                badge:
                    product.badge ||
                    product.badge_name ||
                    "",

                description:
                    product.description ||
                    ""

            };

        });


        currentProducts = [...products];


        console.log(
            "Загружено товаров:",
            products.length
        );


        renderCatalog(
            getCurrentFilteredProducts()
        );

        renderNewProducts();
        renderBestProducts();


    } catch (error) {

        console.error(
            "Ошибка загрузки товаров:",
            error
        );


        if (loading) {
            loading.hidden = true;
        }

        if (emptyProducts) {

            emptyProducts.hidden = false;

            emptyProducts.innerHTML = `
                <h3>Не удалось загрузить товары</h3>
                <p>
                    Проверьте подключение к серверу.
                </p>
            `;

        }

    }

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productHTML(product) {

    if (!product) {
        return "";
    }


    const isFavorite =
        favorites.includes(
            Number(product.id)
        );


    const oldPriceHTML =
        product.oldPrice
            ? `
                <span class="old-price">
                    ${formatPrice(product.oldPrice)} сом
                </span>
            `
            : "";


    const badgeHTML =
        product.badge
            ? `
                <span class="product-badge">
                    ${escapeHTML(product.badge)}
                </span>
            `
            : "";


    return `

        <article
            class="product-card"
            data-id="${product.id}"
        >

            <div class="product-image">

                <img
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
                    loading="lazy"
                    onerror="fallbackImage(this)"
                >

                ${badgeHTML}

                <button
                    class="favorite-btn ${
                        isFavorite ? "active" : ""
                    }"
                    onclick="toggleFavorite(${product.id})"
                    type="button"
                    aria-label="Избранное"
                >
                    ${
                        isFavorite
                            ? "♥"
                            : "♡"
                    }
                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-price">

                    <strong>
                        ${formatPrice(product.price)} сом
                    </strong>

                    ${oldPriceHTML}

                </div>


                <div class="product-actions">

                    <button
                        class="btn"
                        onclick="openProduct(${product.id})"
                        type="button"
                    >
                        Подробнее
                    </button>

                    <button
                        class="cart-btn"
                        onclick="addToCart(${product.id})"
                        type="button"
                        aria-label="Добавить в корзину"
                    >
                        🛒
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


    const validList =
        (list || []).filter(Boolean);


    if (validList.length === 0) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML =
        validList
            .map(product => productHTML(product))
            .join("");

}


/* =========================================================
   CATALOG
========================================================= */

function renderCatalog(list) {

    const sorted =
        sortProducts(list || []);


    currentProducts = sorted;


    renderList(
        catalogProducts,
        sorted
    );


    if (loading) {
        loading.hidden = true;
    }


    if (emptyProducts) {

        emptyProducts.hidden =
            sorted.length !== 0;

    }

}


/* =========================================================
   NEW PRODUCTS
========================================================= */

function renderNewProducts() {

    const newItems =
        products
            .filter(product => {

                return (
                    product.badge &&
                    normalize(product.badge) === "new"
                );

            })
            .slice(0, 4);


    const result =
        newItems.length > 0
            ? newItems
            : products.slice(0, 4);


    renderList(
        newProducts,
        result
    );

}


/* =========================================================
   BEST PRODUCTS
========================================================= */

function renderBestProducts() {

    const bestItems = [
        products[1],
        products[3],
        products[5],
        products[4]
    ].filter(Boolean);


    renderList(
        bestProducts,
        bestItems
    );

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filterProducts(category) {

    currentFilter = category || "all";


    document
        .querySelectorAll(".filter-chip")
        .forEach(button => {

            const value =
                button.dataset.filter;

            button.classList.toggle(
                "active",
                normalize(value) ===
                normalize(currentFilter)
            );

        });


    if (
        !category ||
        normalize(category) === "all"
    ) {

        renderCatalog(products);

    } else {

        const filtered =
            products.filter(product => {

                return (
                    normalize(product.category) ===
                    normalize(category)
                );

            });


        renderCatalog(filtered);

    }


    document
        .getElementById("catalog")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   FILTER CHIPS
========================================================= */

if (filterChips) {

    filterChips
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

}


/* =========================================================
   SORT
========================================================= */

function sortProducts(list) {

    const result = [...list];


    if (currentSort === "price-asc") {

        result.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (currentSort === "price-desc") {

        result.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (currentSort === "name") {

        result.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    "ru"
                )
        );

    }


    return result;

}


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            currentSort =
                sortSelect.value;


            renderCatalog(
                getCurrentFilteredProducts()
            );

        }
    );

}


/* =========================================================
   GET CURRENT FILTERED PRODUCTS
========================================================= */

function getCurrentFilteredProducts() {

    if (
        !currentFilter ||
        normalize(currentFilter) === "all"
    ) {

        return [...products];

    }


    return products.filter(product => {

        return (
            normalize(product.category) ===
            normalize(currentFilter)
        );

    });

}


/* =========================================================
   OPEN PRODUCT
========================================================= */

function openProduct(id) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product || !productDetail) {
        return;
    }


    productDetail.innerHTML = `

        <div class="product-modal">

            <div class="product-modal-image">

                <img
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
                    onerror="fallbackImage(this)"
                >

            </div>


            <div class="product-modal-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>


                <div class="product-price">

                    <strong>
                        ${formatPrice(product.price)} сом
                    </strong>

                    ${
                        product.oldPrice
                            ? `
                                <span class="old-price">
                                    ${formatPrice(
                                        product.oldPrice
                                    )} сом
                                </span>
                            `
                            : ""
                    }

                </div>


                <p>
                    ${
                        escapeHTML(
                            product.description ||
                            "Современный товар KADAM."
                        )
                    }
                </p>


                <button
                    class="btn btn-dark"
                    onclick="
                        addToCart(${product.id});
                        closeProductModal();
                    "
                    type="button"
                >
                    Добавить в корзину
                </button>

            </div>

        </div>

    `;


    productModal?.classList.add("active");

}


/* =========================================================
   CLOSE PRODUCT
========================================================= */

function closeProductModal() {

    productModal?.classList.remove(
        "active"
    );

}


closeProductModalBtn?.addEventListener(
    "click",
    closeProductModal
);


productModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            closeProductModal();

        }

    }
);


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id) {

    id = Number(id);


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

        showToast(
            "Удалено из избранного"
        );

    } else {

        favorites.push(id);

        showToast(
            "Добавлено в избранное"
        );

    }


    updateFavoriteCount();


    renderCatalog(
        getCurrentFilteredProducts()
    );

    renderNewProducts();
    renderBestProducts();

}


/* =========================================================
   FAVORITES BUTTON
========================================================= */

favoritesBtn?.addEventListener(
    "click",
    () => {

        if (favorites.length === 0) {

            showToast(
                "Избранное пока пусто"
            );

            return;

        }


        const favoriteProducts =
            products.filter(product =>
                favorites.includes(
                    Number(product.id)
                )
            );


        currentFilter = "all";

        document
            .querySelectorAll(".filter-chip")
            .forEach(button =>
                button.classList.toggle(
                    "active",
                    button.dataset.filter === "all"
                )
            );


        renderCatalog(
            favoriteProducts
        );


        document
            .getElementById("catalog")
            ?.scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "Показаны избранные товары"
        );

    }
);


/* =========================================================
   FAVORITE COUNT
========================================================= */

function updateFavoriteCount() {

    if (!favoriteCount) {
        return;
    }


    favoriteCount.textContent =
        favorites.length;

}


/* =========================================================
   CART
========================================================= */

function addToCart(id) {

    id = Number(id);


    const product =
        products.find(
            item =>
                Number(item.id) === id
        );


    if (!product) {
        return;
    }


    const existing =
        cart.find(
            item =>
                Number(item.id) === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    updateCart();

    renderCart();

    showToast(
        `${product.name} добавлен в корзину`
    );

}


/* =========================================================
   REMOVE CART
========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    updateCart();
    renderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(id, change) {

    const item =
        cart.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    updateCart();
    renderCart();

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    if (!cartCount) {
        return;
    }


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        count;

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-products">

                <h3>Корзина пуста</h3>

                <p>
                    Добавьте товары в корзину.
                </p>

            </div>

        `;


        if (cartTotal) {
            cartTotal.textContent =
                "0 сом";
        }

        return;

    }


    cartItems.innerHTML =
        cart
            .map(item => {

                return `

                    <div class="cart-item">

                        <img
                            src="${escapeAttribute(
                                item.image
                            )}"
                            alt="${escapeAttribute(
                                item.name
                            )}"
                            onerror="fallbackImage(this)"
                        >


                        <div class="cart-item-info">

                            <h3>
                                ${escapeHTML(
                                    item.name
                                )}
                            </h3>

                            <strong>
                                ${formatPrice(
                                    item.price
                                )} сом
                            </strong>


                            <div class="quantity">

                                <button
                                    onclick="
                                        changeQuantity(
                                            ${item.id},
                                            -1
                                        )
                                    "
                                    type="button"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    onclick="
                                        changeQuantity(
                                            ${item.id},
                                            1
                                        )
                                    "
                                    type="button"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            onclick="
                                removeFromCart(
                                    ${item.id}
                                )
                            "
                            type="button"
                            aria-label="Удалить"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            })
            .join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    if (cartTotal) {

        cartTotal.textContent =
            `${formatPrice(total)} сом`;

    }

}


/* =========================================================
   OPEN CART
========================================================= */

cartBtn?.addEventListener(
    "click",
    () => {

        renderCart();

        cartDrawer?.classList.add(
            "active"
        );

        cartOverlay?.classList.add(
            "active"
        );

    }
);


/* =========================================================
   CLOSE CART
========================================================= */

function closeCartDrawer() {

    cartDrawer?.classList.remove(
        "active"
    );

    cartOverlay?.classList.remove(
        "active"
    );

}


closeCart?.addEventListener(
    "click",
    closeCartDrawer
);


cartOverlay?.addEventListener(
    "click",
    closeCartDrawer
);


/* =========================================================
   WHATSAPP
========================================================= */

checkoutBtn?.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Корзина пуста"
            );

            return;

        }


        if (
            !WHATSAPP_NUMBER ||
            WHATSAPP_NUMBER === "YOUR_NUMBER"
        ) {

            showToast(
                "Укажите номер WhatsApp в script.js"
            );

            return;

        }


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );


        let message =
            "Здравствуйте! Хочу заказать:%0A%0A";


        cart.forEach(item => {

            message +=
                `• ${item.name} — ` +
                `${item.quantity} шт. — ` +
                `${formatPrice(
                    item.price *
                    item.quantity
                )} сом%0A`;

        });


        message +=
            `%0AИтого: ${
                formatPrice(total)
            } сом`;


        window.open(
            `https://wa.me/${
                WHATSAPP_NUMBER
            }?text=${message}`,
            "_blank"
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

searchBtn?.addEventListener(
    "click",
    () => {

        searchPanel?.classList.add(
            "active"
        );

        searchInput?.focus();

    }
);


closeSearch?.addEventListener(
    "click",
    () => {

        searchPanel?.classList.remove(
            "active"
        );

        if (searchInput) {
            searchInput.value = "";
        }

        renderCatalog(
            getCurrentFilteredProducts()
        );

    }
);


searchInput?.addEventListener(
    "input",
    () => {

        const query =
            normalize(
                searchInput.value
            );


        if (!query) {

            renderCatalog(
                getCurrentFilteredProducts()
            );

            return;

        }


        const results =
            getCurrentFilteredProducts()
                .filter(product => {

                    return (
                        normalize(product.name)
                            .includes(query) ||

                        normalize(product.category)
                            .includes(query) ||

                        normalize(product.description)
                            .includes(query)
                    );

                });


        renderCatalog(results);

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

mobileMenuBtn?.addEventListener(
    "click",
    () => {

        mobileNav?.classList.toggle(
            "active"
        );

    }
);


mobileNav
    ?.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "active"
                );

            }
        );

    });


/* =========================================================
   BACK TO TOP
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!backToTop) {
            return;
        }


        backToTop.classList.toggle(
            "active",
            window.scrollY > 500
        );

    }
);


backToTop?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeProductModal();
            closeCartDrawer();

            searchPanel?.classList.remove(
                "active"
            );

            mobileNav?.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "active"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "active"
            );

        },
        2500
    );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("ru-RU");

}


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   START
========================================================= */

updateCart();
updateFavoriteCount();

loadProducts();