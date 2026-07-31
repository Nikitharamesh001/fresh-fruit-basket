// ==========================================
// FRESH FRUIT BASKET
// MAIN SCRIPT
// ==========================================

// Firebase
import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    signOut
} from "./firebase.js";
// ==========================================
// HTML ELEMENTS
// ==========================================
const productBox = document.getElementById("productBox");


// ==========================================
// LOAD PRODUCTS FROM FIRESTORE
// ==========================================

async function loadProducts(){

    const snapshot = await getDocs(collection(db,"products"));
console.log("Products:", snapshot.size);

    productBox.innerHTML = "";

    snapshot.forEach((doc)=>{

        const product = doc.data();

        productBox.innerHTML += `

        <div class="card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <h4>₹${product.price}</h4>

            <button>Add to Cart</button>

        </div>

        `;

    });

    activateCartButtons();

}


loadProducts();

const cartCounter = document.getElementById("cart-count");

const openCart = document.getElementById("openCart");

const closeCart = document.getElementById("closeCart");

const cartSidebar = document.getElementById("cartSidebar");

const cartItems = document.getElementById("cartItems");

const totalPrice = document.getElementById("totalPrice");


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let cartCount = 0;

// ==========================================
// PAGE LOAD
// ==========================================



    
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    loadCart();

});
// ==========================================
// ADD TO CART
// ==========================================

function activateCartButtons(){

const productButtons = document.querySelectorAll(".card button");


productButtons.forEach((button)=>{



    button.addEventListener("click", async () => {

        const user = auth.currentUser;

        if (!user) {

            alert("Please login to continue.");

            window.location.href = "login.html";

            return;

        }



        const card = button.closest(".card");

        const product = {

            name: card.querySelector("h3").textContent,

            price: parseInt(
                card.querySelector("h4").textContent.replace(/[^\d]/g, "")
            ),

            image: card.querySelector("img").src

        };

        try {

            const cartRef = collection(db, "users", user.uid, "cart");

            const snapshot = await getDocs(cartRef);

            let alreadyExists = false;

            for (const cartDoc of snapshot.docs) {

                const data = cartDoc.data();

                if (data.name === product.name) {

                    await updateDoc(

                        doc(db, "users", user.uid, "cart", cartDoc.id),

                        {

                            quantity: data.quantity + 1

                        }

                    );

                    alreadyExists = true;

                    break;

                }

            }

            if (!alreadyExists) {

                await addDoc(

                    cartRef,

                    {

                        name: product.name,

                        price: product.price,

                        image: product.image,

                        quantity: 1,

                        createdAt: serverTimestamp()

                    }

                );

            }

            await loadCart();

            button.disabled = true;

            button.innerHTML = "✓ Added";

            button.style.background = "#ff9800";

            setTimeout(() => {

                button.innerHTML = "Add to Cart";

                button.style.background = "#2e7d32";

                button.disabled = false;

            }, 1500);

        }

        catch (error) {

            console.error(error);

            alert("Unable to add product.");

        }

    });

});
}

// ==========================================
// OPEN CART
// ==========================================

openCart.addEventListener("click", (e) => {

    e.preventDefault();

    cartSidebar.classList.add("active");

    loadCart();

});


// ==========================================
// CLOSE CART
// ==========================================

closeCart.addEventListener("click", () => {

    cartSidebar.classList.remove("active");

});


// ==========================================
// LOAD CART FROM FIRESTORE
// ==========================================

async function loadCart() {

    const user = auth.currentUser;

    if (!user) return;

    cartItems.innerHTML = "";

    cartCount = 0;

    let total = 0;

    const snapshot = await getDocs(
        collection(db, "users", user.uid, "cart")
    );

    if (snapshot.empty) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>
            </div>
        `;

        cartCounter.textContent = "0";
        totalPrice.textContent = "0";

        return;
    }

    snapshot.forEach((cartDoc) => {

        const item = cartDoc.data();

        cartCount += item.quantity;

        total += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-details">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

                <div class="quantity-box">

                    <button onclick="decreaseQty('${cartDoc.id}', ${item.quantity})">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQty('${cartDoc.id}', ${item.quantity})">+</button>

                </div>

            </div>

            <button class="remove-btn"
            onclick="removeItem('${cartDoc.id}')">

                Remove

            </button>

        </div>

        `;

    });

    cartCounter.textContent = cartCount;

    totalPrice.textContent = total;

}

// ==========================================
// REMOVE ITEM
// ==========================================

window.removeItem = async function (docId) {

    const user = auth.currentUser;

    if (!user) return;

    try {

        await deleteDoc(
            doc(db, "users", user.uid, "cart", docId)
        );

        await loadCart();

    }

    catch (error) {

        console.error(error);

        alert("Unable to remove item.");

    }

};


// ==========================================
// INCREASE QUANTITY
// ==========================================

window.increaseQty = async function (docId, currentQty) {

    const user = auth.currentUser;

    if (!user) return;

    try {

        await updateDoc(

            doc(db, "users", user.uid, "cart", docId),

            {

                quantity: currentQty + 1

            }

        );

        await loadCart();

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// DECREASE QUANTITY
// ==========================================

window.decreaseQty = async function (docId, currentQty) {

    const user = auth.currentUser;

    if (!user) return;

    try {

        if (currentQty <= 1) {

            await deleteDoc(
                doc(db, "users", user.uid, "cart", docId)
            );

        }

        else {

            await updateDoc(

                doc(db, "users", user.uid, "cart", docId),

                {

                    quantity: currentQty - 1

                }

            );

        }

        await loadCart();

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// CHECKOUT
// ==========================================
const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
});



// ==========================================
// SEARCH PRODUCTS
// ==========================================

const searchBox = document.getElementById("search");

searchBox.addEventListener("keyup", () => {

    const value = searchBox.value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});


const logoutBtn = document.getElementById("logoutBtn");



    

logoutBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    await signOut(auth);

    alert("Logged Out Successfully");

    window.location.href = "login.html";

});

// ==========================================
// USER PROFILE
// ==========================================

const userName = document.getElementById("userName");

if (userName) {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            userName.textContent = user.email;

        } else {

            userName.textContent = "Guest";

        }

    });

}

