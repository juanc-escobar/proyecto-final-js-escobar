const cardContainer = document.getElementById("card-container");

let storeItems = [];
let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];

async function fetchApi() {
    const dataApi = await fetch('https://fakestoreapi.com/products')
    const dataJason = await dataApi.json()
    dataJason.map((element) => {
        storeItems.push(element)
    })
    showProducts();
}

fetchApi();

let showProducts = () => {
    cardContainer.innerHTML = storeItems.map((element) => {
        let { image, title, price, id } = element;
        let search = cart.find((element) => element.id === id) || [];
        return `
            <div class="col mb-5" id = "product-id-${id}">
            <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top-" height="300px" src="${image}" alt="..." />
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
                <i class="bi bi-dash-lg" onclick="removeProduct(${id})"></i>
                <div class="quantity" id="${id}">${search.quantity === undefined ? 0 : search.quantity}</div>
                <i class="bi bi-plus-lg" onclick="addProduct(${id})"></i>
                </div>
              </div>
            </div>
          </div>
        `
    }).join("")
}

let addProduct = (id) => {
    let selectedProduct = storeItems.find((element) => element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) {
        cart.push({
            id: selectedProduct.id,
            quantity: 1,
        });
    } else {
        search.quantity += 1;
    }
    update(selectedProduct.id);
    localStorage.setItem("cartMemory", JSON.stringify(cart))
};

let removeProduct = (id) => {
    let selectedProduct = storeItems.find((element) => element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) return
    else if (search.quantity === 0) {
        return;
    } else {
        search.quantity -= 1;
    }
    update(selectedProduct.id);
    cart = cart.filter((element) => element.quantity !== 0);
    localStorage.setItem("cartMemory", JSON.stringify(cart));
};

let update = (id) => {
    let search = cart.find((element) => element.id === id)
    document.getElementById(id).innerHTML = search.quantity;
    cartCount();
};

let cartCount = () => {
    let cartCounter = document.getElementById("cart-count");
    cartCounter.innerHTML = cart.map((element) => element.quantity).reduce((a, b) => a + b, 0);
}

cartCount();

const menCategory = document.getElementById("men")
const womenCategory = document.getElementById("women")
const jeweleryCategory = document.getElementById("jewelery")
const electronicsCategory = document.getElementById("electronics")

menCategory.onclick = async () => {
    const productsData = await fetch(`https://fakestoreapi.com/products/category/men's clothing`)
    const products = await productsData.json()
    storeItems = [];
    products.map((element) => {
        storeItems.push(element)
    })
    showProducts(products)
    }
    
    womenCategory.onclick = async () => {
        const productsData = await fetch(`https://fakestoreapi.com/products/category/women's clothing`)
        const products = await productsData.json()
        storeItems = [];
        products.map((element) => {
            storeItems.push(element)
        })
        showProducts(products)
    }
    
    jeweleryCategory.onclick = async () => {
        const productsData = await fetch(`https://fakestoreapi.com/products/category/jewelery`)
        const products = await productsData.json()
        storeItems = [];
        products.map((element) => {
            storeItems.push(element)
        })
        showProducts(products)
    }
    
    electronicsCategory.onclick = async () => {
        const productsData = await fetch(`https://fakestoreapi.com/products/category/electronics`)
        const products = await productsData.json()
        storeItems = [];
        products.map((element) => {
            storeItems.push(element)
        })
        showProducts(products)
    }