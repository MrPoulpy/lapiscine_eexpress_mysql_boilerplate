const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const users = await userController.getAll();
        if (!users) {
            res.status(404).json();
        }
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


module.exports = router;