// ==========================================
// ADMIN PANEL
// ==========================================

import {
    auth,
    db,
    onAuthStateChanged,
    collection,
getDocs,
addDoc,
doc,
updateDoc,
serverTimestamp
   } from "./firebase.js";

const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const deliveredOrders = document.getElementById("deliveredOrders");
const totalSales = document.getElementById("totalSales");
const ordersTable = document.getElementById("ordersTable");
const productForm = document.getElementById("productForm");

const productName = document.getElementById("productName");

const productPrice = document.getElementById("productPrice");

const productImage = document.getElementById("productImage");

const productCategory = document.getElementById("productCategory");


// ==============================
// CHECK LOGIN
// ==============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        alert("Please login first");

        window.location.href = "login.html";

        return;

    }

    loadOrders();

});

// ==============================
// LOAD ORDERS
// ==============================

async function loadOrders() {

    const snapshot = await getDocs(collection(db, "orders"));

    let orders = 0;
    let pending = 0;
    let delivered = 0;
    let sales = 0;

    ordersTable.innerHTML = "";

    snapshot.forEach((doc) => {

        const order = doc.data();

        orders++;

        sales += order.total || 0;

        if (order.status === "Pending") {
            pending++;
        }

        if (order.status === "Delivered") {
            delivered++;
        }

        ordersTable.innerHTML += `

        <tr>

            <td>${order.orderId}</td>

            <td>${order.customerName}</td>

            <td>${order.phone}</td>

            <td>${order.payment}</td>

            <td>₹${order.total}</td>

          <td>
<select onchange="updateStatus('${doc.id}', this.value)">

<option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>

<option value="Accepted" ${order.status==="Accepted"?"selected":""}>Accepted</option>

<option value="Delivered" ${order.status==="Delivered"?"selected":""}>Delivered</option>

<option value="Cancelled" ${order.status==="Cancelled"?"selected":""}>Cancelled</option>

</select>
</td>

<td>
<button onclick="alert('Order Updated')">
Save
</button>
</td>

        </tr>

        `;

    });

    totalOrders.textContent = orders;
    pendingOrders.textContent = pending;
    deliveredOrders.textContent = delivered;
    totalSales.textContent = sales;

}

window.updateStatus = async function(orderId, status){

    try{

        await updateDoc(
            doc(db,"orders",orderId),
            {
                status:status
            }
        );

        alert("Status Updated");

        loadOrders();

    }

    catch(error){

        console.error(error);

        alert("Update Failed");

    }

}
productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "products"), {

            name: productName.value.trim(),

            price: Number(productPrice.value),

            image: productImage.value.trim(),

            category: productCategory.value.trim(),

            createdAt: serverTimestamp()

        });

        alert("Product Added Successfully 🎉");

        productForm.reset();

    }

    catch (error) {

        console.error(error);

        alert("Unable to add product.");

    }

});
