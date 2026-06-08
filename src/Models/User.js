const db = require('../database/db');
const bcrypt = require('bcryptjs');

class User {
    static findByEmail(email, callback) {
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], callback);
    }

    static create(userData, callback) {
        const { nombre, email, password } = userData;
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        db.run('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    }

    static comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}

module.exports = User;