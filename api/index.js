const app = require("express")();
const { v4 } = require("uuid");

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

const { projects } = require("./data.json");

// SET VIEW ENGINE
app.set("view engine", "pug");

// STATIC MIDDLEWARE
app.use("/static", express.static("public"));

// HOME ROUTE
app.get("/", (req, res, next) => {
  res.render("index", { projects });
});

// ABOUT ROUTE
app.get("/about", (req, res) => {
  res.render("about");
});

// PROJECT ROUTE
app.get("/project/:id", (req, res, next) => {
  const project = projects[req.params.id];
  if (project) {
    res.render("project", { project });
  } else {
    next();
  }
});

// 404 HANDLER
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "That page doesn't exist!";
  next(err);
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.log(`${err.message} Status: ${err.status}`);
    res.render("page-not-found", { err });
  } else if (err.status === 500) {
    err.status = 500;
    err.message = "Sorry, there seems to be a server issue!";
    res.render("error", { err });
    console.log(`${err.message} Status: ${err.status}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

module.exports = app;
