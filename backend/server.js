const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');
let {pizza} = require('./data/pizza.json');

const app = express();
const port = 5000;

//használatba hozzuk a csomagokat
app.use(fileUpload());
app.use(express.json());

//elérési útvonalhoz hozzárendeljük ugyan azt a nevű mappát és akkor elérhetjük a fájlokat benne
app.use('/public', express.static(`${__dirname}/../frontend/public`));
app.use('/img', express.static(`${__dirname}/../backend/img`));

//megadjuk a kezdőoldalt 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
})

//pizza.json elérésének az útvonala
app.get('/pizza', (reg, res) => {
    fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
        if (err) {
          console.log("hiba:", err);
          res.status(500).send("hibavan");
        } else {
          res.status(200).send(JSON.parse(data));
        }
      });
})

//ha nincs kiépítve adott elérés akkor hibát dobjon fel
app.all('*', (req, res) => {
    res.status(404).send('NOT FOUND!');
})





//a szerver ezen a porton hallgat
app.listen(port, () => {
    console.log(`Server is listening on http://127.0.0.1:${port}`);
})