const db = require('../utils/db');

const getAll = async () => {
    const [actors, err] = await db.query("SELECT * FROM actors");
    return actors;
};

const getById = async (id) => {
    const [actor, err] = await db.query("SELECT * FROM actors WHERE id = ?", [id]);
    if (!actor) {
        return null;
    }
    return actor[0];
};

const add = async (data) => {
    const [req, err] = await db.query("INSERT INTO actors (first_name, name, nationality) VALUES (?,?,?)", [data.first_name, data.name, data.nationality]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

const update = async (id, data) => {
    const actor = await getById(id);
    if (!actor) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE actors SET first_name = ?, name = ?, nationality = ? WHERE id = ? LIMIT 1", 
        [
            data.first_name || actor.first_name, 
            data.name || actor.name,
            data.nationality || actor.nationality,
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM actors WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
};