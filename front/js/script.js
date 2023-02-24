console.clear();
console.log('ici le script.js')

let section = document.getElementById('items')

async function createArticles() {
    await  fetch("http://localhost:3000/api/products/")
    .then( function(response) { return response.json(); })
    .then( function(data) { return products = data } )

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

createArticles();