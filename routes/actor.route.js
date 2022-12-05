const express = require('express');

const actorController = require('../controllers/actor.controller');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const actors = await actorController.getAll();
        if (!actors) {
            res.status(404).json();
        }
        res.status(200).json(actors);
    })
    .put(async (req, res) => {
        const new_actor = await actorController.add(req.body);

        if (!new_actor) {
            res.status(404).json();
        }
        res.status(201).json(new_actor);
    })
;

router.route('/:id')
    .get(async (req, res) => {
        const actor = await actorController.getById(req.params.id);
        if (!actor) {
            res.status(404).json();
        }
        res.status(200).json(actor);
    })
    .patch(async (req, res) => {
        const actor = await actorController.update(req.params.id, req.body);
        if (!actor) {
            res.status(404).json();
        }
        res.status(202).json(actor);
    })
    .delete(async (req, res) => {
        const actor = await actorController.remove(req.params.id);
        if (!actor) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

module.exports = router;