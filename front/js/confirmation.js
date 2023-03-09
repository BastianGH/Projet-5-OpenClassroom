//  On va chercher l'id précédemment transmis dans l'URL 
let params = new URLSearchParams(document.location.search);
let id = params.get('id');

// On sélectionne la balise concerné et on lui fourni cet id
let orderId = document.getElementById('orderId');
orderId.innerText = id;
