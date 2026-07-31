// ======================================
// FIREBASE IMPORTS
// ======================================

import {
    db,
    collection,
    getDocs,
    query,
    orderBy
} from "./firebase.js";


// ======================================
// HTML ELEMENT
// ======================================

const ordersContainer = document.getElementById("ordersContainer");


// ======================================
// LOAD ORDERS
// ======================================

async function loadOrders(){

    ordersContainer.innerHTML = "<h2>Loading Orders...</h2>";

    try{

        const ordersRef = query(
            collection(db,"orders"),
            orderBy("createdAt","desc")
        );

        const snapshot = await getDocs(ordersRef);

        ordersContainer.innerHTML = "";

        if(snapshot.empty){

            ordersContainer.innerHTML = "<h2>No Orders Found</h2>";

            return;

        }

        snapshot.forEach((doc)=>{

            const order = doc.data();

            let itemsHTML = "";

            order.items.forEach((item)=>{

                itemsHTML += `
                    <li>
                        ${item.name}
                        (${item.quantity}) - ₹${item.price}
                    </li>
                `;

            });

            ordersContainer.innerHTML += `

            <div class="order-card">

                <h3>${order.orderId}</h3>

                <p><b>Name:</b> ${order.customerName}</p>

                <p><b>Phone:</b> ${order.phone}</p>

                <p><b>Address:</b> ${order.address}</p>

                <p><b>Email:</b> ${order.email}</p>

                <p><b>Payment:</b> ${order.payment}</p>

                <p><b>Total:</b> ₹${order.total}</p>

                <p class="status">
                    Status : ${order.status}
                </p>

                <h4>Items</h4>

                <ul>

                    ${itemsHTML}

                </ul>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

        ordersContainer.innerHTML =
        "<h2>Error Loading Orders</h2>";

    }

}


loadOrders();