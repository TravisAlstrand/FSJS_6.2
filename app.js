const express = require('express');
const { projects } = require('./data.json');
const app = express();

// SET VIEW ENGINE
app.set('view engine', 'pug');

// STATIC MIDDLEWARE
app.use('/static', express.static('public'));

// HOME ROUTE
app.get('/', (req, res, next) => {
  res.render('index', { projects });
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about');
});

// PROJECT ROUTE
app.get('/project/:id', (req, res, next) => {
  const project = projects[req.params.id];
  if (project) {
    res.render('project', { project });
  } else {
    console.log('calling next')
    next();
  };
});

// 404 HANDLER
app.use((req, res, next) => {
  console.log('404 handler called')
  const err = new Error();
  err.status = 404;
  err.message = "That page doesn't exist!";
  next(err);
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.log(`${err.message} Status: ${err.status}`);
    res.render('page-not-found', { err });
  } else if (err.status === 500) {
    err.status = 500;
    err.message = 'Sorry, there seems to be a server issue!';
    res.render('error', { err });
    console.log(`${err.message} Status: ${err.status}`)
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));