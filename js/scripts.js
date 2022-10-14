// Creacion de funcion autoinvocada para mostrar los productos llamados desde la API

( async () => {
    const productsData = await fetch('https://fakestoreapi.com/products')
    const products = await productsData.json()
    cardConntenedor.innerHTML = ""
    displayProducts(products)
})();

// Se agrega mensaje de bienvenida 

(async () => {
    let {value: nombreUsuario} = await Swal.fire ({
        title: "Bienvendio!",
        text: "Ingresa tu nombre:",
        input: "text",
        width: "30%",
        padding: "2rem",
        confirmButtonText: "Ingresar",
        confirmButtonColor:"rgb(158, 137, 255)",
        customClass: {
            confirmButton: "swal-button",
            input: "swal-input",
            title: "swal-title",
            popup: "swal-popup"
        }
    })

    if (nombreUsuario) {
        localStorage.setItem('nombreUsuarioStorage', JSON.stringify(nombreUsuario))
        Swal.fire ({
            title: `${nombreUsuario}`, 
            text: "Tenemos variedad de productos para ti",
            confirmButtonText: "Gracias",
            confirmButtonColor:"rgb(158, 137, 255)",
            customClass: {
                confirmButton: "Gracias",
                input: "swal-input",
                title: "swal-title",
                popup: "swal-popup"
            }
        })

    } 
    
    else {
        nombreUsuario = "Invitado"
        localStorage.setItem('nombreUsuarioStorage', JSON.stringify(nombreUsuario))
        Swal.fire ({
            title: `${nombreUsuario}`, 
            text: "Tenemos variedad de productos para ti",
            confirmButtonText: "Gracias",
            confirmButtonColor:"rgb(158, 137, 255)",
            customClass: {
                confirmButton: "swal-button",
                input: "swal-input",
                title: "swal-title",
                popup: "swal-popup"
            }
        })
    }

})()


// Creacion de contenedores principales 

const cardConntenedor = document.getElementById("card-contenedor")
const facturaConntenedor = document.getElementById("factura-contenedor")
const cartConntenerdor = document.getElementById("cart")
const menCategory = document.getElementById("men")
const womenCategory = document.getElementById("women")
const jeweleryCategory = document.getElementById("jewelery")
const electronicsCategory = document.getElementById("electronics")
const titleHead = document.getElementById("title-head")

//Declaracion de variables 

let carrito = [];
let totalCompra = 0;
let itemsCarrito = 0;

//Se crea la funcion encargada de mostrar los productos 

function displayProducts(products) {
    cardConntenedor.innerHTML = ""
    facturaConntenedor.innerHTML = ""
    products.forEach((element) => {
            const mostrarProductos = document.createElement("div")
            mostrarProductos.classList.add("card")
            mostrarProductos.innerHTML = `
            <div class="col mb-5">
            <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top-" src="${element.image}" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">${element.title}</h5>
                  <!-- Product price-->
                  ${element.price}
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#" id="${element.id}">Add to cart</a></div>
              </div>
            </div>
          </div>
        `
        cardConntenedor.appendChild(mostrarProductos)
    
        const agregar = document.getElementById(element.id)
        agregar.addEventListener("click", () => {
            agregarCarrito(element.id)
        })
    })

    //Se crea la funcion encargada de agregar los productos al carrito

    const agregarCarrito = (productoId) => {
        let productoSeleccionado = products.find((p) => p.id === productoId)
        if (carrito.find((p)=> p.id === productoSeleccionado.id)){
            productoSeleccionado.cart++ // Sugar Syntax Optimizacion ++
            totalCompra = totalCompra + productoSeleccionado.price
            itemsCarrito= carrito.reduce((acumulator, actual) => {
                return acumulator + actual.cart;
            }, 0)
            // se envian los productos del carrito y el valor total de compra al storage para poder utilizarlos en la pagina del checkout
            localStorage.setItem('carritoStorage', JSON.stringify(carrito))
            localStorage.setItem('totalCompraStorage', JSON.stringify(totalCompra))
            actualizarCarrito()
            // Se agrega notificacion al agregar producto
            Swal.fire({
            text: 'Agregaste un producto al carrito',
            timer: 1000,
            showConfirmButton:false,
            icon: 'success',
            position: "top-end",
            customClass: {
                popup: "swal-popup"
            }
            })
        }   
        
        else {
            carrito.push(productoSeleccionado)
            totalCompra = totalCompra + productoSeleccionado.price
            productoSeleccionado.cart = 1
            itemsCarrito= carrito.reduce((acumulator, actual) => {
                return acumulator + actual.cart;
            }, 0)
            // se envian los productos del carrito y el valor total de compra al storage para poder utilizarlos en la pagina del checkout
            localStorage.setItem('carritoStorage', JSON.stringify(carrito))
            localStorage.setItem('totalCompraStorage', JSON.stringify(totalCompra))
            actualizarCarrito( )
            // Se agrega notificacion al agregar producto
            Swal.fire({
                text: 'Agregaste un producto al carrito',
                timer: 1000,
                showConfirmButton:false,
                icon: 'success',
                position: "top-end",
                customClass: {
                    popup: "swal-popup"
                }
            })
        }
    }

    //Se crea la funcion encargada de actualizar el icono del carrito de compras

    const actualizarCarrito = () => {
        cart.innerHTML = `${itemsCarrito}`
    }

}

