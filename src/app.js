const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const configRoutes = require('./routes/configRoutes');
const { isAuthenticated } = require('./middleware/auth');

const app = express();

// Configuraciones
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Especificar el layout principal
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'consultorio_medico_secret_key_2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }
}));

// Variables globales para vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.currentRoute = req.path;
    next();
});

// Rutas
app.use('/auth', authRoutes);
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/pacientes', isAuthenticated, pacienteRoutes);
app.use('/citas', isAuthenticated, citaRoutes);
app.use('/recipes', isAuthenticated, recipeRoutes);
app.use('/reportes', isAuthenticated, reporteRoutes);
app.use('/configuracion', isAuthenticated, configRoutes);

// Ruta principal
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
