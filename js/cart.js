let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];
let shoppingCart = document.getElementById("shopping-cart");
let total = document.getElementById("total-price")
let storeItems = []; 

let cartCount = () => {
    let cartCounter = document.getElementById("cart-count");
    cartCounter.innerHTML = cart.map((element)=> element.quantity).reduce((a,b) => a + b, 0);
}
cartCount();

async function fetchApi () {
  const dataApi = await fetch('https://fakestoreapi.com/products')
  const dataJason = await dataApi.json()
  dataJason.map((element)=> {
      storeItems.push(element)
  })
  showCart();
}

fetchApi();

let showCart = () => {
  if(cart.lenght !==0) {
    shoppingCart.innerHTML = cart.map((element)=> {
        let {quantity, id} = element;
        let search = storeItems.find((element) => element.id === id) || [];
        return `
        <div class="card rounded-3 mb-4">
        <div class="card-body p-4">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="col-md-2 col-lg-2 col-xl-2">
              <img
                src="${search.image}"
                class="img-fluid rounded-3"
                alt="${search.title}"
              />
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
              <p class="lead fw-normal mb-2">${search.title}</p>
              <p><span class="text-muted">Size: </span>M <span class="text-muted">Color: </span>Grey</p>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
              <button class="btn btn-link px-2" onclick="addProduct(${id})">
                <i class="fas fa-minus"></i>
              </button>

              <input id="${id}" min="0" name="quantity" value="${quantity}" type="number" class="form-control form-control-sm" />

              <button class="btn btn-link px-2" onclick="removeProduct(${id})">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 class="mb-0">$${quantity * search.price}</h5>
            </div>
            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
              <a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>
              <i class="bi bi-x-square" onclick="eliminateProduct(${id})"></i>
            </div>
          </div>
        </div>
      </div>
        `
    }).join("")

  } else {
      shoppingCart.innerHTML= ``
      shoppingCart.innerHTML= `
      <h2>Cart is Empty</h2>
      <a href="../testindex.html">
        <button class="btn btn-outline-dark mt-auto">Home</button>
      </a>
      `
  }
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
  update(selectedProduct.id);
  showCart();
  localStorage.setItem("cartMemory", JSON.stringify(cart))
};

let removeProduct = (id) => {
  let selectedProduct = storeItems.find((element)=> element.id === id)
  let search = cart.find((element) => element.id === selectedProduct.id)
  if (search === undefined) return
  else if (search.quantity === 0) {
      return;
  } else {
      search.quantity -= 1;
  }
  update(selectedProduct.id);
  cart = cart.filter((element) => element.quantity !== 0);
  showCart();
  localStorage.setItem("cartMemory", JSON.stringify(cart));
};

let update = (id) => {
  let search = cart.find((element) => element.id === id)
  document.getElementById(id).innerHTML = search.quantity;
  cartCount();
};

let eliminateProduct = (id) => {
  let selectedProduct = id;
  cart = cart.filter((element) => element.id !== selectedProduct)
  showCart();
  cartCount();
  localStorage.setItem("cartMemory", JSON.stringify(cart));
};

let totalPrice = () => {
  if (cart.lenght !== 0) {   
    console.log(storeItems)
    let price = cart.map ((element)=>{
      let {quantity, id} = element
      let search = storeItems.find((y) => y.id === id) || [];
      console.log(search.id)
      return quantity * search.price;
    }).reduce((a,b) => a + b, 0);
    total.innerHTML = `
    <h2>Total Price: $ ${price}</h2>
    <button class="btn btn-outline-dark mt-auto">Checkout</button>
    <button class="btn btn-outline-dark mt-auto" onclick="clearCart()">Clear Cart</button>
    `
  } else return
};

totalPrice();

let clearCart = () => {
  cart = [];
  showCart();
  cartCount();
  localStorage.setItem("cartMemory", JSON.stringify(cart));
}