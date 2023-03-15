console.clear();
console.log("ici le cart.js")


/* On initialise les variables dont on aura besoin dans tout le code */
let cart = JSON.parse(window.localStorage.getItem('panier'));
const cartSection = document.getElementById('cart__items');
const form = document.querySelector('form');
const formInputs = form.querySelectorAll('input');
const errors = form.querySelectorAll('p');
let permission 


if(!cart) {
    form.style.display = "none"
}else {
    form.style.display = "block"
}
/*  On requête l'API afin qu'il nous envoie l'article correspondant à l'ID en question
    La réponse est donc constitué d'un seul objet qui sera la variable 'product'
*/
async function getArticle(id) {
    await  fetch("http://localhost:3000/api/products/"+id)
    .then( function(response) { return response.json() })
    .then( function(data) { return product = data } )    
};

/*  On fait un fonction pour créer tout notre contenu : 
    On boucle sur les produits présents dans notre panier :
        On attend la réponse l'API pour le produit concerné
        On créer l'article 
        On lui fourni tout le code dont il sera constitué en HTML
        On greffe l'article au conteneur 
*/
async function showCart() {
    if(cart) {
        for( let i=0; i<cart.length; i++) {
            await getArticle(cart[i].id);
        
            let article = document.createElement('article');

            article.innerHTML = `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
            <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${cart[i].color}</p>
                <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>`
        
            cartSection.appendChild(article)
        }
    }
}

/*  Notre fonction pour faire les totaux des quantité et des prix :
    On sélectionne les balises concernés
    On créer un objet pour simplifier le code
    On met/remet les valeurs à 0 au début

    On reboucle sur notre cart :
        On Rappelle notre API car on aura besoin du prix
        On converti bien la quantité en nombre pour que tout soit fonctionnel
        On donne incrémente la quantité dans l'objet qu'on a créer par la quantité du produit dans le panier
        On incrémente le prix dans l'objet qu'on a crée par le prix du "produit" dans le panier ( la quantité de ce produit x son prix )

    Ensuite on utilise les deux clés de notre objets pour donner les bonnes valeurs
    attendues dans les balises
*/
async function articleSum() {
    let finalQuantity = document.getElementById('totalQuantity')
    let finalPrice = document.getElementById('totalPrice')
    let sum = {};
    sum.quantity = 0;
    sum.price = 0;

    if(cart) {
        for( let i=0; i<cart.length; i++ ) {
            await getArticle(cart[i].id);
    
            let productQuantity = parseInt(cart[i].quantity) 
    
            sum.quantity += productQuantity
            sum.price += productQuantity * product.price
        }
    }        

    finalQuantity.innerText = sum.quantity;
    finalPrice.innerText = sum.price;
}

/*  On a notre fonction pour changer la quantité : 
    On lui passe l'évènemenent 
    On initialise les variables dont on aura besoin pour simplifier le code :
        Grâce à l'event, on cible l'input conerné et sa valeur;
        On créer une variable product contenant les caractéristiques principale de l'objet concerné par l'input ciblé;
        On créer un nouvel item qui contiendra ses caractéristiques pour simplifier;
    
    On boucle sur notre panier :
        Si l'Id et la couleur sont la même que le produit concerné:
            On change la quantité du produit dans le panier

    On initialise une variable pour le nouveau panier et
    On change donc le panier dans le localStorage
    On relance la fonction pour faire le total
*/
function changeQuantity(event) {
    let input = event.target
    let newQuantity = input.value

    if (newQuantity > 0 && newQuantity < 100) {
        let product = input.closest('article')
        let item = {}
        item.id = product.dataset.id
        item.color = product.dataset.color

        for(let i = 0; i<cart.length; i++) {
            if(cart[i].id === item.id && cart[i].color === item.color) {
                cart[i].quantity = newQuantity
            }
        }

        let newCart = JSON.stringify(cart);
        window.localStorage.setItem('panier', newCart)
        articleSum();
    }
}

/*  On a notre fonction pour supprimer le produit : 
    On lui passe l'évènemenent 
    On initialise les variables dont on aura besoin ( cf modification quantité )
    
    On boucle sur notre panier :
        Si l'Id et la couleur sont la même que le produit concerné:
            On supprime le produit du panier

    Si le panier ne contient plus qu'un élément :
        On retire le panier du localStorage
    Sinon 
        On initialise une variable pour le nouveau panier
        On change donc le panier dans le localStorage
        
    On supprime l'élément concerné dans le DOM
    On met à jour le total
*/
function deleteItem(event) {
    let input = event.target
    let product = input.closest('article')
    let item = {}
    item.id = product.dataset.id
    item.color = product.dataset.color

    for(let i = 0; i<cart.length; i++) {
        if(cart[i].id === item.id && cart[i].color === item.color) {
            cart.splice(i, 1)
        }
    }

    if (cart.length === 0) {
        window.localStorage.removeItem('panier')
        form.style.display = "none"
    }else {
        let newCart = JSON.stringify(cart);
        window.localStorage.setItem('panier', newCart)
    }

    product.remove();
    articleSum();
}

