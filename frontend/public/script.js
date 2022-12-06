const rootElement = document.querySelector('#root');

// a szerveren megadott elérési útvonalon keresztül elérhető json fálj kibontása
const fetchPizzaList = async () => {
    return fetch("/pizza")
      .then((res) => res.json())
      .then((pizzas) => pizzas);
};

//weboldal törzs
rootElement.insertAdjacentHTML("afterbegin",
    `
    <main><h1>BPE - Best Pizza Ever </h1></main>
    
    <div class="mainContainer">
        <div class="pizzaContainer">
        </div>
        <div class="shoppingCart">    
                <form id="form">
                    <div class="decoCont">
                        <div class="circleShape"></div>
                        <div class="circleShape"></div>
                        <div class="circleShape"></div>
                        <div class="circleShape"></div>
                        <div class="circleShape"></div>
                        <div class="circleShape"></div>
                    </div>
                    <h2>Rendelésed részletei...</h2>
                    <div class="pizzaOrderDetails">
                    
                    </div>
                    <div class="inputLines">
                        <input type="text" name="name" placeholder="Név" >
                        <input type="number" name="zipcode" placeholder="Irányítószám" >
                        <input type="text" name="city" placeholder="Város" >
                        <input type="text" name="street" placeholder="Utca" > 
                        <input type="text" name="house-number" placeholder="Házszám" >
                        <input type="text" name="number" placeholder="Telefonszám" >
                        <input type="text" name="email" placeholder="E-mail cím" >
                    </div>
                    <button id="order">Megrendelem</button>
                </form>
            </div>
    </div>
    `
)



//template a pizzákhoz
const pizzaCard = (id, name, price, ingredients, image) =>
    `
    <div class="singlePizza">
        <img src="${image}">
        <div class="pizzaDetail">
            <h2>${name}</h2>
            <h3>${price} Ft</h3>
            <p>${ingredients}</p>
            <button type="submit" data-id="${id}" class="add-pizza-button" id="order">Kosárba</button>
        </div>
    </div>
    `
//kiválasztott pizza template
const orderedPizzaListElement = (name, price, id) => `
    <div id="orderedPizza${id}" class="order">  
        <button type="button" onclick="return this.parentNode.remove();" class="deleteButton" data-id="${id}">
        X</button>    
        <h4 id="${name}">${name}</h4>
        <h5>${price} Ft</h5>
        <input type="number" id="numberOfOrders${id}" name="pizzaCounter${id}" min="1" max="10" value="1">
    </div>
    `

//loadevent
async function loadEvent() {
    const pizzas = await fetchPizzaList();
    const pizzaContainer = document.querySelector('.pizzaContainer');
    const form = document.querySelector('#form');

    //pizzacard tamplateje alapján példányosítva létrehozza a pizzákat
    pizzas.forEach((pizza) => { 
        if (pizza.isAvailable)
            pizzaContainer.insertAdjacentHTML("beforeend", 
            pizzaCard(
                pizza.id,
                pizza.name,
                pizza.price,
                pizza.ingredients,
                pizza.image
            ));
    });

    const orderButtons = document.querySelectorAll('.add-pizza-button');
    const pizzaOrderDetails = document.querySelector('.pizzaOrderDetails');
    let arrayOfOrders =[];
    let pizzaOrder = {
        name: "pizza",
        NumberOfPizza: ""
    };

    // az össze kosárba buttonon végigmegy és hozzárendel egy click listenert
    //itt hozza létre a tamplate alapján a kiválaszto tt pizzákat
    orderButtons.forEach((orderButton) => {
        orderButton.addEventListener('click', () => {
            pizzas.forEach((pizza) => {
                // ha a button id és a pizza id megegyezik új tömbökbe rakja az adott pizzát
                if(+orderButton.dataset.id === pizza.id) {
                    //window. a változó elé globállissá teszi azt
                    window.result = pizzas.find(pizza => pizza.id === +orderButton.dataset.id);
                    /* console.log(result); */

                    if(result.isAvailable) {
                        //ID kiszelektálása a dinamikusan létrejött egyedi pizzakártyáknak változókba
                        const currentPizzaHTMLId = `#orderedPizza${result.id}`;
                        const isOrdered = document.querySelector(currentPizzaHTMLId);

                        const currentPizzaButtonId = `#numberOfOrders${result.id}`;
                        const numberButton = document.querySelector(currentPizzaButtonId);

                        if (!isOrdered) { //ha nincs még megrendelve akkor létrehozza a kártyákat
                            pizzaOrderDetails.insertAdjacentHTML("beforeend",
                            orderedPizzaListElement(result.name, result.price, result.id))

                            let pizzaOrderFinal = Object.create(pizzaOrder);
                            pizzaOrderFinal.name = result.name+result.id;
                            
                            arrayOfOrders.push(pizzaOrderFinal.name);
                            
                        } else {
                            // pizzarendelés darabszám növelés
                            ++numberButton.value;
                        }}
                    
                    
                    }
            })})});

    //submit form function
    function submitFormData(event) {
        event.preventDefault(); //alapműködés letiltása

        const data = new FormData(event.target); //fetch számára elfogadható formába kerül a formn adatai
        /* data.append("Pizza", result.name); */
        
        data.append("Pizza Orders", arrayOfOrders)
        const customerData = Object.fromEntries(data.entries()); //átalakítja json kompatibilisség
        console.log({customerData}); //kilogolja a tartalmat


        //pizzák hozzáadása az objekthez
        //csekkolni, hogy hány darab pizza rendelés van

    }
    //végrehajtja a submitet a formból
    form.addEventListener('submit', submitFormData);

    
    
}

//loadevent betöltése
window.addEventListener("load", loadEvent);
