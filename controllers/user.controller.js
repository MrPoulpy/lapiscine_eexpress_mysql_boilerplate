const bcrypt = require('bcrypt');

// On appelle un fichier créé qui tient le connexion MySQL.
const db = require('../utils/db');

// Je créé des fonctions async qui appelle la base de données, et renvoie les données.
const getAll = async () => {
    const [users, err] = await db.query("SELECT * FROM users");
    return users;
};

const getById = async (id) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user || user.length == 0) {
        return null;
    }
    // getById sert ici à récupérer un seul user. On retourne donc user[0], car MySQL répond
    // toujours un array.
    return user[0];
};

const add = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [req, err] = await db.query("INSERT INTO users (email, password, first_name, name, roles, created_at, updated_at) VALUES (?,?,?,?,?, NOW(), NOW())", 
    [data.email, hashedPassword, data.first_name, data.name, 'user']);
    if (!req) {
        return null;
    }
    // Une fois un user ajouté en base, on appelle la fonction getById, créée plus haut, qui permet d'aller
    // récupérer en base le user nouvellement créé, sans réécrire la fonction "SELECT * FROM users"
    return getById(req.insertId);

};

const update = async (id, data) => {
    // Pour update, on va d'abord chercher en base le user correspondant
    const user = await getById(id);
    if (!user) {
        return null;
    } else {
        let password;
        
        if (data.password) {
            password = await bcrypt.hash(data.password, 10);
        } else {
            password = user.password;
        }

        // On met à jour, en réécrivant les champs potentiellement manquant, grace au user récupéré
        const [req, err] = await db.query("UPDATE users SET email = ?, password = ? WHERE id = ? LIMIT 1", 
        [
            data.email || user.email, 
            password, 
            id
        ]);
        if (!req) {
            return null;
        }
        // Finalement, on retourne le user modifié
        return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
    // Si la suppresion a fonctionné, on renvoie "true", sinon "false"
    if (!req) {
        return false;
    }
    return true;
};

const getByEmailAndPassword = async (data) => {
    const user = await getByEmail(data);
    if (!user) { 
        return null;
    }

    const hashedPassword = await bcrypt.compare(data.password, user.password);
    
    if (hashedPassword) {
        return user; 
    } else {
        return null;
    }
}

const getByEmail = async (data) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE email = ?", [data.email]);
    if (!user || user.length == 0) {
        return null;
    }
    return user[0];
}

// On exporte toutes les fonctions écrites ici
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
    getByEmailAndPassword,
    getByEmail
};