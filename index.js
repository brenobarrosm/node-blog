const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");

const app = express();

//View Engine
app.set('view engine', 'ejs');

//Static Files
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection.authenticate().then(() => {
    console.log("Conexão realizada!");
}).catch(error => {
    console.log(error);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080, () => {
    console.log("Servidor iniciado.");
});