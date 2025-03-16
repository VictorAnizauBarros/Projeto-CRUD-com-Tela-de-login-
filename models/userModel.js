const db = require('../config/db');
const bcrypt = require('bcryptjs')

const User = {
    loginUser: (email, password, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, result) => {
            if (err) throw err;

            if (result.length == 0) { 
                return callback(null); 
            }

            const user = result[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return callback(user);  // Senha correta
                } else {
                    return callback(null);  // Senha incorreta
                }
            });

        });
    },
    getAllUsers: (callback) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    getUserById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            callback(result[0]);
        });
    },

    addUser: (data, callback) => {
        const sql = 'INSERT INTO users SET ?';
        db.query(sql, data, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },

    updateUser: (id, data, callback) => {
        const sql = 'UPDATE users SET ? WHERE id = ?';
        db.query(sql, [data, id], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },

    deleteUser: (id, callback) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
};

User.getUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) throw err;
        callback(result[0]);  
    });
};

module.exports = User;
