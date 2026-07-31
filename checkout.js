// ==========================================
// FRESH FRUIT BASKET
// CHECKOUT SCRIPT
// ==========================================


// Firebase
import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "./firebase.js";


// HTML Elements

const checkoutItems = document.getElementById("checkoutItems");

const checkoutTotal = document.getElementById("checkoutTotal");

const checkoutForm = document.getElementById("checkoutForm");

const payment = document.getElementById("payment");

const upiSection = document.getElementById("upiSection");

const transactionId = document.getElementById("transactionId");

// Global

let totalAmount = 0;

let cartData = [];

payment.addEventListener("change", () => {

    if (payment.value === "UPI") {

        upiSection.style.display = "block";

    } else {

        upiSection.style.display = "none";

        transactionId.value = "";

    }

});

// ==========================================
// LOAD CHECKOUT CART
// ==========================================

onAuthStateChanged(auth, async (user)=>{


    if(!user){

        alert("Please login first");

        window.location.href="login.html";

        return;

    }


    const cartRef = collection(
        db,
        "users",
        user.uid,
        "cart"
    );


    const snapshot = await getDocs(cartRef);



    checkoutItems.innerHTML = "";

    totalAmount = 0;

    cartData = [];



    if(snapshot.empty){

        checkoutItems.innerHTML = `

        <h3>Your cart is empty 🛒</h3>

        `;

        checkoutTotal.innerText = 0;

        return;

    }



    snapshot.forEach((itemDoc)=>{


        const item = itemDoc.data();


        cartData.push({

            id:itemDoc.id,

            ...item

        });



        totalAmount += item.price * item.quantity;



        checkoutItems.innerHTML += `


        <div class="checkout-product">


            <img src="${item.image}" width="80">


            <div>

                <h3>${item.name}</h3>

                <p>
                ₹${item.price} × ${item.quantity}
                </p>

            </div>


        </div>


        `;


    });



    checkoutTotal.innerText = totalAmount;


});




// ==========================================
// PLACE ORDER
// ==========================================


checkoutForm.addEventListener("submit", async(e)=>{


    e.preventDefault();



    const user = auth.currentUser;

if (payment.value === "UPI") {

    if (transactionId.value.trim() === "") {

        alert("Please enter UPI Transaction ID");

        return;

    }

}

if (cartData.length === 0) {
    alert("Your cart is empty.");
    return;
}


    if(!user){

        alert("Login required");

        return;

    }



    
const order = {

    orderId: "FFB-" + Date.now(),

    userId: user.uid,

    email: user.email,

    customerName:
    document.getElementById("name").value,

    phone:
    document.getElementById("phone").value,

    address:
    document.getElementById("address").value,

    payment:
    document.getElementById("payment").value,

transactionId:
transactionId.value.trim(),

    items: cartData,

    total: totalAmount,

    status: "Pending",

    createdAt: serverTimestamp()

};
        


    try{


        await addDoc(

            collection(db,"orders"),

            order

        );



        // Clear cart after order


        for(const item of cartData){


            await deleteDoc(

                doc(
                    db,
                    "users",
                    user.uid,
                    "cart",
                    item.id
                )

            );


        }



        alert(
            "Order Placed Successfully 🎉"
        );



        window.location.href="index.html";



    }


    catch(error){


        console.error(error);

        alert(
            "Order failed. Try again."
        );


    }



});