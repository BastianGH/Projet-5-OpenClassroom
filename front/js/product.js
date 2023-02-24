console.clear();
console.log('ici le products.js');

let params = new URLSearchParams(document.location.search);
let id = params.get('id');

let imageContainer = document.getElementsByClassName('item__img')[0];
let title = document.getElementById('title'); 
let price = document.getElementById('price'); 
let description = document.getElementById('description'); 
let options = document.getElementById('colors'); 

async function getArticle() {
    await  fetch("http://localhost:3000/api/products/"+id)
    .then( function(response) { return response.json(); })
    .then( function(data) { return product = data } )

    let image = document.createElement('img');
    
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    title.innerText = product.name;
    price.innerText = product.price;
    description.innerText = product.description;

    let colors = product.colors;

    for ( let i=0; i<colors.length ; i++) {
        let option = document.createElement('option')
        option.value = option.innerText = colors[i]
        options.appendChild(option)
    }

    imageContainer.appendChild(image);
};

getArticle();

let button = document.getElementById('addToCart');
button.addEventListener('click',function () {
    let newProduct = [];
    let quantityInput = document.getElementById('quantity')
    let color = option.value;
    let quantity = quantityInput.value

    newProduct.push(product._id)
    newProduct.push(color)
    newProduct.push(quantity)

    console.log("Le produit a été ajouté au panier")
    console.log(newProduct)
});

