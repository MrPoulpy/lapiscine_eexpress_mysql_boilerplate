const db = require('../utils/db');

const getAll = async () => {
    const [users, err] = await db.query("SELECT * FROM users");
    return users;
};

const getById = async (id) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
        return null;
    }
    return user[0];
};

const add = async (data) => {
    const [req, err] = await db.query("INSERT INTO users (email, password) VALUES (?,?)", [data.email, data.password]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

const update = async (id, data) => {
    const user = await getById(id);
    if (!user) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE users SET email = ?, password = ? WHERE id = ? LIMIT 1", 
        [
            data.email || user.email, 
            data.password || user.password, 
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
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