const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Home', activePage: 'home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me', activePage: 'about' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Projects', activePage: 'projects' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
