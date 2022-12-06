const express = require('express');

const movieController = require('../controllers/movie.controller');
const movieSchema = require('../models/movie');
const validator = require('../utils/validator');
const authValidator = require('../utils/auth');

const router = express.Router();

router.route('/')
    .get(authValidator.isAuth(), async (req, res) => {
        const movies = await movieController.getAll();
        if (!movies) {
            res.status(404).json();
        }
        res.status(200).json(movies);
    })
    .put(authValidator.isAuth(), validator(movieSchema), async (req, res) => {

        // Je récupère l'id de l'utilisateur connecté ici
        const new_movie = await movieController.add(req.body, req.auth.id);

        if (!new_movie) {
            res.status(404).json();
        }
        res.status(201).json(new_movie);
    })
;

router.route('/:id')
    .get(authValidator.isAuth(), async (req, res) => {
        const movie = await movieController.getById(req.params.id);
        if (!movie) {
            res.status(404).json();
        }

        if (req.auth.roles != "admin" && (movie.user_id != req.auth.id)) {
            res.status(403).json({message: "C'est pas ton film, dégage"});
        } else {
            res.status(200).json(movie);
        }
    })
    .patch(authValidator.isAuth(), validator(movieSchema), async (req, res) => {
        const movie = await movieController.update(req.params.id, req.body);
        if (!movie) {
            res.status(404).json();
        }
        res.status(202).json(movie);
    })
    .delete(authValidator.isAuth(), async (req, res) => {
        const movie = await movieController.remove(req.params.id);
        if (!movie) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

module.exports = router;