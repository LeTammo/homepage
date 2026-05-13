const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Load locale files once at startup
const locales = {
    en: JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', 'en.json'), 'utf8')),
    de: JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', 'de.json'), 'utf8')),
};

// Language detection middleware: ?lang query param > cookie > default 'en'
app.use((req, res, next) => {
    let lang = req.query.lang;

    if (!lang) {
        const cookieHeader = req.headers.cookie || '';
        const match = cookieHeader.match(/(?:^|;\s*)lang=([^;]+)/);
        lang = match ? match[1] : null;
    }

    if (!lang || !locales[lang]) lang = 'en';

    // Persist choice in a long-lived cookie when set via query param
    if (req.query.lang && locales[req.query.lang]) {
        res.setHeader('Set-Cookie', `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`);
    }

    res.locals.t = locales[lang];
    res.locals.lang = lang;
    next();
});

const globals = {};

app.get('/', (req, res) => {
    res.render('home/home', { ...globals, activePage: 'home', title: 'mathia.xyz' });
});

app.get('/about', (req, res) => {
    res.render('about/about', { ...globals, activePage: 'about', title: res.locals.t.about.title + ' | mathia.xyz' });
});

app.get('/projects', (req, res) => {
    res.render('projects/projects', { ...globals, activePage: 'projects', title: res.locals.t.projects.title + ' | mathia.xyz' });
});

app.get('/impressum', (req, res) => {
    res.render('impressum/impressum', { ...globals, activePage: 'impressum', title: res.locals.t.impressum.title + ' | mathia.xyz' });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
