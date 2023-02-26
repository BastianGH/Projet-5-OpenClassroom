console.clear();
console.log("ici le cart.js")

let cart = JSON.parse(window.localStorage.getItem('panier'))
let cartSection = document.getElementById('cart__items')


for( let i=0; i<cart.length; i++) {
    console.log(cart[i])

    let article = document.createElement('article');

    cartSection.appendChild(article)
}