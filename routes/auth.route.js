const express = require('express');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user.controller');
const config = require('../config');
const isAuth = require('../utils/auth');

const router = express.Router();

router.route('/')
    .post(async (req, res) => {
        
        let user = await userController.getByEmailAndPassword(req.body);

        if (!user) {
            res.status(401).json({message: "Combinaison email/password incorrecte"});
        } else {
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                roles: user.roles
            }, config.jwtPass, { expiresIn: '1 hour' });
    
            res.json({
                access_token: token
            });
        }
    })
;

router.route('/test')
    .get(isAuth(), (req, res) => {
        res.json({message: "coucou"});
    })
;

module.exports = router;