const User = require('../models/User');

exports.showLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    User.findByEmail(email, (err, user) => {
        if (err || !user) {
            return res.render('auth/login', { 
                title: 'Iniciar Sesión',
                error: 'Usuario no encontrado' 
            });
        }
        
        if (User.comparePassword(password, user.password)) {
            req.session.user = {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            };
            res.redirect('/dashboard');
        } else {
            res.render('auth/login', { 
                title: 'Iniciar Sesión',
                error: 'Contraseña incorrecta' 
            });
        }
    });
};

exports.showRegister = (req, res) => {
    res.render('auth/register', { title: 'Registrarse' });
};

exports.register = (req, res) => {
    const { nombre, email, password, confirm_password } = req.body;
    
    if (password !== confirm_password) {
        return res.render('auth/register', { 
            title: 'Registrarse',
            error: 'Las contraseñas no coinciden' 
        });
    }
    
    User.create({ nombre, email, password }, (err, userId) => {
        if (err) {
            return res.render('auth/register', { 
                title: 'Registrarse',
                error: 'Error al registrar usuario. El email puede estar duplicado.' 
            });
        }
        
        res.redirect('/auth/login');
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};
