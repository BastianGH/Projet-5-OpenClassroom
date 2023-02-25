console.clear();
console.log('ici le script.js')

/*  On sélectionne le futur contenant de nos Articles */ 
let section = document.getElementById('items')

/*  On appelle l'API pour connaître quelles sont les différents produit disponibles
    On obtient alors un tableau contenant les différents produits disponibles ( variable 'products' )
*/
async function getArticles() {
    await  fetch("http://localhost:3000/api/products/")
    .then( function(response) { return response.json(); })
    .then( function(data) { return products = data } )

    return products
}

/*  On récupère la variable 'products'
    On boucle dessus, afin de créer les divers articles :
    On crée dans un premier temps tous les éléments nécessaire;
    On donne à ces éléments les bonnes propriétées grâce aux clés des objets de 'products';
    On 'greffe' ces éléments dans le bon ordre :
        -l'image, le titre et la description sont attachés à l'article;
        -l'article est attaché au lien;
        -enfin le lien est attaché à la section qui contiendra tous les produits.
*/
async function createArticles() {
    await getArticles()

    for ( let i=0; i<products.length; i++) {
        let link = document.createElement('a');
        let article = document.createElement('article');
        let image = document.createElement('img');
        let title = document.createElement('h3');
        let description = document.createElement('p');

        link.href = "./product.html?id="+products[i]._id;
        image.src = products[i].imageUrl;
        title.innerText = products[i].name;
        description.innerText = products[i].description;
        title.className = "productName";
        description.className = "productDescription";
        
        article.appendChild(image)
        article.appendChild(title)
        article.appendChild(description)
        link.appendChild(article)
        section.appendChild(link)
    }
}

/*  On appelle la fonction pour créer les articles */
createArticles();