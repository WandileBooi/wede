
// ======================================
// THE BAKE HOUSE - MAIN JAVASCRIPT
// ======================================


// ======================================
// 1. FAQ ACCORDION
// ======================================

document.querySelectorAll(".faq-question").forEach(function (question) {

    question.addEventListener("click", function () {

        const answer = question.nextElementSibling;
        const symbol = question.querySelector("span");

        if (answer.style.maxHeight) {

            answer.style.maxHeight = null;
            symbol.textContent = "+";

        } else {

            answer.style.maxHeight = answer.scrollHeight + "px";
            symbol.textContent = "-";

        }

    });

});


// ======================================
// 2. IMAGE GALLERY / LIGHTBOX
// ======================================

const galleryImages = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeButton = document.getElementById("closeLightbox");

// Only run if the lightbox exists on the page

if (lightbox && lightboxImage && closeButton) {

    galleryImages.forEach(function (image) {

        image.addEventListener("click", function () {

            lightbox.style.display = "flex";
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

        });

    });

    closeButton.addEventListener("click", function () {

        lightbox.style.display = "none";

    });

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            lightbox.style.display = "none";
        }

    });

}


// ======================================
// 3. CONTACT FORM
// ======================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        const formMessage = document.getElementById("formMessage");

        // Check required fields

        if (name === "" || email === "" || phone === "" || message === "") {

            formMessage.textContent = "Please complete all fields.";
            formMessage.style.color = "red";
            return;

        }

        // Validate email

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "red";
            return;

        }

        // Validate phone number

        const phonePattern = /^[0-9+\-\s]{7,15}$/;

        if (!phonePattern.test(phone)) {

            formMessage.textContent = "Please enter a valid phone number.";
            formMessage.style.color = "red";
            return;

        }

        // Prepare email

        const subject = "Contact Form - The Bake House";

        const emailBody =
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n\n" +
            "Message: " + message;

        const bakeryEmail = "YOUR-EMAIL@example.com";

        const mailLink = "mailto:" + bakeryEmail +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(emailBody);

        formMessage.textContent = "Opening your email application...";
        formMessage.style.color = "green";

        window.location.href = mailLink;

    });

}


// ======================================
// 4. SHOPPING CART
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    // Get cart elements
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartButton = document.getElementById("clearCart");

    // Load saved cart
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("bakeryCart")) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        cart = [];
    }

    // Save cart
    function saveCart() {
        localStorage.setItem("bakeryCart", JSON.stringify(cart));
    }

    // Display cart products
    function displayCart() {

        // Only display products if the cart section exists
        if (!cartItems || !cartTotal) {
            return;
        }

        cartItems.innerHTML = "";

        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML =
                '<p class="empty-cart">Your cart is currently empty.</p>';
        }

        cart.forEach(function (item, index) {

            const subtotal = item.price * item.quantity;
            total += subtotal;

            const product = document.createElement("div");
            product.className = "cart-item";

            const details = document.createElement("div");

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const price = document.createElement("p");
            price.textContent = "Price: R " + item.price.toFixed(2);

            const itemSubtotal = document.createElement("p");
            itemSubtotal.textContent = "Subtotal: R " + subtotal.toFixed(2);

            details.append(heading, price, itemSubtotal);

            // Quantity controls
            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.textContent = "-";
            decreaseButton.dataset.action = "decrease";
            decreaseButton.dataset.index = index;

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.textContent = "+";
            increaseButton.dataset.action = "increase";
            increaseButton.dataset.index = index;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.dataset.action = "remove";
            removeButton.dataset.index = index;

            controls.append(
                decreaseButton,
                quantity,
                increaseButton,
                removeButton
            );

            product.append(details, controls);
            cartItems.appendChild(product);
        });

        cartTotal.textContent = "R " + total.toFixed(2);

        saveCart();
    }

    // ADD PRODUCTS TO CART
    // This must work even when the cart section is not on the page.

    document.querySelectorAll(".add-to-cart").forEach(function (button) {

        button.addEventListener("click", function () {

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            if (!name || !Number.isFinite(price) || price <= 0) {
                return;
            }

            const existingProduct = cart.find(function (item) {
                return item.name === name;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            saveCart();

            alert(name + " has been added to your cart!");

            displayCart();
        });
    });

    // INCREASE, DECREASE OR REMOVE PRODUCTS
    if (cartItems) {

        cartItems.addEventListener("click", function (event) {

            const button = event.target.closest("button");

            if (!button) {
                return;
            }

            const index = Number(button.dataset.index);
            const action = button.dataset.action;

            if (!cart[index]) {
                return;
            }

            if (action === "increase") {
                cart[index].quantity++;
            }

            else if (action === "decrease") {
                cart[index].quantity--;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }

            else if (action === "remove") {
                cart.splice(index, 1);
            }

            displayCart();
        });
    }

    // CLEAR CART
    if (clearCartButton) {

        clearCartButton.addEventListener("click", function () {

            cart = [];

            displayCart();
        });
    }

    // Display saved products when cart.html opens
    displayCart();

});

// ======================================
// 5. PRODUCT SEARCH
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const searchToggle = document.getElementById("searchToggle");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Open and close search box
    if (searchToggle && searchBox) {

        searchToggle.addEventListener("click", function () {
            searchBox.classList.toggle("active");

            if (searchBox.classList.contains("active")) {
                searchInput.focus();
            }
        });
    }

    // Search products
    function searchProducts() {

        const searchValue = searchInput.value.toLowerCase().trim();

        const products = document.querySelectorAll(".products .box");

        products.forEach(function (product) {

            const productName = product.querySelector("h3")
                .textContent.toLowerCase();

            if (productName.includes(searchValue)) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }

        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", searchProducts);
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {

            if (event.key === "Enter") {
                searchProducts();
            }

            if (searchInput.value.trim() === "") {
                searchProducts();
            }
        });
    }

});
