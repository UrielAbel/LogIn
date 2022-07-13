const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const passportHttp = require('passport-http');
const logout = require('express-passport-logout');

const User = require('./user.js');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3000000 }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Rutas Get
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hola, ${req.user.username}.
  Tu session se acabará en ${Math.floor(req.session.cookie.maxAge / (1000 * 60))} 
  minutos.
  <a href="/logout">Log Out</a><br>
  <a href="/secret">Página secreta</a>`);
});

app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/static/secret-page.html');
});

app.get('/logout', logout(), function(req, res) {
  res.redirect('/login');
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + '/static/test.html');
})

app.get("/singup", (req, res) => {
  res.sendFile(__dirname + '/static/singup.html');
})


// Rutas Post
app.post("/singup", (req, res) => {
  // Acá vendría la verificación de existencia de la cuenta a crear
  if (!User.findByUsername(req.body.username)) {
    User.register({ username: req.body.username, active: false }, req.body.password);
    return res.send("cuenta creada")
  } else {
    return res.send("ya hay una cuenta a ese nombre")
  }
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }) , function(req, res) {
	res.redirect('/dashboard');
});

// Server
app.listen(port, () => {
  console.log(`Server on port: ${port}`)
});