const express = require('express');
// On importe ici tous les fichiers "route" contenus dans le 
// dossier "routes"
const userRoute = require('./user.route');

// Comme sur app.js, on appelle le router de Express...
const router = express.Router();

// ... et on pointe chaque entité vers la bonne sous-route.
// Ici, les routes contenues dans le fichier user.route.js pointeront vers /
// "http://localhost/api/users"
router.use('/users', userRoute);

// On exporte le router pour le rendre accessible en faisant un 
// require de ce fichier.
// Dans app.js, lorsqu'on fait "const router = require('./routes')",
// "router" vaut ce qui est renseigné dans ce "module.exports"
module.exports = router;