/*  On créer une fonction pour les fonctionnalitées des produits affichés :
    On attends que les éléments aient été générés dynamiquement
    On lance la fonction pour faire le total

    On peut alors créer des variables contenant la liste de nos différents boutons

    On boucle sur notre panier :
        pour chaque itération, on permet aux boutons de lancer une fonction si :
            La valeur de la quantité est changé, la fonction de la quantité sera lancée;
            On clique sur le 'bouton' supprimer, la fonction de suppresion sera lancée;
*/
async function workingCart () {
    await showCart()
    articleSum();

    let quantityInputs = document.querySelectorAll('.itemQuantity')
    let deleteButtons = document.querySelectorAll('.deleteItem')

    if(cart) {
        for (let i=0; i<cart.length; i++ ) {
            quantityInputs[i].addEventListener('change', changeQuantity)
            deleteButtons[i].addEventListener('click', deleteItem)
        }
    }    
}

/*  On lance notre fonction */
workingCart();

/*  On boucle sur les input de notre formulaire :
    On leur ajoute une écoute d'évènement au changement de leurs valeurs
    Chaque input va donc vérifier son propre contenu avec la fonction ci-arpès
*/
for (let i = 0; i<formInputs.length-1; i++) {
    formInputs[i].addEventListener('change', checkInputs)
}

/*  Notre fonction de vérification des inputs:
    On créer des variables pour initialiser les valeurs de notre input
    Une concernant le message d'erreur approprié
    Et des regex

    En fonction de la valeur de nom de l'input on va vérifier sa valeur : 
        Pour les premiers inputs et la ville, on vérifie si c'est seulement du texte;
        Pour l'addresse, on vérifie que la chaine commence par un chiffre et possède 2 mots;
        Pour l'email, on vérifie la présence de divers caractères, suivi d'un @, suivi d'une autre chaine de caractère, suivi d'un point, suivi d'une autre chaine de 2 à 4 caractères.
    Si la valeur des inputs respecte les conditions mentionné plus haut, aucun message d'erreur ne s'affiche, sinon on affiche le message d'erreur approprié.
*/
function checkInputs(event) {
    let inputName = event.target.name;
    let inputValue = event.target.value;
    let errorMessage = document.getElementById(`${inputName}ErrorMsg`);
    const textTest = /^[a-zA-Z]+$/;
    const adressTest = /^[0-9]+\s+[a-zA-Z]+\s+[a-zA-Z]+$/;
    const emailTest = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    switch (inputName) {
        case 'firstName':
            if (textTest.test(inputValue)) {
                errorMessage.innerText = ''
              }else {
                errorMessage.innerText =  "Veuillez saisir un prénom valide !"
              }
            break;
        case 'lastName':
            if (textTest.test(inputValue)) {
                    errorMessage.innerText = ''
                }else {
                    errorMessage.innerText =  "Veuillez saisir un nom valide !"
                }    
            break;
        case 'address':
            if (adressTest.test(inputValue)) {
                    errorMessage.innerText = ''
                }else {
                    errorMessage.innerText =  "Veuillez saisir une adresse valide !"
                }       
            break;
        case 'city':
            if (textTest.test(inputValue)) {
                    errorMessage.innerText = ''
                }else {
                    errorMessage.innerText =  "Veuillez saisir un nom de ville valide !"
                }       
            break;
        case 'email':
            if (emailTest.test(inputValue)) {
                    errorMessage.innerText = ''
                }else {
                    errorMessage.innerText =  "Veuillez saisir un email valide !"
                }       
            break;
        default:
            break;
    }
}

/*  A l'appui sur le bouton d'envoi de formulaire, on empêche l'actualisation de la page
    Et on lance notre fonction pour vérifier le formulaire 
*/
form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    checkForm()
});

/*  Notre fonction de vérification du formulaire : 
    On donne à notre variable permission la valeur true par défaut

    Ensuite on boucle sur les messages d'erreurs du formulaire :
        Si il y en a au moins un qui signale une erreur, on passe la permission à false

    Ensuite si la permission vaut true, on peut envoyer le formulaire
*/
function checkForm() {
    permission = true ;

    for(let i = 0; i<errors.length; i++) {
        if (errors[i].innerText !== "" ){
            permission = false ;
        }
    }
    
    if(permission) {
        sendForm()
    }
}

/*  Notre fonction d'envoi de formulaire :
    On initialise deux objets : 
    contact contiendra nos informations de contact renseigné dans le formulaire
    order contiendra contact ainsi que notre panier

    On boucle sur chacun de nos inputs :
        On met la valeur de chaque input dans notre objet contact

    On met nos object contact et notre panier dans order

    On lance la fonction pour poster notre objet dans l'API avec notre objet en argument
*/
function sendForm() {
    console.log("vous n'avez pas d'erreurs, votre formulaire va être envoyé !")
    let contact = {};
    let order = {};
    

    for (let i = 0; i<formInputs.length-1; i++) {
        contact[formInputs[i].name] = formInputs[i].value ;
    }
    
    order.contact = contact;
    order.products = cart.map((product) => {
        return product.id
    })

    postObject(order);
    
}

/*  Fonction pour poster un objet dans l'API :
    On requête notre API avec la méthode POST et notre objet dans le body

    On obtient la réponse de cette requête
    On supprimme notre objet 'panier' dans le localStorage
    On redirige l'utilisateur vers la page confirmation
    avec l'id de commande en jeton dans l'url
*/
async function postObject(object) {
    let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(object)
    });
      
    let result = await response.json();

    window.localStorage.removeItem('panier')
    window.location.href = `confirmation.html?id=${result.orderId}`;
}
