const cardContainer = document.getElementById("card-container");

let storeItems =[]; 
let cart = [];

async function fetchApi () {
    const dataApi = await fetch('https://fakestoreapi.com/products')
    const dataJason = await dataApi.json()
    dataJason.map((element)=> {
        storeItems.push(element)
    })
    showProducts();
}

fetchApi();


let showProducts = () => {
    cardContainer.innerHTML = storeItems.map((element)=> {
        let {image, title, price, id} = element
       return `
            <div class="col mb-5" id = "product-id-${id}">
            <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top-" src="${image}" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">${title}</h5>
                  <!-- Product price-->
                  ${price}
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#" id="add">Add to cart</a></div>
                <i class="bi bi-plus-lg" onclick="addProduct(${id})"></i>
                <div class="quantity" id="${id}">0</div>
                <i class="bi bi-dash-lg" onclick="removeProduct(${id})"></i>
              </div>
            </div>
          </div>
        `
    }).join("")
}

let addProduct = (id) => {
    let selectedProduct = storeItems.find((element)=> element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) {
        cart.push({
            id: selectedProduct.id,
            quantity: 1,
        });
    } else {
        search.quantity += 1;
    }
    console.log(cart)
    update(selectedProduct.id);
};

let removeProduct = (id) => {
    let selectedProduct = storeItems.find((element)=> element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search.quantity === 0) {
        return;
    } else {
        search.quantity -= 1;
    }
    console.log(cart)
    update(selectedProduct.id);
};

let update = (id) => {
    let search = cart.find((element) => element.id === id)
    document.getElementById(id).innerHTML = search.quantity;
    cartCount();
};


let cartCount = () => {
let cartCounter = document.getElementById("cart-count");
cartCounter.innerHTML = cart.map((element)=> element.quantity).reduce((a,b) => a + b, 0);
}