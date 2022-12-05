const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = () => {
    return async (req, res, next) => {
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }

        const access_token = header.split(" ")[1];


        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({error: "JWT invalide"});
            } else {
                next();
            }
        });
    }
}