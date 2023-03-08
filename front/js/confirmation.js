let params = new URLSearchParams(document.location.search);
let id = params.get('id');

let orderId = document.getElementById('orderId')
orderId.innerText = id;