// se agrega un event listener para cuando den click en el carrito este los lleve a la pagina de checkout. 

const checkOut = document.getElementById("check-out")

checkOut.addEventListener("click", () => {
    const nombreUsuario = JSON.parse(window.localStorage.getItem("nombreUsuarioStorage"))

    // Se agrega mensaje para indicar que el carrito esta vacio o de gratitud si el carrito esta lleno

    if (carrito.length === 0) {
        Swal.fire ({
            title: `${nombreUsuario}`,
            text: "Tu carrito esta vacio",
            icon: "error",
            confirmButtonText: "Continuar",
            confirmButtonColor:"rgb(158, 137, 255)",
            customClass: {
                confirmButton: "swal-button",
                input: "swal-input",
                title: "swal-title",
                popup: "swal-popup"
            }
        })
    } 

    else {
        Swal.fire ({
            title: `${nombreUsuario}`,
            text: "💖Gracias por tu compra💖",
            icon: "success",
            confirmButtonText: "Continuar",
            confirmButtonColor:"rgb(158, 137, 255)",
            customClass: {
                confirmButton: "swal-button",
                input: "swal-input",
                title: "swal-title",
                popup: "swal-popup"
            }
        })
    
        .then((result) => {

            // Se crea la funcion reciboCompra para mostrar el total de los productos comprados.

            if (result.isConfirmed) {
                const reciboCompra = () => {
                    cardConntenedor.innerHTML = ""
                    facturaConntenedor.innerHTML = ""
                    const articulosCarrito = document.createElement("h2")
                    articulosCarrito.classList.add("titulos-seccion")
                    articulosCarrito.innerHTML = `Articulos Seleccionados`
                    facturaConntenedor.appendChild(articulosCarrito)
                    carrito.forEach((producto) => {
                        const div = document.createElement("div")
                        div.classList.add("factura")
                        div.innerHTML = `
                        <div class="card rounded-3 mb-4">
                        <div class="card-body p-4">
                          <div class="row d-flex justify-content-between align-items-center">
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <img
                                src="${producto.image}"
                                class="img-fluid rounded-3"
                                alt="..."
                              />
                            </div>
                            <div class="col-md-3 col-lg-3 col-xl-3">
                              <p class="lead fw-normal mb-2">${producto.title}</p>
                              <p><span class="text-muted">Size: </span>M <span class="text-muted">Color: </span>Grey</p>
                            </div>
                            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                              <button class="btn btn-link px-2" id="${producto.id}" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                <i class="fas fa-minus"></i>
                              </button>
          
                              <input id="form1" min="0" name="quantity" value="${producto.cart}" type="number" class="form-control form-control-sm" />
          
                              <button class="btn btn-link px-2" id="step-up" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                <i class="fas fa-plus"></i>
                              </button>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                              <h5 class="mb-0">$${producto.price}*${producto.cart}</h5>
                            </div>
                            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                              <a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                        // div.innerHTML = `
                        // <img src="${producto.image}" alt="producto" class="factura__img">
                        // <h3 class="factura-titulo">${producto.title}</h3>
                        // <p id="contador" class="factura__cantidad">Cantidad: ${producto.cart}</p>
                        // <p class="factura__precio">Valor Unidad: $ ${producto.price}</p>
                        // `
                        facturaConntenedor.appendChild(div)
                    })

                    const agregarItem = document.getElementById(producto.id)
                    agregarItem.addEventListener("click", () => {
                        agregarCarrito(producto.id)
                    })

                    const agregarCarrito = (productoId) => {
                      let productoSeleccionado = products.find((p) => p.id === productoId)
                      if (carrito.find((p)=> p.id === productoSeleccionado.id)){
                          productoSeleccionado.cart++ // Sugar Syntax Optimizacion ++
                          totalCompra = totalCompra + productoSeleccionado.price
                          itemsCarrito= carrito.reduce((acumulator, actual) => {
                              return acumulator + actual.cart;
                          }, 0)
                          // se envian los productos del carrito y el valor total de compra al storage para poder utilizarlos en la pagina del checkout
                          localStorage.setItem('carritoStorage', JSON.stringify(carrito))
                          localStorage.setItem('totalCompraStorage', JSON.stringify(totalCompra))
                          actualizarCarrito()
                          // Se agrega notificacion al agregar producto
                          Swal.fire({
                          text: 'Agregaste un producto al carrito',
                          timer: 1000,
                          showConfirmButton:false,
                          icon: 'success',
                          position: "top-end",
                          customClass: {
                              popup: "swal-popup"
                          }
                          })
                      }   
                      
                      else {
                          carrito.push(productoSeleccionado)
                          totalCompra = totalCompra + productoSeleccionado.price
                          productoSeleccionado.cart = 1
                          itemsCarrito= carrito.reduce((acumulator, actual) => {
                              return acumulator + actual.cart;
                          }, 0)
                          // se envian los productos del carrito y el valor total de compra al storage para poder utilizarlos en la pagina del checkout
                          localStorage.setItem('carritoStorage', JSON.stringify(carrito))
                          localStorage.setItem('totalCompraStorage', JSON.stringify(totalCompra))
                          actualizarCarrito( )
                          // Se agrega notificacion al agregar producto
                          Swal.fire({
                              text: 'Agregaste un producto al carrito',
                              timer: 1000,
                              showConfirmButton:false,
                              icon: 'success',
                              position: "top-end",
                              customClass: {
                                  popup: "swal-popup"
                              }
                          })
                      }
                  }
              
                  //Se crea la funcion encargada de actualizar el icono del carrito de compras
              
                  const actualizarCarrito = () => {
                      cart.innerHTML = `${itemsCarrito}`
                  }
                    
                    // se calcula y muestra el total de la compra. 
                    let impuestos = totalCompra * 0.19
                    let envio = Math.floor(Math.random()*20)
                    let granTotal = totalCompra + impuestos + envio
                    const divtotal = document.createElement("div")
                    divtotal.classList.add("total")
                    divtotal.innerHTML = `
                    <section class="total">
                    <h2 class="titulos-seccion"> Total Compra </h2>
                    <p class="txt-center padd-min"> Compra total: $ ${totalCompra} USD </p>
                    <p class="txt-center padd-min"> Impuestos: $ ${impuestos} USD </p>
                    <p class="txt-center padd-min"> Envio: $ ${envio} USD </p>
                    <p class="txt-center padd-min bold"> Total a Pagar: $ ${granTotal} USD </p>
                    </section>
                    `
                    facturaConntenedor.appendChild(divtotal)
                }
                
                reciboCompra();

            }
        })
    }
})


// Se crean los filtros por categoria


menCategory.onclick = async () => {
const productsData = await fetch(`https://fakestoreapi.com/products/category/men's clothing`)
const products = await productsData.json()
displayProducts(products)
}

womenCategory.onclick = async () => {
    const productsData = await fetch(`https://fakestoreapi.com/products/category/women's clothing`)
    const products = await productsData.json()
    displayProducts(products)
}

jeweleryCategory.onclick = async () => {
    const productsData = await fetch(`https://fakestoreapi.com/products/category/jewelery`)
    const products = await productsData.json()
    displayProducts(products)
}

electronicsCategory.onclick = async () => {
    const productsData = await fetch(`https://fakestoreapi.com/products/category/electronics`)
    const products = await productsData.json()
    displayProducts(products)
}