console.clear();
console.log('ici le products.js');

/*  On sélectionne tous les éléments HTML dont on aura besoin */
let imageContainer = document.getElementsByClassName('item__img')[0];
let title = document.getElementById('title'); 
let price = document.getElementById('price'); 
let description = document.getElementById('description'); 
let options = document.getElementById('colors'); 
let button = document.getElementById('addToCart');

/*  On sélectionne l'ID se trouvant dans l'URL, que nous avons passé précédemment */
let params = new URLSearchParams(document.location.search);
let id = params.get('id');

/*  On requête l'API afin qu'il nous envoie l'article correspondant à l'ID en question
    La réponse est donc constitué d'un seul objet qui sera la variable 'product'
*/
async function getArticle() {
    await  fetch("http://localhost:3000/api/products/"+id)
    .then( function(response) { return response.json(); })
    .then( function(data) { return product = data } )    
};

/*  On récupère la variable 'product'
    On crée notre image 
    On crée une variable pour les couleurs disponbiles concernant le produit
    On donne à nos divers éléments HTML, les bonnes propriétées grâce à 'product'
    On 'greffe' l'image crée au conteneur approprié
    On boucle sur les diverses couleur disponibles du produit concerné :
        -On crée une nouvelle balise option
        -On lui donne la valeur et l'attribut value, d'une des couleurs disponibles
        -On le 'greffe' au sélecteur
*/
async function createArticle() {
    await getArticle();

    let image = document.createElement('img');
    let colors = product.colors;
    
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    title.innerText = product.name;
    price.innerText = product.price;
    description.innerText = product.description;  
    
    imageContainer.appendChild(image);

    for ( let i=0; i<colors.length ; i++) {
        let option = document.createElement('option');
        option.value = option.innerText = colors[i];
        options.appendChild(option);
    }
}


/*  On appelle la fonction pour créer l'article */
createArticle();

/*  On met une écoute d'évènement au click sur le bouton "Ajouter au panier" 
    On initialise une nouvelle variable, qui contiendra toutes les infos
    On sélectionne l'Id du produit actuelle, la couleur et la quantité choisie
    On met toutes ces valeur dans notre nouvel objet

    Ensuite on veut mettre notre objet dans le localStorage pour représenter le panier :
        Si le produit concerné y est déja :
            On vérifie si la couleur de celui-ci est la même que celle sélectionné :
                Si oui, on incrémente seulement la quantité de notre produit;
                Si non, on crée un nouveau produit;
        Sinon, si le produit concerné n'y est pas encore, on l'ajoute simplement dans le panier
*/
button.addEventListener('click',function () {
    let newProduct = {};
    let quantityInput = document.getElementById('quantity')
    let newQuantity = parseInt(quantityInput.value);
    // let color = option.value;

    // newProduct.push(color)
   
    let addedProduct = JSON.parse(window.localStorage.getItem(product._id))
    console.log(addedProduct)

    if(addedProduct) {
        let oldQuantity = parseInt(addedProduct.quantity)
        newProduct.quantity = oldQuantity+newQuantity
        newProduct = JSON.stringify(newProduct);
        window.localStorage.setItem(product._id, newProduct)
        console.log("La quantité a été mise à jour")
    }else { 
        newProduct.quantity = newQuantity
        newProduct = JSON.stringify(newProduct);
        window.localStorage.setItem(product._id, newProduct)
        console.log("Le produit a été ajouté au panier")
    }
});

