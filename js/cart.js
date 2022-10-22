// --------------------------------------------CORE LOGIC--------------------------------------------//

// Declaring the cart variable that retrieves the items from memory
let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];
// Access to the section where all selected cards will be displayed   
const shoppingCart = document.getElementById("shopping-cart");
// Access to the section where the total bill will be displayed 
const  total = document.getElementById("total-price")
// Access to the section where sort price is displayed 
const  sortPrice = document.getElementById("sort-price")

// Declaring a function to update the cart quantity icon
let cartCount = () => {
  let cartCounter = document.getElementById("cart-count");
  let cartQuantity = cart.map((element)=> element.quantity).reduce((a,b) => a + b, 0)
  cartCounter.innerHTML = cartQuantity;
  return cartQuantity
}

cartCount();

// Declaring a variable to check the type of sort.
let priceSortCheck = 0;

//declaring an onClick function to change the type of sort 
sortPrice.onclick = () => {
  if (priceSortCheck === 0) {
    showCart ();
    priceSortCheck = 1;
  } else if (priceSortCheck === 1) {
    showCart ();
    priceSortCheck = 0;
  } else return
}
  
//Declaring a function to call the API and fetch all the products. 
let callAllProducts = async () => {
  let storeItems = []
  const dataApi = await fetch("https://fakestoreapi.com/products")
  const dataJason = await dataApi.json()
  dataJason.map((element) => {
  storeItems.push(element)
  })
  return storeItems;
}

//Declaring the function to show all selected products as a card.
let showCart = async () => {
  let storeItems = await callAllProducts ();
  let cartLenght = await cartCount()
  if(cartLenght !==0) {
    if ( priceSortCheck === 0) {
      cart = cart.sort((a,b) => (a.price * a.quantity) - (b.price * b.quantity));
    } else if (priceSortCheck === 1) {
      cart = cart.sort((a,b) => (b.price * b.quantity) - (a.price * a.quantity));
    } 
    shoppingCart.innerHTML = cart.map((element)=> {
      let {quantity, price, id} = element;
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
              <p><span class="text-muted">Unit Price: </span>$ ${search.price}</p>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
              <button class="btn btn-link px-2" onclick="removeProduct(${id})">
                <i class="bi bi-dash-lg"></i>
              </button>
              <p id="${id}" class="form-control form-control-sm mt-3"/>${quantity}</p>
              <button class="btn btn-link px-2" onclick="addProduct(${id})">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 class="mb-0">$${(quantity * search.price).toFixed(2)}</h5>
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
    shoppingCart.innerHTML= ""
    total.innerHTML = ""
    total.innerHTML= `
    <div class="card">
      <div class="card-body row d-flex justify-content-center align-items-center text-center">
        <h2>The cart is empty, please select some products.</h2>
      </div>
      <div class="container d-flex justify-content-center align-items-center mb-4">
        <a href="../index.html">
          <button class="btn btn-outline-dark mt-auto btn-lg m-3">Shop</button>
        </a>
      </div>
    </div>
    `
  }
}

showCart();

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
  let selectedProduct = storeItems.find((element)=> element.id === id)
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
  await showCart();
  await totalPrice();
  localStorage.setItem("cartMemory", JSON.stringify(cart))
};

// Declaring the function to remove products to the cart, validate if the object exists, and then chose to decrease the quantity if it does.
let removeProduct = async (id) => {
  let storeItems = await callProduct (id);
  let selectedProduct = storeItems.find((element)=> element.id === id)
  let search = cart.find((element) => element.id === selectedProduct.id)
  if (search === undefined) return;
  else if (search.quantity === 0) {
      return;
  } else {
      search.quantity -= 1;
      removeMessage();
  }
  update(selectedProduct.id);
  cart = cart.filter((element) => element.quantity !== 0);
  await showCart();
  await totalPrice();
  localStorage.setItem("cartMemory", JSON.stringify(cart));
};


// Declaring the function to update the DOM and show all the quantities changes 
let update = (id) => {
  let search = cart.find((element) => element.id === id)
  document.getElementById(id).innerHTML = search.quantity;
  cartCount();
};

//Declaring the function to eliminate all quantities of a product from the cart 
let eliminateProduct = (id) => {
  let selectedProduct = id;
  cart = cart.filter((element) => element.id !== selectedProduct)
  showCart();
  totalPrice();
  cartCount();
  zeroMessage()
  localStorage.setItem("cartMemory", JSON.stringify(cart));
};


//Declaring the function to calculate and display the total of all cart items 
let totalPrice = async () => {
  let storeItems = await callAllProducts ();
  let cartLenght = await cartCount()
  if (cartLenght !== 0) {   
    let price = cart.map ((element)=>{
      let {quantity, id} = element
      let search = storeItems.find((y) => y.id === id) || [];
      return quantity * search.price;
    }).reduce((a,b) => a + b, 0).toFixed(2);
    total.innerHTML = `
    <div class="card">
      <div class="card-body row d-flex justify-content-center align-items-center text-center">
        <h2>Total Price: $ ${price}</h2>
      </div>
      <div class="container d-flex justify-content-center align-items-center mb-4">
        <button class="btn btn-outline-dark mt-auto btn-lg m-3" onclick="clearCart()">Clear Cart</button>
        <button type="button" class="btn btn-warning btn-block btn-lg m-3" onclick="checkOutMessage()">Checkout</button>
      </div>
    </div>
    `
  } 
};

totalPrice();

//Declaring the function to empty the cart 
let clearCart = () => {
  cart = [];
  showCart();
  totalPrice();
  cartCount();
  emptyMessage();
  localStorage.setItem("cartMemory", JSON.stringify(cart));
}

//  -------------------------------------------SWEET ALERT MESSAGES--------------------------------------------//

let addMessage = () => {
  Swal.fire({
    text: 'One unit of this item is now on your shopping cart',
    timer: 800,
    showConfirmButton:false,
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
    showConfirmButton:false,
    icon: 'warning',
    position: "top-end",
    customClass: {
      popup: "swal-popup"
    }
  })
}

let zeroMessage = () => {
  Swal.fire({
    text: 'All units of this item has been removed from shopping cart',
    timer: 800,
    showConfirmButton:false,
    icon: 'error',
    position: "top-end",
    customClass: {
      popup: "swal-popup"
    }
  })
}

let emptyMessage = () => {
  Swal.fire({
    text: 'Your shopping cart is now empty',
    timer: 1400,
    showConfirmButton:false,
    icon: 'info',
    position: "top-end",
    customClass: {
      popup: "swal-popup"
    }
  })
}

let checkOutMessage = () => {
  Swal.fire({
    text: '✨Thanks for shopping with us✨',
    showConfirmButton: true,
    confirmButtonText: "Shop again",
    confirmButtonColor: "#212529", 
    icon: 'success',
    position: "center",
    customClass: {
      popup: "swal-popup"
    }
  }).then((result) => {
    if (result.isConfirmed) {
      clearCart();
    }
  })
}