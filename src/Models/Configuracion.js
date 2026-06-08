const db = require('../database/db');

class Configuracion {
    static get(callback) {
        db.get('SELECT * FROM configuracion WHERE id = 1', callback);
    }

    static update(configData, callback) {
        const { doctor_nombre, numero_colegiado, rif, email, telefono, direccion } = configData;
        
        db.run(`UPDATE configuracion SET 
                doctor_nombre = ?, numero_colegiado = ?, rif = ?, 
                email = ?, telefono = ?, direccion = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = 1`,
            [doctor_nombre, numero_colegiado, rif, email, telefono, direccion],
            callback
        );
    }
}

module.exports = Configuracion;