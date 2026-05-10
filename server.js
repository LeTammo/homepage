const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const globals = {};

app.get('/', (req, res) => {
    res.render('home/home', { ...globals, ...{ activePage: 'home' } });
});

app.get('/about', (req, res) => {
    res.render('about/about', { ...globals, ...{ activePage: 'about' } });
});

app.get('/projects', (req, res) => {
    res.render('projects/projects', { ...globals, ...{ activePage: 'projects' } });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
