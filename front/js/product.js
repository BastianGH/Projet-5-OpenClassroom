console.clear();
console.log('ici le products.js');

/*  On sélectionne tous les éléments HTML dont on aura besoin */
let imageContainer = document.getElementsByClassName('item__img')[0];
let title = document.getElementById('title'); 
let price = document.getElementById('price'); 
let description = document.getElementById('description'); 
let options = document.getElementById('colors'); 
let quantityInput = document.getElementById('quantity')
let button = document.getElementById('addToCart');
let chosenColor

/*  On sélectionne l'ID se trouvant dans l'URL, que nous avons passé précédemment */
let params = new URLSearchParams(document.location.search);
let id = params.get('id');

/*  On requête l'API afin qu'il nous envoie l'article correspondant à l'ID en question
    La réponse est donc constitué d'un seul objet qui sera la variable 'product'
*/
async function getArticle() {
    await  fetch("http://localhost:3000/api/products/"+id)
    .then( function(response) { return response.json() })
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

/*  On écoute le changement d'option sur le "bouton select" pour connaitre la couleur choisie par le client */
colors.addEventListener('change', function() {
    chosenColor = colors.value
});

/*  On met une écoute d'évènement au click sur le bouton "Ajouter au panier" 
    On initialise une nouvelle variable, qui contiendra toutes les infos du produit
    On sélectionne l'Id du produit actuelle, la couleur et la quantité choisie
    On oublie pas de convertir la quantité en Integer pour la suite
    On met toutes ces valeur dans notre nouvel objet

    Ensuite on veut représenter notre panier dans le localStorage,
    On va dans un premier temps vérifier si le panier est déja crée,
    On vérifie également que l'utilisateur a bien choisi une couleur :
        Si le panier existe déja : 
            On vérifie si le produit concerné y est déja,
            Pour cela on boucle sur notre Array 'panier'
            Si le produit et sa couleur sont la même que celle sélectionné :
                On incrémente seulement la quantité de notre produit;
                Si non, on crée un nouveau produit;
            Sinon, si le produit concerné n'y est pas encore,
            On l'ajoute simplement dans le panier
        Si le panier n'existe pas encore, on initialise notre objet,
        On lui push le produit voulu et on initialise notre panier dans le localStorage        
*/
button.addEventListener('click',function () {
    let newProduct = {};
    let newQuantity = parseInt(quantityInput.value);
    newProduct.id = product._id
    newProduct.quantity = newQuantity
    newProduct.color = chosenColor  
        
    let existingCart = JSON.parse(window.localStorage.getItem('panier'))
// empecher de mettre nimporte quelle quantité 
    if(chosenColor) {
        if(existingCart) {
            let addedProduct = false;
            let oldId
    
            for( let i=0; i<existingCart.length; i++ ){    
                if(existingCart[i].id===newProduct.id && existingCart[i].color===newProduct.color){
                    addedProduct = true;
                    oldId = i;
                }
            }
            
            if(addedProduct){
                existingCart[oldId].quantity += newProduct.quantity;
                console.log(existingCart)
                existingCart = JSON.stringify(existingCart);
                window.localStorage.setItem('panier', existingCart)
            }else {
                existingCart.push(newProduct)
                existingCart = JSON.stringify(existingCart);
                window.localStorage.setItem('panier', existingCart)
            }
        }else { 
            let panier = [];
            panier.push(newProduct)
            panier = JSON.stringify(panier);
            window.localStorage.setItem('panier', panier)
        }
    }
});

