let menus = [];
let prices = [];
let amounts = [];
load();


function getMenuIndex(menu) { 
	let index = menus.indexOf(menu); // if the searched value is not in the array, it returns -1, otherwise the position in the array (0, 1, 2 etc)
	return index; 
}


function render() {
    let cartContainer = document.getElementById('cart-content');

    for (let i = 0; i < menus.length; i++) {
        cartContainer.innerHTML += cartHTML(i);
    }
    cartContainer.innerHTML += `
        <div id="total-container" class="cart__total-container">
        </div>
    `;
    showTotal();
}


function addToArray(i) {
    let menu = document.getElementById(`menu${i}`).innerHTML;
    let price = document.getElementById(`price${i}`).innerHTML;
    let actualPrice = price.replace(',', '.');
    let lastPrice = parseFloat(actualPrice);
    let index = getMenuIndex(menu);

    if (index == -1) { // falls das Gericht (menu${i}) im Array schon vorhanden ist - der Fall wenn bereits 1x im cart,
        // wird die Anzahl an der selben Stelle i um 1 erhöht, weil beim ersten Mal sind die Werte noch nicht vorhanden
        // und dem Array wird 1 hinzugefügt, genau so wird menu und price hinzugefügt
        menus.push(menu);
        prices.push(lastPrice);
        amounts.push(1);
    } else { amounts[index] += 1;
    }

    render();
    save();
}


function clearCart() { // separate Funktion, damit der Inhalt des Contents erst beim Click gelöscht wird
    let cartContainer = document.getElementById('cart-content');
    cartContainer.innerHTML = '';
    render();
}


function showTotal() {
    let sumContainer = document.getElementById('total-container');
    let sum = 0;

    for (let i = 0; i < prices.length; i++) {
        sum += prices[i] * amounts[i];
    }

    if (prices.length > 0) { // sumcontainer wird nur dann aktualisiert wenn ""
        let deliveryCost; // for bigger scope declaring outside of if else block
        let finalSum;
    
        if (sum <= 50) {
            finalSum = sum + 4.95;
            deliveryCost = '4,95 CHF';
        } else {
            finalSum = sum;
            deliveryCost = 'Kostenlos';
        }
    
        let formatedPrice = finalSum.toFixed(2).replace('.', ',');
        sumContainer.innerHTML = totalPrice(formatedPrice, sum, deliveryCost);
        showMobileCart(formatedPrice);
    }
}

function showMobileCart(formatedPrice) {
    let mobileCartContainer = document.getElementById('cart-mobile');
    mobileCartContainer.innerHTML = mobileCartButton(formatedPrice);
}


function showRedHeart() {
    let heart1 = document.getElementById('heart1');
    let heart2 = document.getElementById('heart2');
    if (heart2.classList.contains('d-none')) {
        heart2.classList.remove('d-none');
        heart1.classList.add('d-none');
    } else {
        heart1.classList.remove('d-none');
        heart2.classList.add('d-none');
    }
}


function calcPrice(i) {
    let price = prices[i];
    let amount = amounts[i];

    let sumPrice = price * amount;
    return sumPrice;
}


function increaseAmount(index) { 
    let cartContainer = document.getElementById('cart-content');
    amounts[index]++;

    for (let i = 0; i < menus.length; i++) {
        cartContainer.innerHTML += cartHTML(i);
    }
    cartContainer.innerHTML += `
        <div id="total-container" class="cart__total-container">
        </div>
    `;
    
    showTotal();
    save();
}


function decreaseAmount(i) {
    let cartContainer = document.getElementById('cart-content');
    cartContainer.innerHTML = '';
    amounts[i] -= 1;
    if (amounts[i] == 0) {
        amounts.splice(i, 1);
        menus.splice(i, 1);
        prices.splice(i, 1),
        render();
        checkLength();
        save();
    } else {
        render();
        save();
    }
}


function checkLength() {
    let cartContainer = document.getElementById('cart-content');
    let cartMobile = document.getElementById('cart-mobile');

    if (!amounts.length && !menus.length && !prices.length) { // the same as === 0
        cartContainer.innerHTML = addCartInfo();
        cartMobile.innerHTML = '';
    }
}


function save() {
    let menusAsText = JSON.stringify(menus);
    let pricesAsText = JSON.stringify(prices);
    let amountsAsText = JSON.stringify(amounts);

    localStorage.setItem('menu', menusAsText);
    localStorage.setItem('price', pricesAsText);
    localStorage.setItem('amount', amountsAsText);
}


