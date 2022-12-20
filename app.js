const express = require('express');
const { projects } = require('./data.json');
const app = express();

// SET VIEW ENGINE
app.set('view engine', 'pug');

// STATIC MIDDLEWARE
app.use('/static', express.static('public'));

// HOME ROUTE
app.get('/', (req, res) => {
  res.render('index', { projects });
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));