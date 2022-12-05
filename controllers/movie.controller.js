const db = require('../utils/db');

const actorController = require('./actor.controller');

const getAll = async (length) => {
    const [response, err] = await db.query("SELECT * FROM movies");
    const movies = [];
    for (let movie of response) {
        movie.actors = await findActorsById(movie.id);
        movies.push(movie);
    }
    return movies;
};

const getById = async (id) => {
    const [movie, err] = await db.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (!movie) {
        return null;
    }
    movie[0].actors = await findActorsById(id);
    return movie[0];
};

const add = async (data) => {

    const [req, err] = await db.query("INSERT INTO movies (title, genre, annee) VALUES (?,?,?)", [data.title, data.genre, data.annee]);
    for (let actor of data.actors) {
        const [req, err] = await db.query("INSERT INTO movies_actors (movie_id, actor_id) VALUES (?, ?)", [req.insertId, actor]);
    }
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

const update = async (id, data) => {
    const movie = await getById(id);
    if (!movie) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE movies SET title = ?, genre = ?, annee = ? WHERE id = ? LIMIT 1", 
        [
            data.title || movie.title, 
            data.genre || movie.genre,
            data.annee || movie.annee,
            id
        ]);

        if (data.actors) {
            const [req, err] = await db.query("DELETE FROM movies_actors WHERE movie_id = ?", [id]);
            if (!req) {
                for (let actor of data.actors) {
                    const [req, err] = await db.query("INSERT INTO movies_actors (movie_id, actor_id) VALUES (?, ?)", [id, actor]);
                }
            }
        }
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM movies WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

const findActorsById = async (id) => {
    const [actor_ids, err] = await db.query("SELECT actor_id FROM movies_actors WHERE movie_id = ?", [id]);
    const actors = [];
    for (let act of actor_ids) {
        const actor = await actorController.getById(act.actor_id);
        actors.push(actor);
    }
    return actors;
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
};