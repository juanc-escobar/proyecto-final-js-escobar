# The DB Store project

### This project is an E-commerce web application, about style store with different categories of clothing and accessories. is built on Fake Store API, HTML, CSS, Bootstrap, Javascript, and Sweet Alert library. The core focus of this project is Javascript so we won't be explaining the HTML, CSS, or Bootstrap used in this project. But we will clarify that we used templates for the home page and the cart page since it was not necessary to give specific styles to the page.  <br/>

<p>&nbsp;</p>

## main.js Core logic <br/>

<p>&nbsp;</p>

#### We start by declaring the cart variable that retrieves the items from memory, since the cart will be stored in the local storage we need to call it back. In case there is no data in the local storage it will return an empty array. <br/>

```js
    let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];
```

#### We create access to the section where all cards will be displayed by getting the id of the existing element in the HTML.
_From now on all `getElementById()` won't be explained in this document since they all are used for the same purpose._

```js
    const cardContainer = document.getElementById("card-container");
```

#### We Declare a constant that contains the URL of the API, from where all product data will be fetched. 
```js
   const apiUrl = "https://fakestoreapi.com/products"
```

#### Then we Declare a function to call the API and fetch all the products. once all the products are fetched. we store them in an array called `storeItems`.

```js
    let callAllProducts = async (apiUrl) => {
    let storeItems = []
    const dataApi = await fetch(`${apiUrl}`)
    const dataJason = await dataApi.json()
    dataJason.map((element) => {
    storeItems.push(element)
    })
    return storeItems;
}
```
#### Now we create the main function that will display the products of the store as cards, this asynchronous function will call the `callAllProducts()` function and `await` for all the data to be fetched. then it will display all the items in the store. 

```js
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
```

### After the products are displayed, we declare a function to fetch one specific product, since each card has its own id we just need to get the data from the selected product. 

```js
   let callProduct = async (id) => {
    let storeItems = []
    const dataApi = await fetch(`https://fakestoreapi.com/products/${id}`)
    const dataJason = await dataApi.json()
    storeItems.push(dataJason)
    return storeItems
}
```

### We declare a function to add products to the cart, validate if the object exists, and then chose to increase only the quantity if it does. This asynchronous function will call the `callProduct(id)` function and `await` for the data to be fetched. Confirmation messages will be visible in the application. After adding the product it will proceed to add it to the local storage. 

```js
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
```
### similar to the `addProduct(id)` function, but instead of adding products it will decrease the quantity or filter out the products with 0 quantity. It will also update the `cart` by sending the data to the local storage. 

```js
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
```

### We declare a function to update the DOM and show all the quantity changes in the selected products.  
```js
let update = (id) => {
    let search = cart.find((element) => element.id === id)
    document.getElementById(id).innerHTML = search.quantity;
    cartCount();
};
```
### We declare a function to update the cart quantity icon by applying the `reduce()` function to the `cart` objects `quantity` key. 
```js
let cartCount = () => {
    let cartCounter = document.getElementById("cart-count");
    cartCounter.innerHTML = cart.map((element) => element.quantity).reduce((a, b) => a + b, 0);
}

cartCount();
```
### On the main page, we have the option to filter the products by category, since our API provides us with all the category URLs we get the elements by id and add an `onClick()` with the different URLs. 

```js
const menCategory = document.getElementById("men")
const menUrl = "https://fakestoreapi.com/products/category/men's clothing"
menCategory.onclick = () => {
    callAllProducts(menUrl);
    showProducts(menUrl);
};
```
### As our final detail for the main page, we added different messages for when you add or remove items from the `cart`.

```js
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
```
<p>&nbsp;</p>

## cart.js Core logic

<p>&nbsp;</p>

### Since the `cart.js` have similar functions to `main.js` we will only explain the difference between them or any additional code. We start the script by declaring the `cart` variable which retrieves the items from local storage memory. Then we declare the constants to get the different DOM elements by id.  And proceed to update the cart quantity counter by calling the function `cartCount()`.

<p>&nbsp;</p>

### We declare the `priceSortCheck` variable to check the type of sort, ascending or descending. Then, we create an onClick function to change the type of sort by changing the value of `priceSortCheck`. 

```js
let priceSortCheck = 0;

sortPrice.onclick = () => {
  if (priceSortCheck === 0) {
    showCart ();
    priceSortCheck = 1;
  } else if (priceSortCheck === 1) {
    showCart ();
    priceSortCheck = 0;
  } else return
}
```

### The `showCart()` function is simar to the `showProducts()` function, in this case, we first check if the cart quantity is different from 0 so we can check if the cart is empty if it is it will show you a message and a home button to take you back to the home page. If it is not, it will check for the type of `priceSortCheck` and apply the correct kind of sort, and finally it will check for all the cart items and display it on the DOM. 


```js
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
```

### We declare the functions as before `callProduct(id)`, `addProduct(id)`, `removeProduct(id)`, `update(id)`. But in this case, we have an additional function `eliminateProduct(id)` , this function will search for the selected product id in de cart and with the filter method will remove it from it. then it will update all aspects of the DOM by calling the respective functions. 

```js
let eliminateProduct = (id) => {
  let selectedProduct = id;
  cart = cart.filter((element) => element.id !== selectedProduct)
  showCart();
  totalPrice();
  cartCount();
  zeroMessage()
  localStorage.setItem("cartMemory", JSON.stringify(cart));
};
```
### To finalize we have de `totalPrice()` function which will check for all products in the cart and calculate the total amount of product quantities and price to give the result back. 

```js
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
```
