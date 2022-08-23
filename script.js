// Varaibles

const shoppingCart = document.querySelector(".cart");
const modalOut = document.querySelector(".modal-out");
const modal = document.querySelector(".modal");
const productsDOM = document.querySelector(".container");
const cartTotal = document.querySelector(".total-price");
const cartContainer = document.querySelector(".card-content");
const clearBtn = document.querySelector(".clear-cart");
let cart;

//Get Products

import { productsData } from './products.js';

//Classes

//Get Products

class Products {
    getProduct() {
        return productsData;
    }
}

//Display Products

class UI {
    static displayProducts(_products) {
        let result = "";
        _products.forEach(item => {
            result += `<div class="product">
            <img class="img-product" src=${item.imageUrl} alt="">
            <div>
                <div>
                    <h3>
                        ${item.title}
                    </h3>
                    <span class="product-price">
                        ${item.price}$
                    </span>
                </div>
                <button class="add-btn" data-id="${item.id}">
                    Add to Cart
                </button>
            </div>
        </div>`
        });
        productsDOM.innerHTML = result;
    }
    static getAddToCartBtns() {
        const addToCartBtns = document.querySelectorAll(".add-btn");
        const buttons = [...addToCartBtns];

        buttons.forEach((btn) => {
            const id = Number(btn.dataset.id);
            let cart = "";
            let isInCart;
            if (localStorage.getItem("cart") != null) {
                cart = JSON.parse(localStorage.getItem('cart'));
                isInCart = cart.find(product => product.id === id);
            }
            if (isInCart) {
                btn.innerText = 'In Cart';
                btn.disabled = true;
                btn.style.cursor = "not-allowed";
            }
            btn.addEventListener("click", (e) => {
                e.target.innerText = "In Cart";
                e.target.disabled = true;
                e.target.style.cursor = "not-allowed";
                const addedProducts = { ...Storage.getProducts(e.target.dataset.id), quantity: 1 };
                if (localStorage.getItem("cart") != null) {
                    cart = [...Storage.getCart(), addedProducts];
                } else {
                    cart = [addedProducts];
                }
                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addCartItem(addedProducts);
            })
        })
    }
    static setCartValue(cart) {
        const totalPrice = cart.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
        }, 0)
        cartTotal.innerText = `${totalPrice.toFixed(2)}$`;
        shoppingCart.setAttribute("cart-items", cart.length);
    }
    static addCartItem(cartItem) {
        const div = document.createElement('div');
        div.classList.add("item");
        div.innerHTML = `<div>
        <img class="cart-item-img" src=${cartItem.imageUrl}>
    </div>
    <div class="cart-item-desc">
        <h4>${cartItem.title}</h4>
        <h5>${cartItem.price} $</h5>
    </div>
    <div class="cart-item-conteoller">
        <img class="caret-up" data-id="${cartItem.id}" src="./icons/CaretUp.svg" alt="">
        <p class="item-quantity">${cartItem.quantity}</p>
        <img class="caret-down" data-id="${cartItem.id}" src="./icons/CaretDown.svg" alt="">
    </div>
        <img class="trash" data-id="${cartItem.id}" src="./icons/Trash.svg" alt="">`
        cartContainer.appendChild(div);
    }
    static checkCartItem() {
        cart = Storage.getCart();
        if (cart == null || cart == [] || cart.length == 0) {
            cartContainer.innerHTML = '';
        }
    }
    static setupApp() {
        cart = Storage.getCart();
        cart.forEach(cartItem => {
            this.addCartItem(cartItem);
        });
        this.setCartValue(cart);
    }
    static cartLogic() {
        clearBtn.addEventListener("click", () => {
            cart = Storage.getCart();
            cart.forEach(cItem => this.removeItem(cItem.id));
        });
        cartContainer.addEventListener("click", (e) => {
            cart = Storage.getCart();
            let classList = e.target.classList;
            if (classList.contains("caret-up")) {
                const addQuantity = e.target;
                const addedItem = cart.find(cItem => cItem.id === +addQuantity.dataset.id);
                addedItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            } else if (classList.contains("caret-down")) {
                const subQuantity = e.target;
                const subStarctedItem = cart.find(cItem => cItem.id === +subQuantity.dataset.id);
                if (subStarctedItem.quantity > 1) {
                    subStarctedItem.quantity--;
                    this.setCartValue(cart);
                    Storage.saveCart(cart);
                    subQuantity.previousElementSibling.innerText = subStarctedItem.quantity;
                }
            } else {
                console.log(classList);
                const removeItem = e.target;
                const _removedItem = cart.find(cItem => cItem.id === +removeItem.dataset.id);
                console.log(_removedItem)
                this.removeItem(_removedItem.id);
                removeItem.parentElement.remove();
            }
        })
    }
    static removeItem(id) {
        cart = Storage.getCart();
        let replaceCart = cart.filter(cItem => cItem.id != id);
        this.setCartValue(replaceCart);
        Storage.saveCart(replaceCart);
        this.checkCartItem();
        this.checkBtns();
    }
    static checkBtns() {
        const addToCartBtns = document.querySelectorAll(".add-btn");
        const buttons = [...addToCartBtns];
        buttons.forEach(btn => {
            const id = Number(btn.dataset.id);
            let cart = "";
            let isInCart;
            if (localStorage.getItem("cart") != null) {
                cart = JSON.parse(localStorage.getItem('cart'));
                isInCart = cart.find(product => product.id === id);
            };
            if (isInCart) {
                btn.innerText = 'In Cart';
                btn.disabled = true;
                btn.style.cursor = "not-allowed";
            } else {
                btn.innerText = 'Add to Cart';
                btn.disabled = false;
                btn.style.cursor = "pointer";
            }
        })
    }
    // static quantityChange() {
    //     cart = Storage.getCart();
    //     let quantityItem = '';
    //     let replaceCart = [];
    //     const caretUps = document.querySelectorAll(".cart-item-conteoller img:first-child");
    //     const carets = [...caretUps];
    //     carets.forEach((btn) => {
    //         btn.addEventListener("click", (e) => {
    //             let id = e.target.dataset.id;
    //             cart.forEach(cItem => {
    //                 if (cItem.id === id) {
    //                     quantityItem = cItem;
    //                 }

    //             })
    //         })
    //     });
    // }
}

//Local Storage System

class Storage {
    static saveProducts(_products) {
        localStorage.setItem("products", JSON.stringify(_products));
    }
    static getProducts(id) {
        const _products = JSON.parse(localStorage.getItem('products'));
        let selectedProduct = "";
        _products.forEach((p) => {
            if (p.id === parseInt(id)) {
                selectedProduct = p;
            }
        })
        return selectedProduct;
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem('cart'));
    }
}

//Functions



//Event Listerners

shoppingCart.addEventListener("click", () => {
    modalOut.classList.toggle("none");
    modal.classList.toggle("appear-modal");
})

modalOut.addEventListener("click", () => {
    modalOut.classList.toggle("none");
    modal.classList.toggle("appear-modal");
})

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProduct();
    UI.displayProducts(productsData);
    UI.getAddToCartBtns();
    Storage.saveProducts(productsData);
    UI.setupApp();
    UI.cartLogic();
    // UI.quantityChange();
});