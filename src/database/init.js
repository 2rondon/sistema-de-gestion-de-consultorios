const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

// Eliminar base de datos existente si queremos empezar de cero
if (fs.existsSync(dbPath)) {
    console.log('Eliminando base de datos existente...');
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

// Ejecutar SQL de creación de tablas
db.exec(initSQL, (err) => {
    if (err) {
        console.error('Error inicializando base de datos:', err);
        db.close();
        return;
    }
    
    console.log('✅ Tablas creadas correctamente');
    
    // Crear usuario admin con contraseña correcta
    const adminEmail = 'admin@consultorio.com';
    const adminPassword = 'admin123';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    
    console.log('🔐 Creando usuario administrador...');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Hash generado: ${hashedPassword}`);
    
    // Verificar si ya existe el usuario
    db.get('SELECT id FROM usuarios WHERE email = ?', [adminEmail], (err, existingUser) => {
        if (err) {
            console.error('Error verificando usuario:', err);
            db.close();
            return;
        }
        
        if (existingUser) {
            // Actualizar contraseña del admin existente
            db.run('UPDATE usuarios SET password = ? WHERE email = ?', [hashedPassword, adminEmail], (err) => {
                if (err) {
                    console.error('Error actualizando admin:', err);
                } else {
                    console.log('✅ Contraseña de admin actualizada correctamente');
                }
                
                // Crear también un usuario de prueba
                createTestUser();
            });
        } else {
            // Insertar nuevo admin
            db.run(`INSERT INTO usuarios (nombre, email, password, rol) 
                    VALUES (?, ?, ?, ?)`, 
                    ['Administrador', adminEmail, hashedPassword, 'admin'], 
                    function(err) {
                if (err) {
                    console.error('Error creando admin:', err);
                } else {
                    console.log('✅ Usuario admin creado correctamente');
                    console.log(`   ID: ${this.lastID}`);
                }
                
                // Crear también un usuario de prueba
                createTestUser();
            });
        }
    });
});

function createTestUser() {
    const testEmail = 'doctor@prueba.com';
    const testPassword = 'doctor123';
    const hashedTestPassword = bcrypt.hashSync(testPassword, 10);
    
    db.run(`INSERT OR IGNORE INTO usuarios (nombre, email, password, rol) 
            VALUES (?, ?, ?, ?)`, 
            ['Doctor Prueba', testEmail, hashedTestPassword, 'doctor'], 
            function(err) {
        if (err) {
            console.error('Error creando usuario de prueba:', err);
        } else if (this.changes > 0) {
            console.log('✅ Usuario de prueba creado correctamente');
            console.log(`   Email: ${testEmail}`);
            console.log(`   Password: ${testPassword}`);
        }
        
        // Mostrar todos los usuarios creados
        console.log('\n📋 Usuarios en la base de datos:');
        db.all('SELECT id, nombre, email, rol FROM usuarios', [], (err, users) => {
            if (err) {
                console.error('Error listando usuarios:', err);
            } else {
                console.table(users);
            }
            
            console.log('\n🎉 Base de datos inicializada correctamente!');
            console.log('\n🔑 Credenciales de acceso:');
            console.log('   1. Admin:');
            console.log('      📧 admin@consultorio.com');
            console.log('      🔑 admin123');
            console.log('   2. Doctor Prueba:');
            console.log('      📧 doctor@prueba.com');
            console.log('      🔑 doctor123');
            
            db.close();
        });
    });
}