function load() {
    let menusAsText = localStorage.getItem('menu');
    let pricesAsText = localStorage.getItem('price');
    let amountsAsText = localStorage.getItem('amount');

    if (menusAsText && pricesAsText && amountsAsText) {
        menus = JSON.parse(menusAsText);
        prices = JSON.parse(pricesAsText);
        amounts = JSON.parse(amountsAsText);
        deletePreText();
    }
}


function deletePreText() {
    let cartContent = document.getElementById('cart__content-preadd');
    cartContent.innerHTML = '';
}


function toggleBackgroundColor(element) {
    let takeAway = document.getElementById('take-away');
    let delivery = document.getElementById('delivery');

    if (element === takeAway && !takeAway.classList.contains('bg-white')) {
        delivery.classList.remove('bg-white');
        takeAway.classList.add('bg-white');
    } else if (element === delivery && !delivery.classList.contains('bg-white')) {
        delivery.classList.add('bg-white');
        takeAway.classList.remove('bg-white');
    }
}


document.getElementById('take-away').addEventListener('click', function() {
    toggleBackgroundColor(this);
})


document.getElementById('delivery').addEventListener('click', function() {
    toggleBackgroundColor(this); // extra Funktion, weil wir ansonsten kein Parameter übergeben können
})


function onclickButton() {
    let cartMobile = document.getElementById('cart-mobile');
    let cartDesktop = document.getElementById('cart');

    let closeButton = document.createElement('div');
    closeButton.innerHTML = 'x';
    closeButton.classList.add('close-button');
    closeButton.id = 'close-button';
    closeButton.setAttribute('onclick', 'closeCart()');

    cartMobile.style.display = 'none';
    cartDesktop.classList.add('show-cart');
    cartDesktop.appendChild(closeButton);
}

function closeCart() {
    let cartDesktop = document.getElementById('cart');
    let cartMobile = document.getElementById('cart-mobile');
    
    cartDesktop.classList.remove('show-cart');
    cartMobile.style.display = 'block';
}


function cartHTML(i) {
    let formatedPrice = calcPrice(i).toFixed(2).replace('.', ',');
    return `
        <div class="cart__items">
            <div class="cart__item">
                <div class="cart__item-wrapper">
                    <span class="cart__amount">${amounts[i]}</span>
                    <div class="cart__item-sub-wrapper">
                        <span class="cart__menu">${menus[i]}</span>
                        <span id="cart-price" class="cart__price">${formatedPrice} CHF</span>
                    </div>
                </div>
                <div class="cart__additional">
                    <div class="cart__add-wrapper">
                        <div onclick="decreaseAmount(${i})" class="cart__add-icon-bg">
                            <span class="cart__add-icon">
                                <svg viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                </svg>
                            </span>
                        </div>
                        <span>${amounts[i]}</span>
                        <div onclick="increaseAmount(${i}), clearCart()" class="cart__add-icon-bg">
                            <span class="cart__add-icon">
                                <svg viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="cart__separator">
        </div>
    `;
}


function addCartInfo() {
    return `
        <div id="cart__content-preadd">
            <h2 class="cart__content-heading">Fülle deinen Warenkorb</h2>
            <p class="cart__content-text">Füge einige leckere Gerichte aus der Speisekarte hinzu und
                bestelle dein Essen.
            </p>
        </div>
    `;
}


function totalPrice(formatedPrice, sum, deliveryCost) {
    return `
        <div class="cart__subtotal-container">
            <span class="cart__subtotal-text">Zwischensumme</span>
            <span class="cart__subtotal">${sum.toFixed(2).replace('.', ',')} CHF</span>
        </div>
        <div class="cart__subtotal-container" id="subtotal-delivery">
        <span class="cart__subtotal-text">Versand</span>
            <span class="cart__subtotal">${deliveryCost}</span>
        </div>
        <div class="cart__total-subcontainer">
            <span class="cart__total-text">Gesamt</span>
            <span class="cart__total">${formatedPrice} CHF</span>
        </div>
        <div class="button-container">
            <button class="button">Bezahlen (${formatedPrice} CHF)</button>
        </div>
    `;
}

function mobileCartButton(formatedPrice) {
    return `
        <div class="cart-mobile" id="cart-mobile-sub">
            <div class="button-container btn-cnt-mobile-cart">
                <button id="button-mobile" class="button" onclick="onclickButton()">Warenkorb (${formatedPrice} CHF)</button>
            </div>
        </div>    
    `;
}