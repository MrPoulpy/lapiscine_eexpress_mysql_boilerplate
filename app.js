// On appelle les paquets NPM
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// On appelle également notre fichier "config.json" dans lequel 
// se trouvent les paranètres de notre serveur.
// Notez le './' devant le nom de fichier ; sinon, require cherche
// le dossier node_modules
const config = require('./config');

// On appelle le dossier 'routes'.
// Sans précision, node cherche un fichier .js ou .json portant le nom
// indiqué. Ici, "routes" est un dossier. Par défaut, node va chercher
// un fichier "index.js" à l'intérieur.
const routes = require('./routes');

// On créé notre serveur
const app = express();

// On applique nos middlewares : morgan, pour les logs dans le console
app.use(morgan('dev'));
// CORS, pour gérer les entêtes HTTP : 
// (https://developer.mozilla.org/fr/docs/Glossary/CORS)
app.use(cors());
// JSON du paquet Express, pour permettre à Express de parser le JSON 
// envoyé dans le corps des requêtes
app.use(express.json());


// On applique notre router (situé dans routes/index.js) sur l'adresse
// "/api". Toutes nos routes seront donc de la forme : 
// "http://localhost/api/{entité}" etc.
app.use(config.basePath, routes);


// On dit à notre serveur Express d'écouter le port 80 pour fonctionner
// (port par défaut de HTTP).
app.listen(config.port, () => {
    console.log("Server up on port " + config.port);
});