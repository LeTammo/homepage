const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const globals = {
    'navItems' : JSON.parse(fs.readFileSync('src/config/navigation.json', 'utf-8')),
}

app.get('/', (req, res) => {
    res.render('home', { ...globals, ...{ activePage: 'home' } });
});

app.get('/about', (req, res) => {
    res.render('about/about', { ...globals, ...{ activePage: 'about' } });
});

app.get('/projects', (req, res) => {
    res.render('projects', { ...globals, ...{ activePage: 'projects' } });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
