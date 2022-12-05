const Joi = require('joi');

const schema = Joi.object().keys({
    title: Joi.string().required(),
    genre: Joi.string(),
    annee: Joi.number().less(2022),
    actors: Joi.array().required().items(Joi.number())
});

module.exports = schema;