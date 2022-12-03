const express = require('express');
// J'appelle un fichier nommé "user.controller".
// Il sert à séparer la logique :
// Le fichier "route" sert à lister les méthodes HTTP disponibles
// Le fichier "controller" contient la logique des données (les appels MySQL ici par exemple)
const userController = require('../controllers/user.controller');

const router = express.Router();

// On déclare toutes les méthodes HTTP disponibles pour chaque route :
// GET et PUT sur '/' (soit "http://localhost/api/users/")
router.route('/')
    .get(async (req, res) => {
        // On fait appel à des fonctions que je créé dans le controller.
        const users = await userController.getAll();
        // Si je ne reçois rien, je répond une 404.
        if (!users) {
            res.status(404).json();
        }
        // sinon, je renvoie une 200 avec les données.
        res.status(200).json(users);
    })
    .put(async (req, res) => {
        const new_user = await userController.add(req.body);

        if (!new_user) {
            res.status(404).json();
        }
        res.status(201).json(new_user);
    })
;

// et GET, PATCH et DELETE sur '/:id' (soit "http://localhost/api/users/:id")
router.route('/:id')
    .get(async (req, res) => {
        const user = await userController.getById(req.params.id);
        if (!user) {
            res.status(404).json();
        }
        res.status(200).json(user);
    })
    .patch(async (req, res) => {
        const user = await userController.update(req.params.id, req.body);
        if (!user) {
            res.status(404).json();
        }
        res.status(202).json(user);
    })
    .delete(async (req, res) => {
        const user = await userController.remove(req.params.id);
        if (!user) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

/*
    Notez ici que j'ai "chainé" les méthodes. Il n'y a pas de point virgule après chaque méthode.
    On peut écrire soit :

        router.route('/').get();
        router.route('/').put();
        router.route('/:id').get();
        router.route('/:id').patch();
        router.route('/:id').delete();

    Ou bien chainer les méthodes qui sont sur le même route, comme je l'ai fait ici :

        router.route('/').get().put();
        router.route('/:id').get().patch().delete();

*/


module.exports = router;