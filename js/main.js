// --------------------------------------------CORE LOGIC--------------------------------------------//
 
// Declaring the cart variable that retrieves the items from memory 
let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];
// Access to the section where all cards will be displayed  
const cardContainer = document.getElementById("card-container");
// Declaring a constant that contains the URL of the API 
const apiUrl = "https://fakestoreapi.com/products"

//Declaring a function to call the API and fetch all the products. 
let callAllProducts = async (apiUrl) => {
    let storeItems = []
    const dataApi = await fetch(`${apiUrl}`)
    const dataJason = await dataApi.json()
    dataJason.map((element) => {
    storeItems.push(element)
    })
    return storeItems;
}

//Declaring the function to show all products as a card.
let showProducts = async (apiUrl) => {
    let storeItems = await callAllProducts (apiUrl);
    cardContainer.innerHTML = storeItems.map((element) => {
        let { image, title, price, id } = element;
        let search = cart.find((element) => element.id === id) || [];
        return `
            <div class="col mb-5" id = "product-id-${id}">
                <div class="card h-100">
                    <!-- Product image-->
                    <img class="card-img-top- img-fluid rounded-3" height="300px" src="${image}" alt="..." />
                    <!-- Product details-->
                    <div class="card-body p-4">
                        <div class="text-center">
                            <!-- Product name-->
                            <h5 class="fw-bolder">${title}</h5>
                            <!-- Product price-->
                            $${price}
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="d-flex justify-content-around">
                            <button class="btn btn-outline-dark px-2" onclick="removeProduct(${id})">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <div class="quantity" id="${id}">${search.quantity === undefined ? 0 : search.quantity}</div>
                            <button class="btn btn-outline-dark px-2" onclick="addProduct(${id})">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join("")
}

showProducts(apiUrl);

//Declaring the function to fetch the selected product.
let callProduct = async (id) => {
    let storeItems = []
    const dataApi = await fetch(`https://fakestoreapi.com/products/${id}`)
    const dataJason = await dataApi.json()
    storeItems.push(dataJason)
    return storeItems
}

// Declaring the function to add products to the cart, validate if the object exists, and then chose to increase only the quantity if it does.
let addProduct = async (id) => {
    let storeItems = await callProduct (id);
    let selectedProduct = storeItems.find((element) => element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) {
        cart.push({
            id: selectedProduct.id,
            quantity: 1,
            price: selectedProduct.price,
        });
        addMessage();
    } else {
        search.quantity += 1;
        addMessage();
    }
    update(selectedProduct.id);
    localStorage.setItem("cartMemory", JSON.stringify(cart))
};

// Declaring the function to remove products to the cart, validate if the object exists, and then chose to decrease the quantity if it does.
let removeProduct = async (id) => {
    let storeItems = await callProduct (id);
    let selectedProduct = storeItems.find((element) => element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) return zeroMessage();
    else if (search.quantity === 0) {
        return
    } else {
        search.quantity -= 1;
        removeMessage();
    }
    update(selectedProduct.id);
    cart = cart.filter((element) => element.quantity !== 0);
    localStorage.setItem("cartMemory", JSON.stringify(cart));
};

// Declaring the function to update the DOM and show all the quantity changes 
let update = (id) => {
    let search = cart.find((element) => element.id === id)
    document.getElementById(id).innerHTML = search.quantity;
    cartCount();
};

// Declaring a function to update the cart quantity icon 
let cartCount = () => {
    let cartCounter = document.getElementById("cart-count");
    cartCounter.innerHTML = cart.map((element) => element.quantity).reduce((a, b) => a + b, 0);
}

cartCount();

//  -------------------------------------------DISPLAY BY CATEGORY--------------------------------------------//

const menCategory = document.getElementById("men")
const womenCategory = document.getElementById("women")
const jeweleryCategory = document.getElementById("jewelery")
const electronicsCategory = document.getElementById("electronics")
const menUrl = "https://fakestoreapi.com/products/category/men's clothing"
const womenUrl = "https://fakestoreapi.com/products/category/women's clothing"
const jeweleryUrl = "https://fakestoreapi.com/products/category/jewelery"
const electronicsUrl = "https://fakestoreapi.com/products/category/electronics"

menCategory.onclick = () => {
    callAllProducts(menUrl);
    showProducts(menUrl);
};
womenCategory.onclick = () => {
    callAllProducts(womenUrl);
    showProducts(womenUrl);
} 
jeweleryCategory.onclick = () => {
    callAllProducts(jeweleryUrl)
    showProducts(jeweleryUrl);
};
electronicsCategory.onclick = () => {
    callAllProducts(electronicsUrl)
    showProducts(electronicsUrl);
};

//  -------------------------------------------SWEET ALERT MESSAGES--------------------------------------------//

let addMessage = () => {
    Swal.fire({
        text: 'One unit of this item is now on your shopping cart',
        timer: 800,
        showConfirmButton: false,
        icon: 'success',
        position: "top-end",
        customClass: {
            popup: "swal-popup"
        }
    })
}

let removeMessage = () => {
    Swal.fire({
        text: 'One unit of this item has been removed from shopping cart',
        timer: 800,
        showConfirmButton: false,
        icon: 'warning',
        position: "top-end",
        customClass: {
            popup: "swal-popup"
        }
    })
}

let zeroMessage = () => {
    Swal.fire({
        text: 'This item is not in your cart',
        timer: 800,
        showConfirmButton: false,
        icon: 'error',
        position: "top-end",
        customClass: {
            popup: "swal-popup"
        }
    })
}